from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


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


# ---------- Helpers ----------
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
    # hydrate
    if isinstance(existing.get("updated_at"), str):
        existing["updated_at"] = datetime.fromisoformat(existing["updated_at"])
    existing.pop("key", None)
    return Stats(**existing)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Gustavo Borges Landing API"}


@api_router.get("/stats", response_model=Stats)
async def get_stats():
    return await ensure_stats()


@api_router.put("/stats", response_model=Stats)
async def update_stats(payload: StatsUpdate):
    current = await ensure_stats()
    data = current.model_dump()
    if payload.sites_delivered is not None:
        data["sites_delivered"] = max(0, int(payload.sites_delivered))
    if payload.niches is not None:
        data["niches"] = payload.niches
    data["updated_at"] = datetime.now(timezone.utc)

    doc = {**data, "updated_at": data["updated_at"].isoformat(), "key": STATS_KEY}
    await db.stats.update_one({"key": STATS_KEY}, {"$set": doc}, upsert=True)
    return Stats(**data)


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.leads.insert_one(doc)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
