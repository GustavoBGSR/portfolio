"""Backend API tests for Gustavo Borges Landing — admin auth + stats + leads.

Covers:
- Public stats GET (no auth)
- Public lead POST (no auth)
- Admin /admin/login (correct/wrong password, brute-force lockout)
- Admin /admin/verify (with/without/invalid token)
- Protected PUT /api/stats (auth required + persistence)
- Protected GET /api/leads (auth required + no _id leak)
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "gustavo2026"


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _reset_lockout():
    """Best-effort cleanup of login_attempts via direct mongo (not exposed via API).
    Falls back gracefully — brute-force tests are isolated last so it's ok if this
    can't run from inside the testing container."""
    try:
        from pymongo import MongoClient
        mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        db_name = os.environ.get("DB_NAME", "test_database")
        mc = MongoClient(mongo_url, serverSelectionTimeoutMS=2000)
        mc[db_name]["login_attempts"].delete_many({})
        mc.close()
        return True
    except Exception:
        return False


@pytest.fixture(scope="module")
def admin_token(client):
    """Get a valid admin token. Reset lockouts first to be safe."""
    _reset_lockout()
    r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Cannot obtain admin token: {r.status_code} {r.text}")
    data = r.json()
    assert "token" in data
    return data["token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Public root ----------
class TestRoot:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Public stats GET ----------
class TestPublicStats:
    def test_get_stats_default(self, client):
        r = client.get(f"{API}/stats")
        assert r.status_code == 200
        data = r.json()
        assert "sites_delivered" in data
        assert "niches" in data
        assert "updated_at" in data
        assert isinstance(data["sites_delivered"], int)
        assert isinstance(data["niches"], list)
        # No mongo / internal leaks
        assert "_id" not in data
        assert "key" not in data


# ---------- Public lead POST ----------
class TestPublicLeads:
    def test_create_lead_all_optional(self, client):
        r = client.post(f"{API}/leads", json={})
        assert r.status_code == 200
        data = r.json()
        assert "id" in data
        assert isinstance(data["id"], str)
        assert data["source"] == "website"
        assert "_id" not in data

    def test_create_lead_with_fields(self, client):
        payload = {
            "name": "TEST_Maria",
            "business_type": "Restaurante",
            "contact": "+5521999999999",
            "message": "Quero um site",
            "source": "website",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Maria"
        assert data["business_type"] == "Restaurante"
        assert "_id" not in data


# ---------- Admin login ----------
class TestAdminLogin:
    def test_login_correct_password(self, client):
        _reset_lockout()
        r = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str)
        assert "expires_at" in data
        assert "_id" not in data

    def test_login_wrong_password(self, client):
        _reset_lockout()
        r = client.post(f"{API}/admin/login", json={"password": "wrong-password-xyz"})
        assert r.status_code == 401
        body = r.json()
        # FastAPI default: {"detail": "Senha incorreta"}
        assert "Senha incorreta" in str(body)
        # Cleanup so other tests don't inherit a partial-failure count
        _reset_lockout()


# ---------- Admin verify ----------
class TestAdminVerify:
    def test_verify_no_token(self, client):
        r = client.get(f"{API}/admin/verify")
        assert r.status_code == 401

    def test_verify_invalid_token(self, client):
        r = client.get(
            f"{API}/admin/verify",
            headers={"Authorization": "Bearer not.a.real.jwt"},
        )
        assert r.status_code == 401

    def test_verify_valid_token(self, client, auth_headers):
        r = client.get(f"{API}/admin/verify", headers=auth_headers)
        assert r.status_code == 200
        assert r.json() == {"ok": True}


# ---------- Protected PUT /stats ----------
class TestProtectedStats:
    def test_put_stats_no_token(self, client):
        r = client.put(f"{API}/stats", json={"sites_delivered": 99})
        assert r.status_code == 401
        assert "Missing admin token" in str(r.json())

    def test_put_stats_with_token_and_persists(self, client, auth_headers):
        # capture original
        original = client.get(f"{API}/stats").json()

        new_niches = ["TEST_Alpha", "TEST_Beta"]
        r = client.put(
            f"{API}/stats",
            json={"sites_delivered": 15, "niches": new_niches},
            headers=auth_headers,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["sites_delivered"] == 15
        assert data["niches"] == new_niches
        assert "_id" not in data

        # Verify persistence via public GET
        r2 = client.get(f"{API}/stats")
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["sites_delivered"] == 15
        assert d2["niches"] == new_niches

        # Restore
        client.put(
            f"{API}/stats",
            json={
                "sites_delivered": original["sites_delivered"],
                "niches": original["niches"],
            },
            headers=auth_headers,
        )


# ---------- Protected GET /leads ----------
class TestProtectedLeads:
    def test_list_leads_no_token(self, client):
        r = client.get(f"{API}/leads")
        assert r.status_code == 401

    def test_list_leads_with_token(self, client, auth_headers):
        r = client.get(f"{API}/leads", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for lead in data:
            assert "_id" not in lead
            assert "id" in lead


# ---------- Brute-force lockout (run last) ----------
class TestBruteForce:
    def test_brute_force_lockout_after_5_fails(self, client):
        # Ensure clean state for this IP
        if not _reset_lockout():
            pytest.skip("Cannot reset login_attempts collection; skipping lockout test")

        wrong_payload = {"password": "definitely-wrong-bf-test"}
        statuses = []
        for _ in range(5):
            r = client.post(f"{API}/admin/login", json=wrong_payload)
            statuses.append(r.status_code)
            time.sleep(0.05)

        # First 5 should be 401 (or last one may already be 429 if check runs after register)
        assert all(s in (401, 429) for s in statuses), statuses
        assert statuses.count(401) >= 4

        # 6th attempt — even with CORRECT password — must be locked out
        r6 = client.post(f"{API}/admin/login", json={"password": ADMIN_PASSWORD})
        assert r6.status_code == 429, f"expected 429 lockout, got {r6.status_code}: {r6.text}"
        assert "Muitas tentativas" in str(r6.json())

        # Cleanup: clear the lockout so we don't disrupt other testing
        _reset_lockout()
