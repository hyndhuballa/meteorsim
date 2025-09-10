import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radiation, 
  Flame, 
  Cloud, 
  Thermometer,
  Wind,
  Droplets,
  TreePine,
  Building,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface AftermathVisualizationProps {
  isActive: boolean;
  impactLocation: { lat: number; lng: number } | null;
  impactData: {
    energyMt: number;
    craterKm: number;
    thermalKm: number;
    shockKm: number;
  } | null;
  timePhase: string;
  onLayerToggle?: (layerId: string, enabled: boolean) => void;
}

interface AftermathLayer {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  timeToAppear: number; // hours after impact
  duration: number; // hours
  effects: string[];
}

const AftermathVisualization: React.FC<AftermathVisualizationProps> = ({
  isActive,
  impactLocation,
  impactData,
  timePhase,
  onLayerToggle
}) => {
  const [layers, setLayers] = useState<AftermathLayer[]>([
    {
      id: 'radiation',
      name: 'Radiation Zones',
      description: 'Radioactive fallout from vaporized materials',
      icon: <Radiation className="w-4 h-4" />,
      color: '#00FF00',
      enabled: true,
      severity: 'extreme',
      timeToAppear: 0.5,
      duration: 8760, // 1 year
      effects: ['Acute radiation syndrome', 'Long-term cancer risk', 'Genetic damage']
    },
    {
      id: 'fires',
      name: 'Fire Spread',
      description: 'Wildfires ignited by thermal radiation',
      icon: <Flame className="w-4 h-4" />,
      color: '#FF4500',
      enabled: true,
      severity: 'high',
      timeToAppear: 0.1,
      duration: 168, // 1 week
      effects: ['Urban fires', 'Forest fires', 'Smoke inhalation hazard']
    },
    {
      id: 'dust_cloud',
      name: 'Dust Cloud',
      description: 'Atmospheric dust blocking sunlight',
      icon: <Cloud className="w-4 h-4" />,
      color: '#8B4513',
      enabled: true,
      severity: 'high',
      timeToAppear: 1,
      duration: 2160, // 3 months
      effects: ['Reduced sunlight', 'Temperature drop', 'Agricultural impact']
    },
    {
      id: 'climate',
      name: 'Climate Effects',
      description: 'Long-term climate disruption',
      icon: <Thermometer className="w-4 h-4" />,
      color: '#4169E1',
      enabled: true,
      severity: 'medium',
      timeToAppear: 24,
      duration: 17520, // 2 years
      effects: ['Global cooling', 'Precipitation changes', 'Seasonal disruption']
    },
    {
      id: 'acid_rain',
      name: 'Acid Rain',
      description: 'Chemical precipitation from atmospheric reactions',
      icon: <Droplets className="w-4 h-4" />,
      color: '#32CD32',
      enabled: false,
      severity: 'medium',
      timeToAppear: 6,
      duration: 720, // 1 month
      effects: ['Ecosystem damage', 'Water contamination', 'Infrastructure corrosion']
    },
    {
      id: 'ecosystem',
      name: 'Ecosystem Collapse',
      description: 'Widespread environmental destruction',
      icon: <TreePine className="w-4 h-4" />,
      color: '#228B22',
      enabled: false,
      severity: 'extreme',
      timeToAppear: 72,
      duration: 43800, // 5 years
      effects: ['Species extinction', 'Food chain disruption', 'Habitat loss']
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Failure',
      description: 'Cascading system failures',
      icon: <Building className="w-4 h-4" />,
      color: '#FF6347',
      enabled: false,
      severity: 'high',
      timeToAppear: 0.5,
      duration: 8760, // 1 year
      effects: ['Power grid failure', 'Communication breakdown', 'Transportation collapse']
    },
    {
      id: 'electromagnetic',
      name: 'EMP Effects',
      description: 'Electromagnetic pulse damage',
      icon: <Zap className="w-4 h-4" />,
      color: '#9370DB',
      enabled: false,
      severity: 'high',
      timeToAppear: 0,
      duration: 24,
      effects: ['Electronic device failure', 'Satellite disruption', 'Communication blackout']
    }
  ]);

  const [currentTime, setCurrentTime] = useState(0); // hours after impact
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  useEffect(() => {
    // Simulate time progression based on phase
    const phaseTimeMap: { [key: string]: number } = {
      'impact': 0,
      'fireball': 0.1,
      'shockwave': 0.5,
      'mushroom_cloud': 1,
      'secondary': 6
    };
    
    setCurrentTime(phaseTimeMap[timePhase] || 0);
  }, [timePhase]);

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, enabled: !layer.enabled }
        : layer
    ));
    
    const layer = layers.find(l => l.id === layerId);
    if (layer && onLayerToggle) {
      onLayerToggle(layerId, !layer.enabled);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'extreme': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const isLayerActive = (layer: AftermathLayer) => {
    return currentTime >= layer.timeToAppear && 
           currentTime <= (layer.timeToAppear + layer.duration);
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    if (hours < 168) return `${Math.round(hours / 24)}d`;
    if (hours < 8760) return `${Math.round(hours / 168)}w`;
    return `${Math.round(hours / 8760)}y`;
  };

  if (!isActive || !impactLocation || !impactData) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run an impact simulation to see aftermath effects</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-glow flex items-center gap-2">
          <Cloud className="w-6 h-6 text-orange-400" />
          Aftermath Layers
        </h3>
        
        <div className="text-sm text-gray-300">
          T+{formatDuration(currentTime)}
        </div>
      </div>

      {/* Time Indicator */}
      <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Time Since Impact</span>
          <span className="text-sm text-blue-400">{formatDuration(currentTime)}</span>
        </div>
        
        <div className="text-xs text-gray-400">
          Current Phase: <span className="text-white capitalize">{timePhase.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Visualization Layers</h4>
          <button
            onClick={() => {
              const allEnabled = layers.every(l => l.enabled);
              setLayers(prev => prev.map(layer => ({ ...layer, enabled: !allEnabled })));
            }}
            className="text-xs px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-colors"
          >
            Toggle All
          </button>
        </div>

        <AnimatePresence>
          {layers.map((layer) => {
            const isActive = isLayerActive(layer);
            const severityColor = getSeverityColor(layer.severity);
            
            return (
              <motion.div
                key={layer.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  layer.enabled 
                    ? 'bg-gray-800/50 border-gray-500/50' 
                    : 'bg-gray-900/30 border-gray-600/30'
                } ${isActive ? 'ring-2 ring-yellow-500/30' : ''}`}
                onClick={() => toggleLayer(layer.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${layer.color}20` }}
                    >
                      {layer.enabled ? layer.icon : <EyeOff className="w-4 h-4" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-white">{layer.name}</h5>
                        <div 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${severityColor}20`, 
                            color: severityColor 
                          }}
                        >
                          {layer.severity}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{layer.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayer(layer.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        layer.enabled 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}
                    >
                      {layer.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Appears: T+{formatDuration(layer.timeToAppear)}</span>
                    <span>Duration: {formatDuration(layer.duration)}</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: isActive ? '100%' : currentTime >= layer.timeToAppear ? '100%' : '0%',
                        backgroundColor: isActive ? layer.color : '#4B5563'
                      }}
                    />
                  </div>
                </div>

                {/* Effects */}
                {layer.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    {layer.effects.map((effect, index) => (
                      <div key={effect} className="flex items-center gap-2 text-xs text-gray-300">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: layer.color }}
                        />
                        {effect}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Active Effects Summary */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Currently Active Effects</h4>
        
        <div className="space-y-2">
          {layers
            .filter(layer => layer.enabled && isLayerActive(layer))
            .map(layer => (
              <div 
                key={layer.id}
                className="flex items-center gap-2 text-sm"
              >
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-white">{layer.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300 text-xs">{layer.effects[0]}</span>
              </div>
            ))}
          
          {layers.filter(layer => layer.enabled && isLayerActive(layer)).length === 0 && (
            <div className="text-gray-400 text-sm">No active effects at this time</div>
          )}
        </div>
      </div>

      {/* Impact Scale Reference */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Impact Scale</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-400">Energy:</span>
            <span className="text-white ml-1">{impactData.energyMt} MT</span>
          </div>
          <div>
            <span className="text-gray-400">Affected Area:</span>
            <span className="text-white ml-1">{Math.round(Math.PI * Math.pow(impactData.shockKm, 2))} km²</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AftermathVisualization;
