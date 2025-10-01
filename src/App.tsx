// src/App.tsx
import React, { ReactNode, useState } from "react";
import { ArrowLeft, Zap, Flame, Mountain, Waves, CircleDot } from "lucide-react";
import LandingPage from "./components/LandingPage";
import GlobeVisualization from "./GlobeVisualization";
import ImpactConsequencesDashboard from "./components/ImpactConsequencesDashboard";
import RealTimeNEODashboard from "./components/RealTimeNEODashboard";
import TimeLapseSimulation from "./components/TimeLapseSimulation";
import AftermathVisualization from "./components/AftermathVisualization";
import CityRiskAnalyzer from "./components/CityRiskAnalyzer";
import SurvivalProbabilityZones from "./components/SurvivalProbabilityZones";
import GlobalAlertSystem from "./components/GlobalAlertSystem";
import { NEOData } from "./services/NASAService";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import NasaEyesEmbed from "./components/NasaEyesEmbed";

/**
 * Simple types
 */
type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

/**
 * ======== Helper / sample data ========
 */
const sampleCities: City[] = [
  { id: "nyc", name: "New York, USA", lat: 40.7128, lng: -74.0060 },
  { id: "del", name: "New Delhi, India", lat: 28.6139, lng: 77.2090 },
  { id: "ldn", name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { id: "bne", name: "Brisbane, Australia", lat: -27.4698, lng: 153.0251 },
  { id: "tok", name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { id: "par", name: "Paris, France", lat: 48.8566, lng: 2.3522 },
  { id: "ber", name: "Berlin, Germany", lat: 52.5200, lng: 13.4050 },
  { id: "rio", name: "Rio de Janeiro, Brazil", lat: -22.9068, lng: -43.1729 },
  { id: "mos", name: "Moscow, Russia", lat: 55.7558, lng: 37.6176 },
  { id: "bei", name: "Beijing, China", lat: 39.9042, lng: 116.4074 },
  { id: "cai", name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
  { id: "mex", name: "Mexico City, Mexico", lat: 19.4326, lng: -99.1332 },
  { id: "sao", name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { id: "lag", name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792 },
  { id: "mum", name: "Mumbai, India", lat: 19.0760, lng: 72.8777 },
  { id: "sha", name: "Shanghai, China", lat: 31.2304, lng: 121.4737 },
  { id: "seo", name: "Seoul, South Korea", lat: 37.5665, lng: 126.9780 },
  { id: "jak", name: "Jakarta, Indonesia", lat: -6.2088, lng: 106.8456 },
  { id: "ist", name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
  { id: "tor", name: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
  { id: "joh", name: "Johannesburg, South Africa", lat: -26.2041, lng: 28.0473 },
];

/**
 * ======== StarField - lightweight background star field ========
 */
const StarField: React.FC = () => {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-[#020111] to-[#05103a] overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at bottom, rgba(10,10,30,0.35) 0%, rgba(0,0,0,0.0) 40%)",
      }}
    >
      {/* Simple decorative stars using CSS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(white 0.8px, rgba(255,255,255,0) 1px), radial-gradient(white 0.8px, rgba(255,255,255,0) 1px)",
          backgroundSize: "100px 100px, 220px 220px",
          opacity: 0.12,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.0) 60%)",
        }}
      />
    </div>
  );
};

/**
 * ======== Controls ========
 * Props match the usage in your fragment.
 */
type ControlsProps = {
  cities: City[];
  selectedCity: City | null;
  asteroidSize: number;
  velocity: number;
  onCityChange: (c: City) => void;
  onSizeChange: (s: number) => void;
  onVelocityChange: (v: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  showPopulationHeatmap: boolean;
  onTogglePopulationHeatmap: (show: boolean) => void;
};

const Controls: React.FC<ControlsProps> = ({
  cities,
  selectedCity,
  asteroidSize,
  velocity,
  onCityChange,
  onSizeChange,
  onVelocityChange,
  onRunSimulation,
  isSimulating,
  showPopulationHeatmap,
  onTogglePopulationHeatmap,
}) => {
  return (
    <div className="glass-card p-6 shadow-2xl">
      <h3 className="text-xl font-semibold mb-4 text-glow">Impact Controls</h3>

      <label className="block text-sm text-gray-300 mb-2">Target City</label>
      <select
        value={selectedCity?.id ?? ""}
        onChange={(e) => {
          const c = cities.find((x) => x.id === e.target.value);
          if (c) onCityChange(c);
        }}
        className="w-full bg-black/30 border border-white/10 rounded-md p-3 mb-4 text-white"
      >
        <option value="" disabled>
          Select a city
        </option>
        {cities.map((c) => (
          <option key={c.id} value={c.id} className="bg-gray-900">
            {c.name}
          </option>
        ))}
      </select>

      <label className="block text-sm text-gray-300 mb-2">Asteroid size (meters)</label>
      <input
        type="range"
        min={10}
        max={1000}
        value={asteroidSize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        className="w-full mb-2 slider"
      />
      <div className="text-sm text-gray-300 mb-4">Size: {asteroidSize} m</div>

      <label className="block text-sm text-gray-300 mb-2">Impact velocity (km/s)</label>
      <input
        type="range"
        min={5}
        max={70}
        value={velocity}
        onChange={(e) => onVelocityChange(Number(e.target.value))}
        className="w-full mb-2 slider"
      />
      <div className="text-sm text-gray-300 mb-4">Velocity: {velocity} km/s</div>

      <div className="border-t border-white/10 my-4"></div>

      <div className="flex items-center justify-between">
        <label htmlFor="heatmap-toggle" className="text-sm text-gray-300">Show Population Density</label>
        <label htmlFor="heatmap-toggle" className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            id="heatmap-toggle" 
            className="sr-only peer" 
            checked={showPopulationHeatmap}
            onChange={(e) => onTogglePopulationHeatmap(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <button
        onClick={onRunSimulation}
        disabled={isSimulating || !selectedCity}
        className="w-full py-3 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 text-black font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 disabled:opacity-50 animate-pulse-glow"
      >
        {isSimulating ? "🌟 Simulating Impact..." : "🚀 Launch Impact Simulation"}
      </button>
    </div>
  );
};

/**
 * ======== EducationCards ========
 */
const EducationCards: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 hover:scale-[1.02] transition-transform duration-300">
        <h4 className="font-semibold text-blue-300 mb-2">🔬 Science</h4>
        <p className="text-sm text-gray-300">Learn how impact energy is calculated using mass, velocity, and physics principles.</p>
      </div>
      <div className="glass-card p-4 hover:scale-[1.02] transition-transform duration-300">
        <h4 className="font-semibold text-green-300 mb-2">🛡️ Safety</h4>
        <p className="text-sm text-gray-300">Emergency protocols and safety measures for asteroid impact scenarios.</p>
      </div>
      <div className="glass-card p-4 hover:scale-[1.02] transition-transform duration-300">
        <h4 className="font-semibold text-purple-300 mb-2">⭐ Fun Facts</h4>
        <p className="text-sm text-gray-300">Discover fascinating cosmic trivia and unlock achievement badges.</p>
      </div>
    </div>
  );
};

/**
 * ======== ResultStatCard ========
 * A reusable card for displaying a single result metric with an icon.
 */
const ResultStatCard: React.FC<{ icon: ReactNode; label: string; value: string | number; unit: string }> = ({ icon, label, value, unit }) => (
  <div className="glass-card p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
    <div className="p-3 bg-white/10 rounded-full mb-3">
      {icon}
    </div>
    <div className="text-sm text-gray-300">{label}</div>
    <div className="text-2xl font-bold text-glow">{value}</div>
    <div className="text-xs text-gray-400">{unit}</div>
  </div>
);

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <StarField />
      <LandingPage
        onEnterApp={() => {
          setTimeout(() => navigate('/simulation'), 300);
        }}
      />
    </div>
  );
};

const EarthView: React.FC = () => <NasaEyesEmbed slug="earth" />;

/**
 * ======== Main App ========
 */
const MainApp: React.FC = () => {
  // Inject animation styles for the globe blast effect
  // This is a quick way to ensure styles are available.
  // In a larger app, this would go in a global CSS file like `index.css`.
  const animationStyles = `
    @keyframes expand-ring {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
      }
    }
    .animate-expand-ring {
      animation: expand-ring 1.2s ease-out forwards;
    }
  `;

  const navigate = useNavigate();

  // Simulation inputs
  const [cities] = useState<City[]>(sampleCities);
  const [selectedCity, setSelectedCity] = useState<City | null>(sampleCities[0] ?? null);
  const [asteroidSize, setAsteroidSize] = useState<number>(100); // meters
  const [velocity, setVelocity] = useState<number>(20); // km/s
  const [showPopulationHeatmap, setShowPopulationHeatmap] = useState<boolean>(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<null | {
    energyMt: number;
    craterKm: number;
    thermalKm: number;
    shockKm: number;
    city?: City | null;
  }>(null);

  // Real asteroid data state
  const [selectedRealAsteroid, setSelectedRealAsteroid] = useState<NEOData | null>(null);
  const [useRealAsteroid, setUseRealAsteroid] = useState<boolean>(false);

  // Advanced visualization state
  const [activeTab, setActiveTab] = useState<'neo' | 'consequences' | 'timeline' | 'aftermath' | 'risk' | 'survival' | 'alerts'>('neo');
  const [currentTimePhase, setCurrentTimePhase] = useState<string>('impact');
  const [timelineProgress, setTimelineProgress] = useState<number>(0);

  // Run Simulation: compute simple physics in-browser and animate results
  function runSimulation() {
    if (!selectedCity) return;
    setIsSimulating(true);

    // Simple physics (in-browser)
    // density = 3000 kg/m^3
    // mass = 4/3*pi*(r^3)*density
    // energyJ = 0.5 * mass * v^2
    // energyMt = energyJ / 4.184e15
    const density = 3000;
    const radiusMeters = asteroidSize / 2;
    const mass = (4 / 3) * Math.PI * Math.pow(radiusMeters, 3) * density; // kg
    const v_m_s = velocity * 1000; // convert km/s to m/s
    const energyJ = 0.5 * mass * v_m_s * v_m_s;
    const energyMt = energyJ / 4.184e15;

    // crater (simple): size * velocity * sin(angle)
    // choose angle 45° for demo (sin45 ~= 0.7071); convert meters -> km for crater
    const angleFactor = Math.sin((45 * Math.PI) / 180);
    const craterKm = (asteroidSize * velocity * angleFactor) / 1000;
    const thermalKm = craterKm * 4;
    const shockKm = craterKm * 8;

    // fake animation delay for cinematic effect
    setTimeout(() => {
      setLastResult({
        energyMt: Math.max(1, Math.round(energyMt)),
        craterKm: Math.max(0.1, Number(craterKm.toFixed(2))),
        thermalKm: Number(thermalKm.toFixed(2)),
        shockKm: Number(shockKm.toFixed(2)),
        city: selectedCity,
      });
      setIsSimulating(false);
    }, 1400);
  }

  // Main app UI
  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">
      <>
        <style>{animationStyles}</style>
        <StarField />

        {/* Header */}
        <header className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Meteor Impact Simulator
                </h1>
                {/* <button
                  onClick={() => navigate('/earth')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition-colors"
                >
                  Interactive 3D Earth
                </button> */}
              </div>

              <div className="w-32" /> {/* spacer */}
            </div>

            <div className="text-center">
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Explore the devastating power of asteroid impacts with scientific accuracy.
                Select a city, adjust parameters, and witness the cosmic consequences.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Controls & Info */}
            <div className="xl:col-span-1 space-y-6">
              <Controls
                cities={cities}
                selectedCity={selectedCity}
                asteroidSize={asteroidSize}
                velocity={velocity}
                onCityChange={setSelectedCity}
                onSizeChange={setAsteroidSize}
                onVelocityChange={setVelocity}
                onRunSimulation={runSimulation}
                isSimulating={isSimulating}
                showPopulationHeatmap={showPopulationHeatmap}
                onTogglePopulationHeatmap={setShowPopulationHeatmap}
              />

              <EducationCards />
            </div>

            {/* Middle Column - Enhanced Globe Visualization */}
            <div className="xl:col-span-2">
              <div className="h-[600px] bg-black rounded-2xl border border-white/10 overflow-hidden">
                <GlobeVisualization
                  cities={cities}
                  selectedCity={selectedCity}
                  lastResult={lastResult}
                  isSimulating={isSimulating}
                  asteroidSize={asteroidSize}
                  velocity={velocity}
                  showPopulationHeatmap={showPopulationHeatmap}
                />
              </div>
            </div>

            {/* Right Column - Combined Data Panels */}
            <div className="xl:col-span-1">
              <div className="h-[600px] flex flex-col glass-card p-4">
                {/* Enhanced Tab Navigation */}
                <div className="border-b border-gray-600 mb-3">
                  <div className="flex tab-container">
                    <button
                      onClick={() => setActiveTab('neo')}
                      className={`compact-tab ${activeTab === 'neo' ? 'active' : ''}`}
                    >
                      NEOs
                    </button>
                    <button
                      onClick={() => setActiveTab('consequences')}
                      className={`compact-tab ${activeTab === 'consequences' ? 'active' : ''}`}
                    >
                      Impact
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`compact-tab ${activeTab === 'timeline' ? 'active' : ''}`}
                    >
                      Timeline
                    </button>
                    <button
                      onClick={() => setActiveTab('aftermath')}
                      className={`compact-tab ${activeTab === 'aftermath' ? 'active' : ''}`}
                    >
                      Effects
                    </button>
                    <button
                      onClick={() => setActiveTab('risk')}
                      className={`compact-tab ${activeTab === 'risk' ? 'active' : ''}`}
                    >
                      AI Risk
                    </button>
                    <button
                      onClick={() => setActiveTab('survival')}
                      className={`compact-tab ${activeTab === 'survival' ? 'active' : ''}`}
                    >
                      Survival
                    </button>
                    <button
                      onClick={() => setActiveTab('alerts')}
                      className={`compact-tab ${activeTab === 'alerts' ? 'active' : ''}`}
                    >
                      Alerts
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === 'neo' && (
                    <RealTimeNEODashboard
                      selectedCity={selectedCity}
                      onAsteroidSelect={(asteroid) => {
                        setSelectedRealAsteroid(asteroid);
                        setUseRealAsteroid(true);
                        // Update asteroid size based on real data
                        const diameter = (
                          asteroid.estimated_diameter.meters.estimated_diameter_min +
                          asteroid.estimated_diameter.meters.estimated_diameter_max
                        ) / 2;
                        setAsteroidSize(Math.round(diameter));
    
                        // Update velocity if available
                        if (asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second) {
                          const vel = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second);
                          setVelocity(Math.round(vel));
                        }
                      }}
                    />
                  )}
                  {activeTab === 'consequences' && (
                    <ImpactConsequencesDashboard
                      selectedCity={selectedCity}
                      lastResult={lastResult}
                      asteroidSize={asteroidSize}
                      velocity={velocity}
                      isSimulating={isSimulating}
                    />
                  )}

                  {activeTab === 'timeline' && (
                    <TimeLapseSimulation
                      isActive={!!lastResult}
                      impactLocation={selectedCity}
                      impactData={lastResult}
                      onTimelineChange={(phase, progress) => {
                        setCurrentTimePhase(phase);
                        setTimelineProgress(progress);
                      }}
                    />
                  )}

                  {activeTab === 'aftermath' && (
                    <AftermathVisualization
                      isActive={!!lastResult}
                      impactLocation={selectedCity}
                      impactData={lastResult}
                      timePhase={currentTimePhase}
                      onLayerToggle={(layerId, enabled) => {
                        // Handle layer visibility changes on globe
                        console.log(`Layer ${layerId} ${enabled ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  )}

                  {activeTab === 'risk' && (
                    <CityRiskAnalyzer
                      cities={cities}
                      selectedCity={selectedCity}
                      onCitySelect={setSelectedCity}
                    />
                  )}

                  {activeTab === 'survival' && (
                    <SurvivalProbabilityZones
                      selectedCity={selectedCity}
                      impactData={lastResult}
                      isActive={!!lastResult}
                      onZoneSelect={(zone) => {
                        console.log('Selected survival zone:', zone);
                      }}
                    />
                  )}

                  {activeTab === 'alerts' && (
                    <GlobalAlertSystem
                      isActive={!!selectedCity}
                      impactLocation={selectedCity}
                      asteroidData={{ size: asteroidSize, velocity }}
                      onPhaseChange={(phase) => {
                        console.log('Alert phase changed:', phase);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Quick Stats */}
          {lastResult && (
            <div className="mt-8">
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-4 text-glow">Quick Impact Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ResultStatCard
                    icon={<Flame className="w-6 h-6 text-orange-400" />}
                    label="Energy Released"
                    value={lastResult.energyMt}
                    unit="Megatons"
                  />
                  <ResultStatCard
                    icon={<Mountain className="w-6 h-6 text-yellow-400" />}
                    label="Crater Diameter"
                    value={lastResult.craterKm}
                    unit="km"
                  />
                  <ResultStatCard
                    icon={<CircleDot className="w-6 h-6 text-red-400" />}
                    label="Thermal Radius"
                    value={lastResult.thermalKm}
                    unit="km"
                  />
                  <ResultStatCard
                    icon={<Waves className="w-6 h-6 text-blue-400" />}
                    label="Shockwave Radius"
                    value={lastResult.shockKm}
                    unit="km"
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (!lastResult) return;
                      const blob = new Blob([JSON.stringify(lastResult, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `impact-${lastResult.city?.id ?? "result"}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:scale-105 transition-transform"
                  >
                    📊 Download Report
                  </button>

                  <button
                    onClick={() => setLastResult(null)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg text-white font-medium hover:scale-105 transition-transform"
                  >
                    🔄 Reset Simulation
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer disclaimer */}
        <footer className="relative z-10 max-w-7xl mx-auto p-6 text-center text-sm text-gray-400">
          Demonstration only. Uses NASA open data + simplified impact scaling for education.
        </footer>
      </>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simulation" element={<MainApp />} />
        <Route path="/earth" element={<EarthView />} />
      </Routes>
    </Router>
  );
};

export default App;
