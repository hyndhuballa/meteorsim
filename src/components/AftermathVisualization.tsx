"use client";
import { useState, useEffect } from "react";
import { Shield, Rocket, Satellite, AlertTriangle, Target } from "lucide-react";

interface Method {
  id: number;
  title: string;
  icon: string; // backend returns a keyword like "satellite" | "rocket" etc.
  description: string;
}

export default function AftermathVisualization() {
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Map API icon keyword → Lucide icon
  const iconMap: Record<string, JSX.Element> = {
    satellite: <Satellite size={36} className="text-cyan-400" />,
    rocket: <Rocket size={36} className="text-red-400" />,
    nuclear: <AlertTriangle size={36} className="text-yellow-400" />,
    shield: <Shield size={36} className="text-green-400" />,
    laser: <Target size={36} className="text-purple-400" />,
    defense: <AlertTriangle size={36} className="text-orange-400" />,
  };

  useEffect(() => {
    const fetchMethods = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/aftermath");
        if (!res.ok) throw new Error("Failed to fetch aftermath data");
        const data = await res.json();
        setMethods(data.methods);
      } catch (err) {
        console.error("Failed to load mitigation methods:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  // Format description text
  const formatDescription = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (/^[\u2600-\u27BF\ufe0f\u{1F300}-\u{1FAFF}]/u.test(line)) {
        return (
          <p key={i} className="mt-3 text-yellow-400 font-semibold">
            {line}
          </p>
        );
      }
      return (
        <p key={i} className="text-gray-200 text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="p-10 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-10 text-center">
        ☄️ Asteroid Impact Mitigation Strategies
      </h1>

      {/* Loading state */}
      {loading ? (
        <p className="text-center text-gray-400">Loading mitigation methods...</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => setActiveCard(method.id)}
              className="p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg 
                         cursor-pointer hover:scale-105 transform transition-all duration-300 flex flex-col items-center"
            >
              {iconMap[method.icon] || <Shield size={36} className="text-gray-400" />}
              <h2 className="text-lg font-bold mt-3 text-center">{method.title}</h2>
              <p className="text-xs text-gray-400 mt-2">(Click to explore)</p>
            </div>
          ))}
        </div>
      )}

      {/* Expanded modal view */}
      {activeCard !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl 
                          w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] p-6 relative 
                          transform transition-all duration-500 scale-100 overflow-y-auto">
            <button
              onClick={() => setActiveCard(null)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
            >
              ✖ Close
            </button>

            <div className="flex flex-col items-center text-center">
              {iconMap[methods.find((m) => m.id === activeCard)?.icon || "shield"]}
              <h2 className="text-2xl font-bold mt-3 text-yellow-400">
                {methods.find((m) => m.id === activeCard)?.title}
              </h2>
              <div className="mt-5 text-left space-y-2 max-w-2xl">
                {formatDescription(
                  methods.find((m) => m.id === activeCard)?.description || ""
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
