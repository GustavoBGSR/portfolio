"""Backend API tests for Gustavo Borges Landing."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://site-rapid.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health/Root ---
class TestRoot:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data


# --- Stats endpoint ---
class TestStats:
    def test_get_stats_default(self, client):
        r = client.get(f"{API}/stats")
        assert r.status_code == 200
        data = r.json()
        # required fields
        assert "sites_delivered" in data
        assert "niches" in data
        assert "updated_at" in data
        assert isinstance(data["sites_delivered"], int)
        assert isinstance(data["niches"], list)
        # no _id leak
        assert "_id" not in data
        assert "key" not in data

    def test_put_stats_sites_delivered_and_persists(self, client):
        # capture original to restore
        original = client.get(f"{API}/stats").json()

        r = client.put(f"{API}/stats", json={"sites_delivered": 15})
        assert r.status_code == 200
        data = r.json()
        assert data["sites_delivered"] == 15
        assert "_id" not in data

        # verify persistence
        r2 = client.get(f"{API}/stats")
        assert r2.status_code == 200
        assert r2.json()["sites_delivered"] == 15

        # restore original value
        client.put(f"{API}/stats", json={
            "sites_delivered": original["sites_delivered"],
            "niches": original["niches"],
        })

    def test_put_stats_niches_update(self, client):
        original = client.get(f"{API}/stats").json()
        new_niches = ["TEST_Alpha", "TEST_Beta"]
        r = client.put(f"{API}/stats", json={"niches": new_niches})
        assert r.status_code == 200
        data = r.json()
        assert data["niches"] == new_niches

        # verify persistence
        r2 = client.get(f"{API}/stats")
        assert r2.json()["niches"] == new_niches

        # restore
        client.put(f"{API}/stats", json={"niches": original["niches"]})

    def test_default_niches_exist_on_fresh_get(self, client):
        # after restoring in previous tests, validate defaults exist (string list)
        r = client.get(f"{API}/stats")
        data = r.json()
        assert len(data["niches"]) >= 1
        for n in data["niches"]:
            assert isinstance(n, str)


# --- Leads endpoint ---
class TestLeads:
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
        assert data["contact"] == "+5521999999999"
        assert data["message"] == "Quero um site"
        assert "_id" not in data

    def test_list_leads_no_id_leak(self, client):
        r = client.get(f"{API}/leads")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for lead in data:
            assert "_id" not in lead
            assert "id" in lead
