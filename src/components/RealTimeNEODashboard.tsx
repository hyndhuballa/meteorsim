import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Satellite, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Target, 
  Activity,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { nasaService, NEOData, NEOStats } from '../services/NASAService';

interface RealTimeNEODashboardProps {
  onAsteroidSelect?: (asteroid: NEOData) => void;
  selectedCity?: { lat: number; lng: number; name: string } | null;
}

const RealTimeNEODashboard: React.FC<RealTimeNEODashboardProps> = ({
  onAsteroidSelect,
  selectedCity
}) => {
  const [hazardousAsteroids, setHazardousAsteroids] = useState<NEOData[]>([]);
  const [neoStats, setNeoStats] = useState<NEOStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NEOData | null>(null);

  useEffect(() => {
    checkConnection();
    loadData();
    
    // Set up periodic updates every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const healthy = await nasaService.checkHealth();
      setIsConnected(healthy);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [hazardousData, statsData] = await Promise.all([
        nasaService.getHazardousAsteroids(),
        nasaService.getNEOStats()
      ]);

      setHazardousAsteroids(hazardousData.asteroids.slice(0, 10)); // Top 10 most dangerous
      setNeoStats(statsData);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading NEO data:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsteroidClick = (asteroid: NEOData) => {
    setSelectedAsteroid(asteroid);
    onAsteroidSelect?.(asteroid);
  };

  const simulateImpact = async (asteroid: NEOData) => {
    if (!selectedCity) {
      alert('Please select a target city first');
      return;
    }

    try {
      const simulation = await nasaService.simulateRealAsteroidImpact(
        asteroid.id,
        selectedCity.lat,
        selectedCity.lng
      );
      
      // You can emit this data to the parent component or handle it here
      console.log('Impact simulation:', simulation);
      alert(`Impact simulation complete! Energy: ${simulation.impact.energy_mt} MT`);
    } catch (error) {
      console.error('Error simulating impact:', error);
      alert('Error running impact simulation');
    }
  };

  if (isLoading && !neoStats) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <Satellite className="w-full h-full text-blue-400" />
          </motion.div>
          <p className="text-white">Connecting to NASA NEO API...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-glow flex items-center gap-2">
          <Satellite className="w-6 h-6 text-blue-400" />
          Real-Time NEO Tracking
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {neoStats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">
              {neoStats.total_asteroids}
            </div>
            <div className="text-sm text-gray-300">Total NEOs</div>
          </div>
          
          <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">
              {neoStats.hazardous_asteroids}
            </div>
            <div className="text-sm text-gray-300">Hazardous</div>
          </div>
        </div>
      )}

      {/* Hazardous Asteroids List */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-300">
          <AlertTriangle className="w-5 h-5" />
          Most Dangerous Asteroids
        </h4>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {hazardousAsteroids.map((asteroid, index) => {
              const riskInfo = nasaService.getRiskLevel(asteroid.risk_score || 0);
              const closeApproach = asteroid.close_approach_data?.[0];
              const diameter = (
                asteroid.estimated_diameter.meters.estimated_diameter_min +
                asteroid.estimated_diameter.meters.estimated_diameter_max
              ) / 2;

              return (
                <motion.div
                  key={asteroid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedAsteroid?.id === asteroid.id
                      ? 'bg-yellow-900/40 border-yellow-500/50'
                      : 'bg-gray-900/30 border-gray-500/30 hover:bg-gray-800/40'
                  }`}
                  onClick={() => handleAsteroidClick(asteroid)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">
                        {asteroid.name.replace(/[()]/g, '')}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {asteroid.id}
                      </div>
                    </div>
                    
                    <div 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: `${riskInfo.color}20`, color: riskInfo.color }}
                    >
                      {riskInfo.level}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Size: </span>
                      <span className="text-white">{Math.round(diameter)}m</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk: </span>
                      <span className="text-white">{asteroid.risk_score?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>

                  {closeApproach && (
                    <div className="mt-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Clock className="w-3 h-3" />
                        <span>
                          {nasaService.calculateTimeToImpact(closeApproach.close_approach_date)}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        Distance: {nasaService.formatDistance(closeApproach.miss_distance.kilometers)}
                      </div>
                    </div>
                  )}

                  {selectedAsteroid?.id === asteroid.id && selectedCity && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-gray-600"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          simulateImpact(asteroid);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white text-sm font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
                      >
                        <Target className="w-4 h-4" />
                        Simulate Impact on {selectedCity.name}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-xs text-gray-400 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-300 text-sm">
            <WifiOff className="w-4 h-4" />
            <span>Backend connection lost. Please start the Python backend server.</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RealTimeNEODashboard;
