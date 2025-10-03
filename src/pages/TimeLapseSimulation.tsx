import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_KEY = "1P7WUiuH31fTCPBiu4RHCoEesGQ4L4hxkYAas7sH";

export default function TimeLapseSimulation() {
  const [missions, setMissions] = useState<any[]>([]);
  const [launches, setLaunches] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // NASA Patents/Innovations
    fetch(`https://api.nasa.gov/techtransfer/patent/?engine&api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMissions(data.results.slice(0, 15))); // top 15

    // Space Launch Data (TheSpaceDevs API - 50 launches)
    fetch("https://llapi.thespacedevs.com/2.2.0/launch/?limit=50")
      .then((res) => res.json())
      .then((data) => setLaunches(data.results));
  }, []);

  // Historic Events (static but merged with API in UI)
  const staticEvents = [
    { year: "1957", event: "Sputnik 1 – First artificial satellite" },
    { year: "1961", event: "Yuri Gagarin – First human in space" },
    { year: "1969", event: "Apollo 11 – Humans land on the Moon" },
    { year: "1990", event: "Hubble Space Telescope launched" },
    { year: "1997", event: "Mars Pathfinder Rover explores Mars" },
    { year: "2004", event: "Spirit and Opportunity rovers on Mars" },
    { year: "2012", event: "Curiosity rover lands on Mars" },
    { year: "2021", event: "James Webb Space Telescope launched" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-gray-200 px-6 py-10 flex flex-col items-center">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-green-400 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-green-400 text-center mb-10">
        📜 Timeline of Space Exploration
      </h1>

      {/* Scrollable Timeline */}
      <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto pr-4 space-y-12">
        {/* Category 1: Historic Events */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-6">
            🔭 Historic Events
          </h2>
          <div className="space-y-6">
            {staticEvents.map((item, idx) => (
              <div
                key={idx}
                className="glass-card border-l-4 border-green-400 pl-6 py-4 hover:scale-[1.02] transition rounded-lg shadow-lg"
              >
                <h2 className="text-xl font-bold">{item.year}</h2>
                <p className="text-gray-300">{item.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category 2: NASA Innovations */}
        {missions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              🚀 NASA Innovations
            </h2>
            <div className="space-y-6">
              {missions.map((m, i) => (
                <div
                  key={i}
                  className="glass-card border-l-4 border-blue-400 pl-6 py-4 hover:scale-[1.02] transition rounded-lg shadow-lg"
                >
                  <h3 className="font-bold text-lg mb-2">{m[1]}</h3>
                  <p className="text-gray-400 text-sm">{m[2]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category 3: Recent & Upcoming Launches */}
        {launches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-6">
              🌍 Space Launches
            </h2>
            <div className="space-y-6">
              {launches.map((launch, i) => (
                <div
                  key={i}
                  className="glass-card border-l-4 border-purple-400 pl-6 py-4 hover:scale-[1.02] transition rounded-lg shadow-lg"
                >
                  <h3 className="font-bold text-lg">{launch.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(launch.window_start).toLocaleDateString()} —{" "}
                    {launch.pad?.location?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
