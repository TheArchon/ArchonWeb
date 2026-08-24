from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_start_rejects_unknown_session_type():
    response = client.post("/api/auth/start", json={"session_type": "unknown"})
    assert response.status_code == 422
