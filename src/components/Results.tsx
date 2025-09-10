import React, { useEffect, useState } from 'react';
import { ImpactResults } from '../types/simulator';
import { Download, Zap, Target, Flame, Waves } from 'lucide-react';
import { formatNumber } from '../utils/physics';

interface ResultsProps {
  results: ImpactResults | null;
  cityName: string;
}

const AnimatedNumber: React.FC<{ value: number; decimals?: number; suffix?: string }> = ({ 
  value, 
  decimals = 2, 
  suffix = '' 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = (step / steps) * value;
      
      if (step >= steps) {
        current = value;
        clearInterval(timer);
      }
      
      setDisplayValue(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {formatNumber(displayValue, decimals)}{suffix}
    </span>
  );
};

const Results: React.FC<ResultsProps> = ({ results, cityName }) => {
  if (!results) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run a simulation to see impact results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              Impact Results
            </h3>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              <AnimatedNumber value={results.energy} decimals={1} suffix=" Mt" />
            </div>
            <div className="text-sm text-gray-300">Energy (TNT Equivalent)</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              <AnimatedNumber value={results.craterDiameter} decimals={1} suffix=" km" />
            </div>
            <div className="text-sm text-gray-300">Crater Diameter</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-white">Damage Zones</h4>
            <p className="text-sm text-gray-400">Impact at {cityName}</p>
          </div>
        </div>
      </div>

      {/* Damage Zones */}
      <div className="glass-card p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Damage Radii</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-red-300 font-medium">Crater Zone</span>
                <span className="text-white font-mono">
                  <AnimatedNumber value={results.craterDiameter} decimals={1} suffix=" km" />
                </span>
              </div>
              <div className="text-xs text-gray-400">Complete destruction</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-orange-300 font-medium">Thermal Zone</span>
                <span className="text-white font-mono">
                  <AnimatedNumber value={results.thermalRadius} decimals={1} suffix=" km" />
                </span>
              </div>
              <div className="text-xs text-gray-400">Severe burns, fires</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-yellow-300 font-medium">Shockwave Zone</span>
                <span className="text-white font-mono">
                  <AnimatedNumber value={results.shockwaveRadius} decimals={1} suffix=" km" />
                </span>
              </div>
              <div className="text-xs text-gray-400">Building damage, injuries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;