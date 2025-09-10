import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Users, Zap } from 'lucide-react';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface CityRiskAnalyzerProps {
  selectedCity: City | null;
  cities: City[];
  onCitySelect: (city: City) => void;
}

const RecommendationCard: React.FC<{ title: string; icon: React.ReactNode; items: string[] }> = ({ title, icon, items }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-900/40 p-4 rounded-lg border border-white/10"
  >
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h4 className="font-semibold text-white">{title}</h4>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
          <span className="mt-1 w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

const CityRiskAnalyzer: React.FC<CityRiskAnalyzerProps> = ({ selectedCity, cities, onCitySelect }) => {
  const recommendations = useMemo(() => {
    if (!selectedCity) return null;

    // Mock AI-generated recommendations based on city name hash for variety
    const hash = selectedCity.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const technicalActions = [
      "Deploy DART-like kinetic impactors for trajectory alteration.",
      "Utilize laser ablation to create a 'jet' of vaporized rock, pushing the NEO.",
      "Position gravity tractor spacecraft to slowly pull the NEO off course.",
      "Coordinate global observatories for high-precision orbital tracking.",
    ];

    const civilActions = [
      "Initiate phased evacuation of coastal and high-density urban areas.",
      "Establish public shelters and distribute emergency supply kits (water, food, medical).",
      "Broadcast public service announcements via all channels with clear instructions.",
      "Prepare hospital and emergency services for mass casualty event.",
    ];

    const priorityActions = [
      "Confirm impact location and time with >99.9% accuracy.",
      "Alert national leadership and international partners immediately.",
      "Protect critical infrastructure: power grids, communication hubs, and water supplies.",
    ];

    return {
      technical: [technicalActions[hash % 4], technicalActions[(hash + 1) % 4]],
      civil: [civilActions[hash % 4], civilActions[(hash + 2) % 4]],
      priority: [priorityActions[hash % 3]],
    };
  }, [selectedCity]);

  if (!selectedCity) {
    return (
      <div className="p-4 text-center text-gray-400 h-full flex items-center justify-center">
        <p>Select a city from the 'Impact Controls' to analyze its risk profile and generate AI recommendations.</p>
      </div>
    );
  }

  return (
    <div className="p-1">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-glow flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          AI Risk Analysis
        </h3>
        <p className="text-sm text-gray-300">Recommendations for <span className="font-bold text-white">{selectedCity.name}</span></p>
      </div>

      {recommendations && (
        <div className="space-y-4">
          <RecommendationCard
            title="Priority Actions"
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
            items={recommendations.priority}
          />
          <RecommendationCard
            title="Technical Actions"
            icon={<Shield className="w-5 h-5 text-blue-400" />}
            items={recommendations.technical}
          />
          <RecommendationCard
            title="Civil Actions"
            icon={<Users className="w-5 h-5 text-green-400" />}
            items={recommendations.civil}
          />
        </div>
      )}
    </div>
  );
};

export default CityRiskAnalyzer;