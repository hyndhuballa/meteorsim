import { ImpactResults, SimulationParams } from '../types/simulator';

export const calculateImpact = (params: SimulationParams): ImpactResults => {
  const { asteroidSize, velocity, angle } = params;
  
  // Convert size from meters to km for calculations
  const sizeKm = asteroidSize / 1000;
  
  // Density of typical asteroid (kg/m³)
  const density = 3000;
  
  // Calculate mass (kg)
  const radius = asteroidSize / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * density;
  
  // Calculate kinetic energy (Joules)
  const energyJoules = 0.5 * mass * Math.pow(velocity * 1000, 2); // velocity in m/s
  
  // Convert to Megatons of TNT (1 Mt = 4.184 × 10^15 J)
  const energy = energyJoules / (4.184e15);
  
  // Calculate crater diameter (simplified formula)
  const angleRadians = (angle * Math.PI) / 180;
  const craterDiameter = sizeKm * Math.pow(velocity / 20, 0.78) * Math.sin(angleRadians);
  
  // Calculate damage radii
  const thermalRadius = craterDiameter * 4;
  const shockwaveRadius = craterDiameter * 8;
  
  return {
    energy,
    craterDiameter,
    thermalRadius,
    shockwaveRadius,
    mass: mass / 1e12 // Convert to trillion kg for display
  };
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
};