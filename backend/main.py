# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import math, requests
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimInput(BaseModel):
    diameter_m: float      # projectile diameter in meters
    velocity_kms: float    # impact velocity in km/s
    density: float = 3000  # kg/m^3 default dense rock
    angle_deg: float = 45  # impact angle
    lat: float = 0.0
    lon: float = 0.0

MEGATON_J = 4.184e15

@app.post("/simulate")
def simulate(inp: SimInput):
    d = inp.diameter_m
    v = inp.velocity_kms * 1000.0
    rho = inp.density

    # 1) Basic physics: mass & kinetic energy
    volume = (4.0/3.0) * math.pi * (d/2)**3
    mass = rho * volume
    energy_j = 0.5 * mass * v * v
    energy_megatons = energy_j / MEGATON_J

    result = {
        "input": inp.dict(),
        "mass_kg": mass,
        "energy_joules": energy_j,
        "energy_megatons": energy_megatons,
    }

    # 2) Try querying Impact:Earth
    try:
        params = {
            "diam": d,
            "diameterUnits": 1,
            "pdens": inp.density,
            "pdens_select": inp.density,
            "vel": inp.velocity_kms,
            "velocityUnits": 1,
            "theta": inp.angle_deg,
            "tdens": 2500,
        }
        r = requests.get(
            "https://impact.ese.ic.ac.uk/ImpactEarth/cgi-bin/crater.cgi",
            params=params,
            timeout=10
        )
        soup = BeautifulSoup(r.text, "html.parser")
        text = soup.get_text(separator="\n")
        for line in text.splitlines():
            if "Final crater diameter" in line or "Final crater" in line:
                parts = line.split(':')
                if len(parts) >= 2:
                    val = parts[1].strip().split()[0]
                    try:
                        result["final_crater_m"] = float(val)
                    except:
                        pass
    except Exception as e:
        result["warning"] = "Impact:Earth lookup failed: " + str(e)

    return result
