from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Timetable Scheduler API is running"}

def test_get_teachers():
    response = client.get("/teachers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
