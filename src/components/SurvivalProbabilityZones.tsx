import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  MapPin, 
  Users, 
  Building, 
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface SurvivalZone {
  id: string;
  name: string;
  radius: number; // km from impact
  survivalRate: number; // 0-100%
  color: string;
  description: string;
  factors: {
    shelters: number;
    hospitals: number;
    evacuationRoutes: number;
    infrastructure: number;
  };
}

interface SurvivalProbabilityZonesProps {
  selectedCity: City | null;
  impactData: any;
  isActive: boolean;
  onZoneSelect?: (zone: SurvivalZone) => void;
}

const SurvivalProbabilityZones: React.FC<SurvivalProbabilityZonesProps> = ({
  selectedCity,
  impactData,
  isActive,
  onZoneSelect
}) => {
  const [survivalZones, setSurvivalZones] = useState<SurvivalZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<SurvivalZone | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate survival zones based on impact data
  useEffect(() => {
    if (!isActive || !impactData || !selectedCity) {
      setSurvivalZones([]);
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const zones = calculateSurvivalZones(impactData, selectedCity);
      setSurvivalZones(zones);
      setIsCalculating(false);
    }, 1500);
  }, [isActive, impactData, selectedCity]);

  const calculateSurvivalZones = (impact: any, city: City): SurvivalZone[] => {
    const baseRadius = impact.shockKm || 10;
    
    return [
      {
        id: 'ground-zero',
        name: 'Ground Zero',
        radius: baseRadius * 0.2,
        survivalRate: 0,
        color: '#DC2626',
        description: 'Complete destruction - No survival possible',
        factors: {
          shelters: 0,
          hospitals: 0,
          evacuationRoutes: 0,
          infrastructure: 0
        }
      },
      {
        id: 'critical-zone',
        name: 'Critical Impact Zone',
        radius: baseRadius * 0.5,
        survivalRate: 5,
        color: '#EA580C',
        description: 'Extreme danger - Survival only in reinforced shelters',
        factors: {
          shelters: 10,
          hospitals: 5,
          evacuationRoutes: 15,
          infrastructure: 20
        }
      },
      {
        id: 'severe-zone',
        name: 'Severe Damage Zone',
        radius: baseRadius * 0.8,
        survivalRate: 25,
        color: '#F59E0B',
        description: 'Heavy casualties - Underground shelters essential',
        factors: {
          shelters: 40,
          hospitals: 25,
          evacuationRoutes: 35,
          infrastructure: 45
        }
      },
      {
        id: 'moderate-zone',
        name: 'Moderate Risk Zone',
        radius: baseRadius * 1.2,
        survivalRate: 60,
        color: '#EAB308',
        description: 'Significant risk - Immediate evacuation required',
        factors: {
          shelters: 70,
          hospitals: 60,
          evacuationRoutes: 65,
          infrastructure: 70
        }
      },
      {
        id: 'caution-zone',
        name: 'Caution Zone',
        radius: baseRadius * 1.8,
        survivalRate: 85,
        color: '#F97316',
        description: 'Moderate danger - Shelter in place or evacuate',
        factors: {
          shelters: 85,
          hospitals: 80,
          evacuationRoutes: 80,
          infrastructure: 85
        }
      },
      {
        id: 'safe-zone',
        name: 'Relative Safety Zone',
        radius: baseRadius * 2.5,
        survivalRate: 95,
        color: '#22C55E',
        description: 'High survival rate - Minor injuries possible',
        factors: {
          shelters: 95,
          hospitals: 90,
          evacuationRoutes: 95,
          infrastructure: 95
        }
      }
    ];
  };

  const getSurvivalIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (rate >= 50) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case 'shelters': return <Shield className="w-4 h-4" />;
      case 'hospitals': return <Heart className="w-4 h-4" />;
      case 'evacuationRoutes': return <Truck className="w-4 h-4" />;
      case 'infrastructure': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getFactorLabel = (factor: string) => {
    switch (factor) {
      case 'shelters': return 'Emergency Shelters';
      case 'hospitals': return 'Medical Facilities';
      case 'evacuationRoutes': return 'Evacuation Routes';
      case 'infrastructure': return 'Infrastructure';
      default: return factor;
    }
  };

  if (!isActive) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run impact simulation to see survival zones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Survival Probability Analysis
        </h3>
        {selectedCity && (
          <p className="text-sm text-gray-300 mt-1">
            Impact location: {selectedCity.name}
          </p>
        )}
      </div>

      {isCalculating ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <Clock className="w-full h-full text-blue-400" />
            </motion.div>
            <p className="text-white">Calculating survival probabilities...</p>
            <p className="text-sm text-gray-400 mt-2">
              Analyzing shelters, hospitals, and evacuation routes
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Zone Overview */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Average Survival Rate</div>
              <div className="text-xl font-bold text-white">
                {Math.round(survivalZones.reduce((acc, zone) => acc + zone.survivalRate, 0) / survivalZones.length)}%
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400">Critical Zones</div>
              <div className="text-xl font-bold text-red-400">
                {survivalZones.filter(zone => zone.survivalRate < 50).length}
              </div>
            </div>
          </div>

          {/* Survival Zones List */}
          <div className="space-y-2">
            {survivalZones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedZone?.id === zone.id
                    ? 'bg-blue-900/30 border-blue-500/50'
                    : 'bg-gray-800/30 border-gray-600/30 hover:bg-gray-700/30'
                }`}
                onClick={() => {
                  setSelectedZone(zone);
                  onZoneSelect?.(zone);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSurvivalIcon(zone.survivalRate)}
                    <span className="font-medium text-white">{zone.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: zone.color }}>
                      {zone.survivalRate}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {zone.radius.toFixed(1)}km radius
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{zone.description}</p>
                
                {/* Survival Factors */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(zone.factors).map(([factor, value]) => (
                    <div key={factor} className="flex items-center gap-2">
                      {getFactorIcon(factor)}
                      <span className="text-xs text-gray-400">
                        {getFactorLabel(factor)}
                      </span>
                      <span className="text-xs font-medium" style={{ 
                        color: value >= 70 ? '#22C55E' : value >= 40 ? '#F59E0B' : '#DC2626' 
                      }}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Zone Analysis */}
          <AnimatePresence>
            {selectedZone && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30"
              >
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  {selectedZone.name} - Detailed Analysis
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-400">Survival Probability</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-700 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${selectedZone.survivalRate}%`,
                            backgroundColor: selectedZone.color
                          }}
                        />
                      </div>
                      <span className="text-lg font-bold text-white">
                        {selectedZone.survivalRate}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Critical Factors</div>
                      <div className="space-y-2">
                        {Object.entries(selectedZone.factors).map(([factor, value]) => (
                          <div key={factor} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getFactorIcon(factor)}
                              <span className="text-sm text-gray-300">
                                {getFactorLabel(factor)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full"
                                  style={{ 
                                    width: `${value}%`,
                                    backgroundColor: value >= 70 ? '#22C55E' : value >= 40 ? '#F59E0B' : '#DC2626'
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-white w-8">
                                {value}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-600">
                    <div className="text-sm text-gray-400">Recommendations</div>
                    <div className="text-sm text-gray-200 mt-1">
                      {selectedZone.survivalRate >= 80 
                        ? "Shelter in place. Monitor emergency broadcasts. Assist others if safe."
                        : selectedZone.survivalRate >= 50
                        ? "Immediate evacuation recommended. Seek underground shelter if evacuation impossible."
                        : "CRITICAL: Underground bunker or immediate evacuation beyond this zone required."
                      }
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SurvivalProbabilityZones;
