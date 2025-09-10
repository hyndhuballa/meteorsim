import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Satellite, 
  Radio, 
  Shield, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Phone,
  Megaphone,
  Truck
} from 'lucide-react';

interface AlertPhase {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'pending' | 'active' | 'complete';
  icon: React.ReactNode;
  color: string;
  actions: string[];
  timeToImpact?: string;
}

interface GlobalAlertSystemProps {
  isActive: boolean;
  impactLocation?: any;
  asteroidData?: any;
  onPhaseChange?: (phase: AlertPhase) => void;
}

const GlobalAlertSystem: React.FC<GlobalAlertSystemProps> = ({
  isActive,
  impactLocation,
  asteroidData,
  onPhaseChange
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [alertPhases, setAlertPhases] = useState<AlertPhase[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);

  // Initialize alert phases
  useEffect(() => {
    if (!isActive) return;

    const phases: AlertPhase[] = [
      {
        id: 'detection',
        name: 'Initial Detection',
        description: 'Space-based telescopes detect incoming asteroid',
        duration: 'T-72 hours',
        status: 'pending',
        icon: <Satellite className="w-6 h-6" />,
        color: '#3B82F6',
        actions: [
          'Automated telescope detection',
          'Trajectory calculation initiated',
          'Size and composition analysis',
          'Impact probability assessment'
        ],
        timeToImpact: '72 hours'
      },
      {
        id: 'verification',
        name: 'Threat Verification',
        description: 'Multiple observatories confirm impact trajectory',
        duration: 'T-48 hours',
        status: 'pending',
        icon: <Globe className="w-6 h-6" />,
        color: '#8B5CF6',
        actions: [
          'International observatory network activated',
          'Trajectory refinement and confirmation',
          'Impact zone prediction narrowed',
          'Threat level classification assigned'
        ],
        timeToImpact: '48 hours'
      },
      {
        id: 'government-alert',
        name: 'Government Notification',
        description: 'Space agencies alert national governments',
        duration: 'T-36 hours',
        status: 'pending',
        icon: <Shield className="w-6 h-6" />,
        color: '#F59E0B',
        actions: [
          'NASA/ESA notify government officials',
          'Emergency response teams activated',
          'International coordination initiated',
          'Media briefing preparation'
        ],
        timeToImpact: '36 hours'
      },
      {
        id: 'public-warning',
        name: 'Public Warning Issued',
        description: 'Emergency broadcast system activated worldwide',
        duration: 'T-24 hours',
        status: 'pending',
        icon: <Radio className="w-6 h-6" />,
        color: '#EF4444',
        actions: [
          'Emergency Alert System (EAS) activated',
          'Mass media notifications sent',
          'Social media emergency broadcasts',
          'International warning coordination'
        ],
        timeToImpact: '24 hours'
      },
      {
        id: 'evacuation',
        name: 'Mass Evacuation',
        description: 'Large-scale population movement from impact zone',
        duration: 'T-12 hours',
        status: 'pending',
        icon: <Truck className="w-6 h-6" />,
        color: '#DC2626',
        actions: [
          'Mandatory evacuation orders issued',
          'Transportation networks mobilized',
          'Emergency shelters opened',
          'Military assistance deployed'
        ],
        timeToImpact: '12 hours'
      },
      {
        id: 'final-preparations',
        name: 'Final Preparations',
        description: 'Last-minute safety measures and shelter protocols',
        duration: 'T-2 hours',
        status: 'pending',
        icon: <AlertTriangle className="w-6 h-6" />,
        color: '#991B1B',
        actions: [
          'Final evacuation sweeps',
          'Emergency services positioned',
          'Communication systems secured',
          'Shelter-in-place protocols activated'
        ],
        timeToImpact: '2 hours'
      },
      {
        id: 'impact',
        name: 'Impact Event',
        description: 'Asteroid impact occurs - emergency response begins',
        duration: 'T+0',
        status: 'pending',
        icon: <Zap className="w-6 h-6" />,
        color: '#7F1D1D',
        actions: [
          'Impact event occurs',
          'Search and rescue operations begin',
          'Medical emergency response',
          'Damage assessment initiated'
        ],
        timeToImpact: 'IMPACT'
      }
    ];

    setAlertPhases(phases);
  }, [isActive]);

  // Simulate alert progression
  useEffect(() => {
    if (!isActive || alertPhases.length === 0) return;

    setIsSimulating(true);
    let phaseIndex = 0;

    const progressPhases = () => {
      if (phaseIndex < alertPhases.length) {
        setAlertPhases(prev => prev.map((phase, index) => ({
          ...phase,
          status: index < phaseIndex ? 'complete' : index === phaseIndex ? 'active' : 'pending'
        })));

        setCurrentPhase(phaseIndex);
        setTimelineProgress((phaseIndex / (alertPhases.length - 1)) * 100);
        
        onPhaseChange?.(alertPhases[phaseIndex]);
        
        phaseIndex++;
        setTimeout(progressPhases, 2000); // 2 seconds per phase
      } else {
        setIsSimulating(false);
      }
    };

    setTimeout(progressPhases, 1000);
  }, [isActive, alertPhases.length]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'active':
        return <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-500" />;
    }
  };

  if (!isActive) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Global alert system inactive</p>
          <p className="text-sm mt-2">Run simulation to see detection timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-400" />
          Global Alert System
        </h3>
        {impactLocation && (
          <p className="text-sm text-gray-300 mt-1">
            Target: {impactLocation.name || 'Unknown Location'}
          </p>
        )}
      </div>

      {/* Timeline Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Alert Timeline Progress</span>
          <span className="text-sm text-white font-medium">
            {Math.round(timelineProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${timelineProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Alert Phases */}
      <div className="space-y-3">
        {alertPhases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all ${
              phase.status === 'active'
                ? 'bg-yellow-900/30 border-yellow-500/50 shadow-lg'
                : phase.status === 'complete'
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-gray-800/30 border-gray-600/30'
            }`}
          >
            {/* Phase Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(phase.status)}
                <div className="flex items-center gap-2" style={{ color: phase.color }}>
                  {phase.icon}
                  <span className="font-semibold text-white">{phase.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {phase.timeToImpact}
                </div>
                <div className="text-xs text-gray-400">
                  {phase.duration}
                </div>
              </div>
            </div>

            {/* Phase Description */}
            <p className="text-sm text-gray-300 mb-3">{phase.description}</p>

            {/* Phase Actions */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-medium">Key Actions:</div>
              <div className="grid grid-cols-1 gap-1">
                {phase.actions.map((action, actionIndex) => (
                  <motion.div
                    key={actionIndex}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: phase.status === 'active' || phase.status === 'complete' ? 1 : 0.5 
                    }}
                    transition={{ delay: actionIndex * 0.1 }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      phase.status === 'complete' 
                        ? 'bg-green-400' 
                        : phase.status === 'active'
                        ? 'bg-yellow-400'
                        : 'bg-gray-500'
                    }`} />
                    <span className={
                      phase.status === 'complete' 
                        ? 'text-green-300' 
                        : phase.status === 'active'
                        ? 'text-yellow-300'
                        : 'text-gray-400'
                    }>
                      {action}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Active Phase Indicator */}
            {phase.status === 'active' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 bg-yellow-500/20 rounded border border-yellow-500/30"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                  <span className="text-xs text-yellow-300 font-medium">
                    CURRENTLY ACTIVE - {phase.name.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-blue-400" />
          Communication Systems Status
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Emergency Alert System</span>
            <span className="text-xs text-green-400 font-medium">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Satellite Network</span>
            <span className="text-xs text-green-400 font-medium">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">International Coordination</span>
            <span className="text-xs text-yellow-400 font-medium">STANDBY</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Public Broadcasting</span>
            <span className="text-xs text-green-400 font-medium">READY</span>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4 text-red-400" />
          Emergency Information
        </h4>
        <div className="text-xs text-gray-300 space-y-1">
          <div>• Emergency Services: 911 (US), 112 (EU)</div>
          <div>• NASA Emergency: 1-800-NASA-INFO</div>
          <div>• Local Emergency Management: Check local listings</div>
          <div>• Emergency Radio: Monitor local emergency frequencies</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAlertSystem;
