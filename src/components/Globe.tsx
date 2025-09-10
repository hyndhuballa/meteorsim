import React, { useState, useEffect } from 'react';
import { City, ImpactResults } from '../types/simulator';

interface GlobeProps {
  selectedCity: City | null;
  impactResults: ImpactResults | null;
  isSimulating: boolean;
}

const Globe: React.FC<GlobeProps> = ({ selectedCity, impactResults, isSimulating }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showRings, setShowRings] = useState(false);

  useEffect(() => {
    if (isSimulating && selectedCity) {
      setIsZoomed(true);
      setTimeout(() => setShowRings(true), 1000);
    } else {
      setIsZoomed(false);
      setShowRings(false);
    }
  }, [isSimulating, selectedCity]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900/20 to-purple-900/20 backdrop-blur-md border border-white/10">
      {/* Globe/Map Background */}
      <div 
        className={`absolute inset-0 transition-transform duration-2000 ease-out ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7) contrast(1.2)',
        }}
      >
        {/* Impact Point */}
        {selectedCity && (
          <div
            className={`absolute w-4 h-4 bg-red-500 rounded-full shadow-lg transition-all duration-1000 ${
              isSimulating ? 'animate-pulse scale-150' : ''
            }`}
            style={{
              left: `${50 + (selectedCity.lng / 180) * 30}%`,
              top: `${50 - (selectedCity.lat / 90) * 30}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
            }}
          />
        )}

        {/* Impact Rings */}
        {showRings && impactResults && (
          <>
            {/* Crater Ring */}
            <div
              className="absolute rounded-full border-4 border-red-500/80 animate-expand-ring"
              style={{
                left: `${50 + (selectedCity?.lng || 0) / 180 * 30}%`,
                top: `${50 - (selectedCity?.lat || 0) / 90 * 30}%`,
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(impactResults.craterDiameter * 2, 100)}px`,
                height: `${Math.min(impactResults.craterDiameter * 2, 100)}px`,
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), inset 0 0 20px rgba(239, 68, 68, 0.3)',
                animationDelay: '0s',
              }}
            />

            {/* Thermal Ring */}
            <div
              className="absolute rounded-full border-4 border-orange-500/60 animate-expand-ring"
              style={{
                left: `${50 + (selectedCity?.lng || 0) / 180 * 30}%`,
                top: `${50 - (selectedCity?.lat || 0) / 90 * 30}%`,
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(impactResults.thermalRadius * 1.5, 200)}px`,
                height: `${Math.min(impactResults.thermalRadius * 1.5, 200)}px`,
                boxShadow: '0 0 25px rgba(251, 146, 60, 0.5), inset 0 0 15px rgba(251, 146, 60, 0.2)',
                animationDelay: '0.5s',
              }}
            />

            {/* Shockwave Ring */}
            <div
              className="absolute rounded-full border-4 border-yellow-500/40 animate-expand-ring"
              style={{
                left: `${50 + (selectedCity?.lng || 0) / 180 * 30}%`,
                top: `${50 - (selectedCity?.lat || 0) / 90 * 30}%`,
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(impactResults.shockwaveRadius, 300)}px`,
                height: `${Math.min(impactResults.shockwaveRadius, 300)}px`,
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.4), inset 0 0 10px rgba(234, 179, 8, 0.1)',
                animationDelay: '1s',
              }}
            />
          </>
        )}
      </div>

      {/* Globe Overlay Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* City Label */}
      {selectedCity && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-medium">{selectedCity.name}</span>
        </div>
      )}
    </div>
  );
};

export default Globe;