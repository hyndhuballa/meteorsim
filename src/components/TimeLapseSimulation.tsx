import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Waves, 
  Flame, 
  Cloud,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface TimeLapseSimulationProps {
  isActive: boolean;
  impactLocation: { lat: number; lng: number } | null;
  impactData: {
    energyMt: number;
    craterKm: number;
    thermalKm: number;
    shockKm: number;
  } | null;
  onTimelineChange?: (phase: string, progress: number) => void;
}

interface SimulationPhase {
  id: string;
  name: string;
  duration: number; // seconds
  description: string;
  icon: React.ReactNode;
  color: string;
  effects: string[];
}

const simulationPhases: SimulationPhase[] = [
  {
    id: 'impact',
    name: 'Initial Impact',
    duration: 2,
    description: 'Asteroid strikes the surface, creating initial fireball',
    icon: <Zap className="w-4 h-4" />,
    color: '#FF4500',
    effects: ['Fireball formation', 'Ground zero vaporization', 'Seismic waves begin']
  },
  {
    id: 'fireball',
    name: 'Fireball Expansion',
    duration: 5,
    description: 'Superheated fireball expands, thermal radiation spreads',
    icon: <Flame className="w-4 h-4" />,
    color: '#FF6600',
    effects: ['Thermal radiation', 'Atmospheric heating', 'Ignition of flammable materials']
  },
  {
    id: 'shockwave',
    name: 'Shockwave Propagation',
    duration: 8,
    description: 'Pressure wave travels outward, causing structural damage',
    icon: <Waves className="w-4 h-4" />,
    color: '#FF8800',
    effects: ['Building collapse', 'Window breakage', 'Overpressure damage']
  },
  {
    id: 'mushroom_cloud',
    name: 'Mushroom Cloud Formation',
    duration: 10,
    description: 'Debris and vaporized material forms characteristic cloud',
    icon: <Cloud className="w-4 h-4" />,
    color: '#666666',
    effects: ['Debris ejection', 'Atmospheric disturbance', 'Dust cloud formation']
  },
  {
    id: 'secondary',
    name: 'Secondary Effects',
    duration: 15,
    description: 'Fires spread, infrastructure fails, rescue operations begin',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: '#FF0000',
    effects: ['Fire spread', 'Infrastructure collapse', 'Emergency response']
  }
];

const TimeLapseSimulation: React.FC<TimeLapseSimulationProps> = ({
  isActive,
  impactLocation,
  impactData,
  onTimelineChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = simulationPhases.reduce((sum, phase) => sum + phase.duration, 0);
  const currentPhase = simulationPhases[currentPhaseIndex];

  useEffect(() => {
    if (isPlaying && isActive) {
      intervalRef.current = setInterval(() => {
        setPhaseProgress(prev => {
          const newProgress = prev + 0.1; // Update every 100ms
          const currentPhaseDuration = currentPhase.duration;
          
          if (newProgress >= currentPhaseDuration) {
            // Move to next phase
            if (currentPhaseIndex < simulationPhases.length - 1) {
              setCurrentPhaseIndex(prev => prev + 1);
              setPhaseProgress(0);
            } else {
              // Simulation complete
              setIsPlaying(false);
              return currentPhaseDuration;
            }
            return 0;
          }
          
          return newProgress;
        });
        
        setTotalElapsed(prev => prev + 0.1);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isActive, currentPhaseIndex, currentPhase.duration]);

  useEffect(() => {
    if (onTimelineChange) {
      onTimelineChange(currentPhase.id, phaseProgress / currentPhase.duration);
    }
  }, [currentPhase.id, phaseProgress, currentPhase.duration, onTimelineChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setTotalElapsed(0);
  };

  const handlePhaseClick = (phaseIndex: number) => {
    setCurrentPhaseIndex(phaseIndex);
    setPhaseProgress(0);
    
    // Calculate total elapsed time up to this phase
    const elapsedToPhase = simulationPhases
      .slice(0, phaseIndex)
      .reduce((sum, phase) => sum + phase.duration, 0);
    setTotalElapsed(elapsedToPhase);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive || !impactLocation || !impactData) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run an impact simulation to see time-lapse effects</p>
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
          <Clock className="w-6 h-6 text-blue-400" />
          Time-Lapse Simulation
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-lg transition-colors ${
              isPlaying 
                ? 'bg-red-600/20 hover:bg-red-600/40 text-red-400' 
                : 'bg-green-600/20 hover:bg-green-600/40 text-green-400'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 bg-gray-600/20 hover:bg-gray-600/40 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Timeline Progress</span>
          <span>{formatTime(totalElapsed)} / {formatTime(totalDuration)}</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(totalElapsed / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Phase Info */}
      <div className="mb-6 p-4 rounded-lg border" style={{ 
        backgroundColor: `${currentPhase.color}10`, 
        borderColor: `${currentPhase.color}30` 
      }}>
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${currentPhase.color}20` }}
          >
            {currentPhase.icon}
          </div>
          <div>
            <h4 className="font-semibold text-white">{currentPhase.name}</h4>
            <p className="text-sm text-gray-300">{currentPhase.description}</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-1 mb-3">
          <div 
            className="h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${(phaseProgress / currentPhase.duration) * 100}%`,
              backgroundColor: currentPhase.color
            }}
          />
        </div>
        
        <div className="space-y-1">
          {currentPhase.effects.map((effect, index) => (
            <motion.div
              key={effect}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: phaseProgress > (index * currentPhase.duration / currentPhase.effects.length) ? 1 : 0.3,
                x: 0 
              }}
              className="text-xs text-gray-300 flex items-center gap-2"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentPhase.color }}
              />
              {effect}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Simulation Phases</h4>
        
        {simulationPhases.map((phase, index) => {
          const isActive = index === currentPhaseIndex;
          const isCompleted = index < currentPhaseIndex;
          
          return (
            <motion.div
              key={phase.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                isActive 
                  ? 'border-yellow-500/50 bg-yellow-900/20' 
                  : isCompleted
                  ? 'border-green-500/30 bg-green-900/10'
                  : 'border-gray-600/30 bg-gray-900/10 hover:bg-gray-800/20'
              }`}
              onClick={() => handlePhaseClick(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-1 rounded"
                    style={{ backgroundColor: `${phase.color}20` }}
                  >
                    {phase.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{phase.name}</div>
                    <div className="text-xs text-gray-400">{phase.duration}s duration</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {isCompleted ? '✓' : isActive ? '▶' : '○'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Impact Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Impact Parameters</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-400">Energy:</span>
            <span className="text-white ml-1">{impactData.energyMt} MT</span>
          </div>
          <div>
            <span className="text-gray-400">Crater:</span>
            <span className="text-white ml-1">{impactData.craterKm} km</span>
          </div>
          <div>
            <span className="text-gray-400">Thermal:</span>
            <span className="text-white ml-1">{impactData.thermalKm} km</span>
          </div>
          <div>
            <span className="text-gray-400">Shockwave:</span>
            <span className="text-white ml-1">{impactData.shockKm} km</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeLapseSimulation;
