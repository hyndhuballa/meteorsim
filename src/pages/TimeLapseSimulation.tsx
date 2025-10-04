import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageIntroModal from "../components/PageIntroModal";
import TutorialButton from "../components/TutorialButton";

const API_KEY = "1P7WUiuH31fTCPBiu4RHCoEesGQ4L4hxkYAas7sH";

export default function TimeLapseSimulation() {
  const [missions, setMissions] = useState<any[]>([]);
  const [launches, setLaunches] = useState<any[]>([]);
  const [showIntro, setShowIntro] = useState(false);
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

    setShowIntro(true);
  }, []);

  const closeIntro = () => {
    localStorage.setItem("timeLapseSimulationIntroDismissed", "yes");
    setShowIntro(false);
  };

  const openIntro = () => setShowIntro(true);

  // Historic Events (static but merged with API in UI)
  const staticEvents = [
    { year: "1957", event: "Sputnik 1 – First artificial satellite (USSR)" },
    { year: "1961", event: "Yuri Gagarin – First human in space (USSR)" },
    { year: "1962", event: "John Glenn – First American to orbit Earth" },
    { year: "1963", event: "Valentina Tereshkova – First woman in space" },
    { year: "1965", event: "Alexei Leonov – First spacewalk (USSR)" },
    { year: "1966", event: "Luna 9 – First soft landing on the Moon (USSR)" },
    { year: "1967", event: "Apollo 1 tragedy – U.S. crew lost in test" },
    { year: "1968", event: "Apollo 8 – First crewed orbit of the Moon" },
    { year: "1969", event: "Apollo 11 – First humans land on the Moon" },
    { year: "1971", event: "Salyut 1 – First space station (USSR)" },
    { year: "1972", event: "Apollo 17 – Last crewed Moon mission" },
    { year: "1973", event: "Skylab – First U.S. space station" },
    { year: "1975", event: "Apollo-Soyuz Test Project – U.S.-USSR joint mission" },
    { year: "1976", event: "Viking 1 – First successful Mars lander (NASA)" },
    { year: "1981", event: "Space Shuttle Columbia – First shuttle flight" },
    { year: "1983", event: "Sally Ride – First American woman in space" },
    { year: "1986", event: "Mir Space Station launched (USSR)" },
    { year: "1986", event: "Challenger disaster – Shuttle lost after launch" },
    { year: "1990", event: "Hubble Space Telescope launched" },
    { year: "1995", event: "First Shuttle-Mir docking" },
    { year: "1997", event: "Mars Pathfinder – Sojourner rover explores Mars" },
    { year: "1998", event: "International Space Station construction begins" },
    { year: "2000", event: "First permanent ISS crew arrives" },
    { year: "2003", event: "Columbia shuttle disaster" },
    { year: "2003", event: "China launches first astronaut (Yang Liwei)" },
    { year: "2004", event: "SpaceShipOne – First private human spaceflight" },
    { year: "2008", event: "Chandrayaan-1 – India’s first lunar probe" },
    { year: "2011", event: "End of NASA’s Space Shuttle program" },
    { year: "2012", event: "Curiosity Rover lands on Mars" },
    { year: "2014", event: "Rosetta mission lands Philae on a comet (ESA)" },
    { year: "2015", event: "New Horizons – Pluto flyby" },
    { year: "2016", event: "Juno spacecraft orbits Jupiter" },
    { year: "2018", event: "Parker Solar Probe launched" },
    { year: "2019", event: "India’s Chandrayaan-2 lunar mission" },
    { year: "2020", event: "SpaceX Crew Dragon – First private crewed launch" },
    { year: "2021", event: "James Webb Space Telescope launched" },
    { year: "2021", event: "Ingenuity helicopter flies on Mars" },
    { year: "2022", event: "Artemis I – NASA’s return to the Moon program" },
    { year: "2022", event: "DART mission alters asteroid orbit" },
    { year: "2023", event: "India’s Chandrayaan-3 lands on the Moon" },
    { year: "2023", event: "SpaceX Starship’s first orbital test flight" },
    { year: "2024", event: "NASA Artemis II crew announced" },
    { year: "2024", event: "China plans Tiangong Space Station expansion" },
    { year: "2025 (planned)", event: "Artemis III – Humans to return to the Moon" },
    { year: "2026 (planned)", event: "Mars Sample Return mission (NASA-ESA)" },
    { year: "2027 (planned)", event: "Europa Clipper to Jupiter’s moon" },
    { year: "2028 (planned)", event: "First crewed lunar base construction" },
    { year: "2030 (planned)", event: "First crewed Mars orbit missions" },
    { year: "2033 (planned)", event: "NASA crewed Mars landing (goal)" },
  ];
 

  return (
    <>
      {showIntro && (
        <PageIntroModal
          title="Timeline of Space Exploration"
          descriptionLines={[
            "Step into history and explore humanity’s greatest milestones in space",
          ]}
          onClose={closeIntro}
        />
      )}

      {/* Floating Tutorial Button */}
      {!showIntro && <TutorialButton onClick={openIntro} />}

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-gray-200 px-6 py-10 flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-green-400 transition"
          disabled={showIntro}
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
          {/* Historic Events */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-6">
               Historic Events
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

          {/* NASA Innovations */}
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

          {/* Space Launches */}
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
    </>
  );
}
