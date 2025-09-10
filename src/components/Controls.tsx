import React from 'react';
import { City } from '../types/simulator';
import { Play, Settings } from 'lucide-react';

interface ControlsProps {
  cities: City[];
  selectedCity: City | null;
  asteroidSize: number;
  velocity: number;
  onCityChange: (city: City) => void;
  onSizeChange: (size: number) => void;
  onVelocityChange: (velocity: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  cities,
  selectedCity,
  asteroidSize,
  velocity,
  onCityChange,
  onSizeChange,
  onVelocityChange,
  onRunSimulation,
  isSimulating
}) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Impact Parameters
        </h2>
      </div>

      <div className="space-y-6">
        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target City
          </label>
          <select
            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
            value={selectedCity?.name || ''}
            onChange={(e) => {
              const city = cities.find(c => c.name === e.target.value);
              if (city) onCityChange(city);
            }}
          >
            <option value="">Select a city...</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Asteroid Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Asteroid Diameter: {asteroidSize}m
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            value={asteroidSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50m</span>
            <span>1000m</span>
          </div>
        </div>

        {/* Velocity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Impact Velocity: {velocity} km/s
          </label>
          <input
            type="range"
            min="11"
            max="72"
            value={velocity}
            onChange={(e) => onVelocityChange(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>11 km/s</span>
            <span>72 km/s</span>
          </div>
        </div>

        {/* Run Simulation Button */}
        <button
          onClick={onRunSimulation}
          disabled={!selectedCity || isSimulating}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
            !selectedCity || isSimulating
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg hover:shadow-red-500/25 hover:scale-105'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <Play className={`w-6 h-6 ${isSimulating ? 'animate-pulse' : ''}`} />
            {isSimulating ? 'Calculating Impact...' : 'Run Impact Simulation'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Controls;