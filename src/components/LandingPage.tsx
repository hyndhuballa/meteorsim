import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingIntroModal from "./LandingIntroModal";
import {
  Zap,
  Globe,
  Calculator,
  Brain,
  Clock,
  Target,
  Satellite,
  TrendingUp,
} from "lucide-react";
import solarBg from "../solarbg.webp";
import bg3 from "../bg3.webp"; // ✅ Unified background for Sections 3–5

const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [showIntroModal, setShowIntroModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowIntroModal(true);
  }, []);

  const handleCloseIntroModal = () => {
    setShowIntroModal(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {showIntroModal && (
        <LandingIntroModal
          onClose={handleCloseIntroModal}
          videoId="your-video-id"
        />
      )}

      {/* Group 1: Section 1 + 2 with solarBg */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${solarBg})` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Section 1: Hero */}
        <section className="flex flex-col items-center justify-center pt-24 pb-16 text-white relative">
          <div className="relative z-10 text-center">
            <div className="flex justify-center mb-12">
              <div className="p-8 rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-2xl backdrop-blur-lg animate-pulse">
                <Zap className="w-16 h-16 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-lg mb-4">
              Unveiling the Impactor-2025
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-2xl opacity-95 mb-8">
              Experience the mysteries of cosmic impacts with real NASA data,
              AI-powered risk analysis, and stunning interactive visuals.
            </p>
          </div>
        </section>

        {/* Section 2: Simulator Launch */}
        <section className="flex flex-col items-center py-14 relative">
          <div className="relative z-10 bg-black/50 rounded-2xl p-10 backdrop-blur-lg shadow-2xl mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Explore?
            </h2>
            <button
              onClick={onEnterApp}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-fuchsia-600 rounded-xl font-semibold text-2xl shadow-xl hover:scale-105 transition transform duration-200 hover:shadow-2xl flex items-center gap-4"
            >
              <span>Launch Simulator</span>
              <Zap className="w-8 h-8 text-white" />
            </button>
          </div>
        </section>
      </div>

      {/* Group 2: Section 3 + 4 + 5 with bg3 */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg3})` }}
      >
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Section 3: Features */}
        <section className="max-w-6xl mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 px-6 relative z-10 text-white">
          <GlassButton
            icon={<Globe className="w-12 h-12 text-blue-400" />}
            label="Interactive 3D Space"
            desc="Explore our solarsystem, asteroids, comets and planets"
            onClick={() => navigate("/asteroids")}
          />
          <GlassButton
            icon={<Calculator className="w-12 h-12 text-green-400" />}
            label="Scientific Physics Lab"
            desc="Try interactive asteroid physics."
            onClick={() => navigate("/scientific-physics")}
          />
          <GlassButton
            icon={<Satellite className="w-12 h-12 text-purple-400" />}
            label="Live NASA Data"
            desc="Explore real-time NASA asteroid data."
            onClick={() => navigate("/live-nasa-data")}
          />
          <GlassButton
            icon={<Brain className="w-12 h-12 text-cyan-400" />}
            label="AR Visualization"
            desc="Get a closer look at asteroids using AR"
            onClick={() => navigate("/ai-risk-analyzer")}
          />
          <GlassButton
            icon={<Target className="w-12 h-12 text-red-400" />}
            label="Space Knowledge Hub"
            desc="Discover planets, stars, galaxies, and space missions"
            onClick={() => navigate("/impact-analysis")}
          />
          <GlassButton
            icon={<Clock className="w-12 h-12 text-yellow-400" />}
            label="Timeline of Space Exploration"
            desc="Travel through the milestones"
            onClick={() => navigate("/time-lapse-simulation")}
          />
          <GlassButton
            icon={<TrendingUp className="w-12 h-12 text-pink-400" />}
            label="Guardians of Earth"
            desc="Explore asteroid mitigation methods"
            onClick={() => navigate("/aftermath-visualization")}
          />
        </section>

        {/* Section 4: Informational */}
        <section className="py-20 text-white relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
            <div>
              <h3 className="text-4xl font-bold mb-5">
                Impactor-2025: Why It Matters
              </h3>
              <p className="mb-6 text-lg">
                Asteroid impacts have shaped Earth's history. Our simulator
                empowers all users to explore these forces with scientific
                accuracy and stunning visuals.
              </p>
              <ul className="space-y-3 text-gray-300 list-disc list-inside">
                <li>Real NASA & USGS data for precision.</li>
                <li>Model global effects & local aftermaths.</li>
                <li>Discover how mitigation strategies work.</li>
              </ul>
            </div>
            <div>
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
                <h4 className="text-2xl font-bold mb-3 text-center">
                  Impactor Stats
                </h4>
                <div className="space-y-4 font-mono text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-300">
                      Daily debris hitting Earth:
                    </span>
                    <span className="text-blue-400">~50 tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Energy (Chicxulub):</span>
                    <span className="text-red-400">100M Mt TNT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tracked asteroids:</span>
                    <span className="text-green-400">30,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Atmosphere limit:</span>
                    <span className="text-purple-400">~25 meters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Narrative */}
        <section className="py-20 text-white relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold mb-5">
              Unveiling the Impactor-2025 Narrative
            </h3>
            <p className="text-lg opacity-80">
              Discover the story behind Impactor-2025, its cosmic origins, and
              how modern science lets us decode its behavior, risks and
              potential prevention strategies.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

interface GlassButtonProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}

function GlassButton({ icon, label, desc, onClick }: GlassButtonProps) {
  return (
    <button
      className="relative z-10 bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-2xl transition-transform hover:scale-105 flex flex-col items-center text-center"
      onClick={onClick}
    >
      <div className="mb-4">{icon}</div>
      <h4 className="text-lg font-bold mb-2">{label}</h4>
      <p className="text-white/80 text-sm">{desc}</p>
    </button>
  );
}

export default LandingPage;
