// src/pages/ImpactAnalysis.tsx
import React, { useEffect, useState } from "react";
import PageIntroModal from "../components/PageIntroModal";

import TutorialButton from "../components/TutorialButton";
const API_KEY = "1P7WUiuH31fTCPBiu4RHCoEesGQ4L4hxkYAas7sH";

export default function ImpactAnalysis() {
  const [apod, setApod] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Fetch APOD data
    const today = new Date().toISOString().split("T")[0];
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${today}`)
      .then((res) => res.json())
      .then((data) => setApod(data));

    // Show intro dialog if not dismissed before
    const dismissed = localStorage.getItem("impactAnalysisIntroDismissed");
    if (!dismissed) {
      setShowIntro(true);
    }
  }, []);

  const closeIntro = () => {
    localStorage.setItem("impactAnalysisIntroDismissed", "yes");
    setShowIntro(false);
  };

  const openIntro = () => setShowIntro(true);

  return (
    <>
      {showIntro && (
        <PageIntroModal
          title="Space Knowledge Hub"
          descriptionLines={[
            "Explore quick facts about planets, stars, galaxies, and space missions",
          ]}
          onClose={closeIntro}
        />
      )}

      {/* Floating Tutorial Button */}
      {!showIntro && <TutorialButton onClick={openIntro} />}

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-200 px-6 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-yellow-400 drop-shadow-lg">
          🌌 Space Knowledge Hub
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Planet Profiles */}
          <section className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 hover:scale-[1.02] hover:shadow-2xl transition-transform">
            <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-gray-600 pb-2">
              🪐 Planet Profiles
            </h2>
            <p className="mb-4 text-gray-300">
              Our Solar System consists of 8 planets, each unique in its size,
              atmosphere, and moons. Explore quick facts below:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li><b>Mercury</b> – Smallest planet, no moons.</li>
              <li><b>Venus</b> – Hottest planet, thick CO₂ atmosphere.</li>
              <li><b>Earth</b> – Supports life, 1 Moon.</li>
              <li><b>Mars</b> – Red Planet, 2 moons: Phobos & Deimos.</li>
              <li><b>Jupiter</b> – Largest planet, 79+ moons.</li>
              <li><b>Saturn</b> – Known for its rings, 83 moons.</li>
              <li><b>Uranus</b> – Tilted rotation, 27 moons.</li>
              <li><b>Neptune</b> – Windiest planet, 14 moons.</li>
            </ul>
          </section>

          {/* Stars & Galaxies */}
          <section className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 hover:scale-[1.02] hover:shadow-2xl transition-transform">
            <h2 className="text-2xl font-bold mb-4 text-purple-400 border-b border-gray-600 pb-2">
              ⭐ Stars & Galaxies
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Stars are nuclear furnaces powering galaxies. When massive stars die,
              they explode as <b>supernovas</b>, sometimes leaving behind{" "}
              <b>black holes</b>. Our galaxy, the <b>Milky Way</b>, is a barred
              spiral galaxy containing over 100 billion stars.
            </p>
          </section>

          {/* Missions */}
          <section className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 hover:scale-[1.02] hover:shadow-2xl transition-transform">
            <h2 className="text-2xl font-bold mb-4 text-green-400 border-b border-gray-600 pb-2">
              🚀 Missions & Discoveries
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-200">
              <li><b>Chandrayaan-3</b> – India’s successful lunar landing (2023).</li>
              <li><b>Artemis</b> – NASA’s mission to return humans to the Moon.</li>
              <li><b>Hubble</b> – Space telescope providing deep space images.</li>
            </ul>
          </section>

          {/* Fun Fact with APOD */}
          {apod && (
            <section className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 p-6 hover:scale-[1.02] hover:shadow-2xl transition-transform">
              <h2 className="text-2xl font-bold mb-4 text-pink-400 border-b border-gray-600 pb-2">
                ✨ Fun Fact of the Day
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                {apod.explanation}
              </p>

              {apod.media_type === "image" ? (
                <img
                  src={apod.url}
                  alt={apod.title}
                  className="rounded-xl shadow-lg border border-gray-600 w-full"
                />
              ) : (
                <iframe
                  src={apod.url}
                  title={apod.title}
                  className="w-full h-72 rounded-xl shadow-lg border border-gray-600"
                  allowFullScreen
                />
              )}

              <p className="text-sm mt-3 italic text-gray-400">
                NASA APOD ({apod.date}): {apod.title}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
