import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Country {
  id: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
  population: number;
  continent: string;
  color: string;
  cities: Array<{
    name: string;
    lat: number;
    lng: number;
    population: number;
  }>;
}

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface ImpactResult {
  energyMt: number;
  craterKm: number;
  thermalKm: number;
  shockKm: number;
  city?: City | null;
}

interface EnhancedGlobeProps {
  selectedCity: City | null;
  lastResult: ImpactResult | null;
  isSimulating: boolean;
  onCountrySelect?: (country: Country) => void;
}

// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Earth component with enhanced textures
const Earth: React.FC<{ selectedCity: City | null; isSimulating: boolean }> = ({ selectedCity, isSimulating }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [bumpTexture, setBumpTexture] = useState<THREE.Texture | null>(null);
  const [cloudsTexture, setCloudsTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Load high-quality Earth textures with fallbacks
    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-day.jpg',
      setEarthTexture,
      undefined,
      () => {
        // Fallback: create a simple blue-green texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 0, 256);
          gradient.addColorStop(0, '#4A90E2');
          gradient.addColorStop(0.5, '#2E7D32');
          gradient.addColorStop(1, '#1565C0');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 256);
          const texture = new THREE.CanvasTexture(canvas);
          setEarthTexture(texture);
        }
      }
    );

    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-topology.png',
      setBumpTexture,
      undefined,
      () => {
        // Fallback: create a simple bump texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#808080';
          ctx.fillRect(0, 0, 512, 256);
          const texture = new THREE.CanvasTexture(canvas);
          setBumpTexture(texture);
        }
      }
    );

    // Create a simple cloud texture
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 512;
    cloudCanvas.height = 256;
    const cloudCtx = cloudCanvas.getContext('2d');
    if (cloudCtx) {
      cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const radius = Math.random() * 20 + 5;
        cloudCtx.beginPath();
        cloudCtx.arc(x, y, radius, 0, Math.PI * 2);
        cloudCtx.fill();
      }
      const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
      setCloudsTexture(cloudTexture);
    }
  }, []);

  useFrame((state) => {
    if (earthRef.current && !isSimulating) {
      earthRef.current.rotation.y += 0.002; // Slow rotation
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.1}
          shininess={100}
          specular={new THREE.Color(0x222222)}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.05, 32, 32]}>
        <meshBasicMaterial
          color={0x4A90E2}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Clouds layer */}
      {cloudsTexture && (
        <Sphere args={[2.02, 32, 32]}>
          <meshBasicMaterial
            map={cloudsTexture}
            transparent
            opacity={0.3}
            alphaMap={cloudsTexture}
          />
        </Sphere>
      )}
    </group>
  );
};

// Country marker component
const CountryMarker: React.FC<{
  country: Country;
  isSelected: boolean;
  onClick: () => void;
}> = ({ country, isSelected, onClick }) => {
  const position = latLngToVector3(country.lat, country.lng, 2.1);
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (markerRef.current && isSelected) {
      markerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
    }
  });

  return (
    <group position={position}>
      <mesh ref={markerRef} onClick={onClick}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial
          color={isSelected ? '#FFD700' : country.color}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {isSelected && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/20">
            <div className="font-semibold">{country.name}</div>
            <div className="text-gray-300">{country.capital}</div>
            <div className="text-xs text-gray-400">
              Pop: {(country.population / 1000000).toFixed(1)}M
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Impact visualization component
const ImpactVisualization: React.FC<{
  city: City;
  result: ImpactResult;
  isActive: boolean;
}> = ({ city, result, isActive }) => {
  const position = latLngToVector3(city.lat, city.lng, 2.1);
  const [rings, setRings] = useState<Array<{ radius: number; color: string; opacity: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newRings = [
        { radius: result.craterKm * 0.01, color: '#FF0000', opacity: 0.8 },
        { radius: result.thermalKm * 0.01, color: '#FF8800', opacity: 0.6 },
        { radius: result.shockKm * 0.01, color: '#FFFF00', opacity: 0.4 },
      ];
      setRings(newRings);
      
      // Clear rings after animation
      setTimeout(() => setRings([]), 5000);
    }
  }, [isActive, result]);

  return (
    <group position={position}>
      {/* Impact point */}
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
      
      {/* Impact rings */}
      {rings.map((ring, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring.radius * 0.8, ring.radius, 32]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Camera controller for smooth transitions
const CameraController: React.FC<{
  selectedCity: City | null;
  isSimulating: boolean;
}> = ({ selectedCity, isSimulating }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (selectedCity && isSimulating) {
      const targetPosition = latLngToVector3(selectedCity.lat, selectedCity.lng, 5);
      
      // Smooth camera transition
      const startPosition = camera.position.clone();
      const duration = 2000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        camera.lookAt(0, 0, 0);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [selectedCity, isSimulating, camera]);
  
  return null;
};

// Main Enhanced Globe component
const EnhancedGlobe: React.FC<EnhancedGlobeProps> = ({
  selectedCity,
  lastResult,
  isSimulating,
  onCountrySelect
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load country data
    fetch('/data/countries.json')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading countries:', error);
        setLoading(false);
      });
  }, []);

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    onCountrySelect?.(country);
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-3xl">
        <div className="text-white">Loading globe...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-96 rounded-3xl overflow-hidden bg-gradient-to-b from-black via-blue-900/20 to-purple-900/20 relative"
    >
      {/* Globe Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-white text-sm font-medium mb-2">Globe Controls</div>
          <div className="space-y-2">
            <button
              onClick={() => {
                // Reset camera position
                setSelectedCountry(null);
              }}
              className="w-full px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
            >
              Reset View
            </button>
            <div className="text-xs text-gray-300">
              • Click countries to explore
              • Drag to rotate
              • Scroll to zoom
            </div>
          </div>
        </div>

        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 max-w-xs"
          >
            <div className="text-white font-semibold">{selectedCountry.name}</div>
            <div className="text-gray-300 text-sm">{selectedCountry.capital}</div>
            <div className="text-gray-400 text-xs mt-1">
              Population: {(selectedCountry.population / 1000000).toFixed(1)}M
            </div>
            <div className="text-gray-400 text-xs">
              Continent: {selectedCountry.continent}
            </div>
            {selectedCountry.cities && selectedCountry.cities.length > 0 && (
              <div className="mt-2">
                <div className="text-gray-300 text-xs font-medium">Major Cities:</div>
                <div className="text-gray-400 text-xs">
                  {selectedCountry.cities.slice(0, 3).map(city => city.name).join(', ')}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'radial-gradient(circle, #001122 0%, #000000 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4A90E2" />
        
        {/* Earth */}
        <Earth selectedCity={selectedCity} isSimulating={isSimulating} />
        
        {/* Country markers */}
        {countries.map(country => (
          <CountryMarker
            key={country.id}
            country={country}
            isSelected={selectedCountry?.id === country.id}
            onClick={() => handleCountryClick(country)}
          />
        ))}
        
        {/* Impact visualization */}
        {selectedCity && lastResult && isSimulating && (
          <ImpactVisualization
            city={selectedCity}
            result={lastResult}
            isActive={isSimulating}
          />
        )}
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={!isSimulating}
          autoRotateSpeed={0.5}
        />
        
        <CameraController selectedCity={selectedCity} isSimulating={isSimulating} />
        
        {/* Stars background */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial
            color="#000011"
            side={THREE.BackSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Canvas>
    </motion.div>
  );
};

export default EnhancedGlobe;
