import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIRiskAnalyzer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400 mb-8 text-center drop-shadow-lg">
        🌌 AR Visualization
      </h1>

      {/* QR Code Card */}
      <div className="bg-gray-900/70 border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center hover:shadow-cyan-500/20 transition duration-300">
        <img
          src="/AR_QR.jpg"
          alt="QR Code for AR Experience"
          className="w-64 h-64 rounded-xl border border-cyan-500/30 hover:scale-105 transition-transform duration-300"
        />

        <p className="mt-6 text-gray-300 text-sm md:text-base text-center max-w-md leading-relaxed">
          📱 Scan the QR code using your mobile device to launch the interactive{" "}
          <span className="text-cyan-400 font-semibold">AR Asteroid Visualization</span>.  
          Move around and explore asteroids in augmented reality!
        </p>
      </div>
    </div>
  );
};

export default AIRiskAnalyzer;
