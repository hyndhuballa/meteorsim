import React, { useRef, useEffect, useState } from 'react';
import { City, ImpactResults } from '../types/simulator';

interface InteractiveEarthProps {
  selectedCity: City | null;
  impactResults: ImpactResults | null;
  isSimulating: boolean;
}

const InteractiveEarth: React.FC<InteractiveEarthProps> = ({ 
  selectedCity, 
  impactResults, 
  isSimulating 
}) => {
  const earthRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900/20 to-purple-900/20 backdrop-blur-md border border-white/10">
      <div
        ref={earthRef}
        className={`relative w-full h-full cursor-grab transition-transform duration-2000 ease-out ${
          isDragging ? 'cursor-grabbing' : ''
        } ${isZoomed ? 'scale-150' : 'scale-100'}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isZoomed ? 'scale(1.5)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Earth Sphere */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8) contrast(1.3) saturate(1.2)',
            boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.5), 0 0 50px rgba(59, 130, 246, 0.3)',
          }}
        >
          {/* Atmosphere Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-transparent to-blue-400/20 animate-pulse"></div>
          
          {/* Impact Point */}
          {selectedCity && (
            <div
              className={`absolute w-4 h-4 bg-red-500 rounded-full shadow-lg transition-all duration-1000 z-10 ${
                isSimulating ? 'animate-pulse scale-150' : ''
              }`}
              style={{
                left: `${50 + (selectedCity.lng / 180) * 30}%`,
                top: `${50 - (selectedCity.lat / 90) * 30}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)',
              }}
            />
          )}

          {/* Impact Rings */}
          {showRings && impactResults && selectedCity && (
            <>
              {/* Crater Ring */}
              <div
                className="absolute rounded-full border-4 border-red-500/80 animate-expand-ring z-10"
                style={{
                  left: `${50 + (selectedCity.lng / 180) * 30}%`,
                  top: `${50 - (selectedCity.lat / 90) * 30}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.min(impactResults.craterDiameter * 3, 120)}px`,
                  height: `${Math.min(impactResults.craterDiameter * 3, 120)}px`,
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), inset 0 0 20px rgba(239, 68, 68, 0.3)',
                  animationDelay: '0s',
                }}
              />

              {/* Thermal Ring */}
              <div
                className="absolute rounded-full border-4 border-orange-500/60 animate-expand-ring z-10"
                style={{
                  left: `${50 + (selectedCity.lng / 180) * 30}%`,
                  top: `${50 - (selectedCity.lat / 90) * 30}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.min(impactResults.thermalRadius * 2, 200)}px`,
                  height: `${Math.min(impactResults.thermalRadius * 2, 200)}px`,
                  boxShadow: '0 0 25px rgba(251, 146, 60, 0.5), inset 0 0 15px rgba(251, 146, 60, 0.2)',
                  animationDelay: '0.5s',
                }}
              />

              {/* Shockwave Ring */}
              <div
                className="absolute rounded-full border-4 border-yellow-500/40 animate-expand-ring z-10"
                style={{
                  left: `${50 + (selectedCity.lng / 180) * 30}%`,
                  top: `${50 - (selectedCity.lat / 90) * 30}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.min(impactResults.shockwaveRadius * 1.5, 300)}px`,
                  height: `${Math.min(impactResults.shockwaveRadius * 1.5, 300)}px`,
                  boxShadow: '0 0 20px rgba(234, 179, 8, 0.4), inset 0 0 10px rgba(234, 179, 8, 0.1)',
                  animationDelay: '1s',
                }}
              />
            </>
          )}
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <defs>
              <pattern id="earth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <circle cx="200" cy="200" r="200" fill="url(#earth-grid)" />
          </svg>
        </div>
      </div>

      {/* City Label */}
      {selectedCity && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 z-20">
          <span className="text-white font-medium">{selectedCity.name}</span>
        </div>
      )}

      {/* Rotation Hint */}
      {!isDragging && !isSimulating && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20 z-20">
          <span className="text-white/70 text-xs">Drag to rotate</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveEarth;