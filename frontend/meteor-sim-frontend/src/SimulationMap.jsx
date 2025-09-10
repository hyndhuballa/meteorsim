import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle } from "react-leaflet";
import axios from "axios";

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function SimulationMap() {
  const [impact, setImpact] = useState(null);
  const [latlng, setLatlng] = useState({ lat: 20, lng: 0 });

  const runSim = async (diam_m = 20, vel_kms = 17) => {
    try {
      const body = {
        diameter_m: diam_m,
        velocity_kms: vel_kms,
        lat: latlng.lat,
        lon: latlng.lng,
      };
      const resp = await axios.post("http://127.0.0.1:8000/simulate", body);
      const data = resp.data;

      const crater_m =
        data.final_crater_m || Math.cbrt(data.energy_megatons) * 1000;
      const shock_m = crater_m * 5;

      setImpact({
        lat: latlng.lat,
        lon: latlng.lng,
        crater_m,
        shock_m,
        stats: data,
      });
    } catch (err) {
      alert("Failed to run simulation. Check backend is running.");
      console.error(err);
    }
  };

  return (
  <div>
    <div style={{ height: "600px", marginBottom: "10px" }}>
      <MapContainer
        center={[latlng.lat, latlng.lng]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker onPick={(p) => setLatlng({ lat: p.lat, lng: p.lng })} />
        {impact && (
          <>
            <Circle
              center={[impact.lat, impact.lon]}
              radius={impact.crater_m}
              pathOptions={{ color: "red" }}
            />
            <Circle
              center={[impact.lat, impact.lon]}
              radius={impact.shock_m}
              pathOptions={{ color: "orange" }}
            />
          </>
        )}
      </MapContainer>
    </div>

    <div style={{ marginTop: 10 }}>
  <label>
    Asteroid Size (m):{" "}
    <select id="size">
      <option value="20">20 m (Chelyabinsk)</option>
      <option value="50">50 m</option>
      <option value="140">140 m (Hazardous limit)</option>
      <option value="500">500 m</option>
    </select>
  </label>
  <br /><br />
  <label>
    Speed (km/s):{" "}
    <select id="speed">
      <option value="12">12 km/s (slow)</option>
      <option value="17">17 km/s (average)</option>
      <option value="25">25 km/s</option>
      <option value="72">72 km/s (max)</option>
    </select>
  </label>
  <br /><br />
  <button
    onClick={() =>
      runSim(
        parseFloat(document.getElementById("size").value),
        parseFloat(document.getElementById("speed").value)
      )
    }
    style={{ padding: "10px 20px", fontSize: "16px" }}
  >
    Simulate Impact
  </button>
</div>

  </div>
);

}
