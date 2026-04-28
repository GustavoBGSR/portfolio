from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import hmac
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone, timedelta
import jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
JWT_TTL_HOURS = 12
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']

app = FastAPI()
api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)


# ---------- Models ----------
class Stats(BaseModel):
    model_config = ConfigDict(extra="ignore")
    sites_delivered: int = 10
    niches: List[str] = Field(default_factory=lambda: [
        "Restaurantes", "Lojas", "Serviços", "Salões de festa"
    ])
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatsUpdate(BaseModel):
    sites_delivered: int | None = None
    niches: List[str] | None = None


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str | None = None
    business_type: str | None = None
    contact: str | None = None
    message: str | None = None
    source: str = "website"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str | None = None
    business_type: str | None = None
    contact: str | None = None
    message: str | None = None
    source: str = "website"


class AdminLoginPayload(BaseModel):
    password: str


class AdminLoginResponse(BaseModel):
    token: str
    expires_at: datetime


# ---------- Auth helpers ----------
MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def create_admin_token() -> tuple[str, datetime]:
    exp = datetime.now(timezone.utc) + timedelta(hours=JWT_TTL_HOURS)
    payload = {"role": "admin", "exp": exp, "iat": datetime.now(timezone.utc)}
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, exp


async def verify_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> bool:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Missing admin token")
    try:
        payload = jwt.decode(
            credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return True


async def check_lockout(identifier: str):
    record = await db.login_attempts.find_one({"identifier": identifier}, {"_id": 0})
    if not record:
        return
    count = record.get("count", 0)
    locked_until = record.get("locked_until")
    if locked_until:
        lu = (
            datetime.fromisoformat(locked_until)
            if isinstance(locked_until, str)
            else locked_until
        )
        if lu > datetime.now(timezone.utc):
            raise HTTPException(
                status_code=429,
                detail=f"Muitas tentativas. Tente novamente em {int((lu - datetime.now(timezone.utc)).total_seconds() // 60) + 1} min.",
            )
    if count >= MAX_ATTEMPTS:
        # should have been locked; set lockout now
        locked = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$set": {"locked_until": locked.isoformat()}},
        )
        raise HTTPException(
            status_code=429, detail=f"Muitas tentativas. Tente em {LOCKOUT_MINUTES} min."
        )


async def register_failure(identifier: str):
    record = await db.login_attempts.find_one({"identifier": identifier}, {"_id": 0})
    count = (record or {}).get("count", 0) + 1
    update = {"count": count, "last_attempt": datetime.now(timezone.utc).isoformat()}
    if count >= MAX_ATTEMPTS:
        update["locked_until"] = (
            datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)
        ).isoformat()
    await db.login_attempts.update_one(
        {"identifier": identifier}, {"$set": update}, upsert=True
    )


async def clear_failures(identifier: str):
    await db.login_attempts.delete_one({"identifier": identifier})


# ---------- Stats helpers ----------
STATS_KEY = "public"


async def ensure_stats():
    existing = await db.stats.find_one({"key": STATS_KEY}, {"_id": 0})
    if not existing:
        stats = Stats()
        doc = stats.model_dump()
        doc["updated_at"] = doc["updated_at"].isoformat()
        doc["key"] = STATS_KEY
        await db.stats.insert_one(doc)
        return stats
    if isinstance(existing.get("updated_at"), str):
        existing["updated_at"] = datetime.fromisoformat(existing["updated_at"])
    existing.pop("key", None)
    return Stats(**existing)


# ---------- Public routes ----------
@api_router.get("/")
async def root():
    return {"message": "Gustavo Borges Landing API"}


@api_router.get("/stats", response_model=Stats)
async def get_stats():
    return await ensure_stats()


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.leads.insert_one(doc)
    return lead


# ---------- Admin routes ----------
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginPayload, request: Request):
    ip = request.client.host if request.client else "unknown"
    identifier = f"admin:{ip}"
    await check_lockout(identifier)

    if not hmac.compare_digest(payload.password, ADMIN_PASSWORD):
        await register_failure(identifier)
        raise HTTPException(status_code=401, detail="Senha incorreta")

    await clear_failures(identifier)
    token, exp = create_admin_token()
    return AdminLoginResponse(token=token, expires_at=exp)


@api_router.get("/admin/verify")
async def admin_verify(_: bool = Depends(verify_admin)):
    return {"ok": True}


@api_router.put("/stats", response_model=Stats)
async def update_stats(payload: StatsUpdate, _: bool = Depends(verify_admin)):
    current = await ensure_stats()
    data = current.model_dump()
    if payload.sites_delivered is not None:
        data["sites_delivered"] = max(0, int(payload.sites_delivered))
    if payload.niches is not None:
        data["niches"] = [n.strip() for n in payload.niches if n and n.strip()]
    data["updated_at"] = datetime.now(timezone.utc)

    doc = {**data, "updated_at": data["updated_at"].isoformat(), "key": STATS_KEY}
    await db.stats.update_one({"key": STATS_KEY}, {"$set": doc}, upsert=True)
    return Stats(**data)


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(_: bool = Depends(verify_admin)):
    raw = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in raw:
        if isinstance(r.get("created_at"), str):
            r["created_at"] = datetime.fromisoformat(r["created_at"])
    return raw


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    await ensure_stats()
    await db.login_attempts.create_index("identifier", unique=True)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
