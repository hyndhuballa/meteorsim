import React, { useMemo } from 'react';
import { Users, Building, Flame, Waves, Zap, AlertTriangle, TreePine, Factory } from 'lucide-react';
import { motion } from 'framer-motion';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population?: number;
  metropolitanPopulation?: number;
  populationDensity?: number;
  area?: number;
  coastalCity?: boolean;
  infrastructure?: {
    buildings?: number;
    skyscrapers?: number;
    hospitals?: number;
    schools?: number;
    airports?: number;
    ports?: number;
    powerPlants?: number;
    bridges?: number;
  };
  economy?: {
    gdp?: number;
    majorIndustries?: string[];
  };
  geography?: {
    terrain?: string;
    waterBodies?: string[];
    tsunamiRisk?: boolean;
    earthquakeRisk?: boolean;
    monsoonRisk?: boolean;
  };
}

interface ImpactResult {
  energyMt: number;
  craterKm: number;
  thermalKm: number;
  shockKm: number;
  city?: City | null;
}

interface ImpactConsequencesDashboardProps {
  selectedCity: City | null;
  lastResult: ImpactResult | null;
  asteroidSize: number;
  velocity: number;
  isSimulating: boolean;
}

interface ConsequenceData {
  casualties: {
    immediate: number;
    thermal: number;
    shockwave: number;
    total: number;
  };
  infrastructure: {
    buildingsDestroyed: number;
    buildingsPercentage: number;
    criticalInfrastructure: string[];
    economicLoss: number;
  };
  environmental: {
    effects: string[];
    fireRadius: number;
    debrisField: number;
    atmosphericEffects: string[];
  };
  zones: {
    fireball: { radius: number; description: string; severity: string };
    thermal: { radius: number; description: string; severity: string };
    shockwave: { radius: number; description: string; severity: string };
    airblast: { radius: number; description: string; severity: string };
  };
}

const ImpactConsequencesDashboard: React.FC<ImpactConsequencesDashboardProps> = ({
  selectedCity,
  lastResult,
  asteroidSize,
  velocity,
  isSimulating
}) => {
  const consequenceData: ConsequenceData | null = useMemo(() => {
    if (!selectedCity || !lastResult) return null;

    const city = selectedCity;
    const { energyMt, craterKm, thermalKm, shockKm } = lastResult;

    // Calculate fireball radius (roughly 1/3 of crater diameter)
    const fireballKm = craterKm * 0.33;
    
    // Calculate airblast radius (extends beyond shockwave)
    const airblastKm = shockKm * 1.5;

    // Population calculations based on density and affected areas
    const populationDensity = city.populationDensity || 1000;
    const totalPopulation = city.population || 1000000;

    // Calculate affected populations in each zone
    const fireballArea = Math.PI * Math.pow(fireballKm, 2);
    const thermalArea = Math.PI * Math.pow(thermalKm, 2);
    const shockwaveArea = Math.PI * Math.pow(shockKm, 2);
    const airblastArea = Math.PI * Math.pow(airblastKm, 2);

    const fireballPop = Math.min(fireballArea * populationDensity, totalPopulation);
    const thermalPop = Math.min((thermalArea - fireballArea) * populationDensity, totalPopulation - fireballPop);
    const shockwavePop = Math.min((shockwaveArea - thermalArea) * populationDensity, totalPopulation - fireballPop - thermalPop);

    // Infrastructure calculations
    const totalBuildings = city.infrastructure?.buildings || 100000;
    const buildingsInCrater = Math.min(fireballArea * (totalBuildings / (city.area || 100)), totalBuildings);
    const buildingsInThermal = Math.min((thermalArea - fireballArea) * (totalBuildings / (city.area || 100)), totalBuildings - buildingsInCrater);
    
    const buildingsDestroyed = buildingsInCrater + (buildingsInThermal * 0.7);
    const buildingsPercentage = (buildingsDestroyed / totalBuildings) * 100;

    // Critical infrastructure affected
    const criticalInfrastructure: string[] = [];
    if (thermalKm > 5) criticalInfrastructure.push("Airports", "Power Plants", "Hospitals");
    if (thermalKm > 10) criticalInfrastructure.push("Government Buildings", "Financial District");
    if (shockKm > 15) criticalInfrastructure.push("Suburban Infrastructure", "Transportation Networks");

    // Economic impact (rough estimate based on GDP and affected area)
    const cityGDP = city.economy?.gdp || 100000000000;
    const economicLoss = (thermalArea / (city.area || 100)) * cityGDP * 0.3;

    // Environmental effects
    const environmentalEffects: string[] = [];
    const atmosphericEffects: string[] = [];

    if (energyMt > 1) {
      environmentalEffects.push("Massive fires", "Debris ejection");
      atmosphericEffects.push("Dust cloud formation", "Local climate disruption");
    }
    if (energyMt > 10) {
      environmentalEffects.push("Regional forest fires", "Seismic activity");
      atmosphericEffects.push("Atmospheric heating", "Acid rain formation");
    }
    if (energyMt > 100) {
      environmentalEffects.push("Continental fires", "Mass extinction event");
      atmosphericEffects.push("Nuclear winter effects", "Global climate change");
    }

    if (city.coastalCity && city.geography?.tsunamiRisk) {
      environmentalEffects.push("Tsunami generation", "Coastal flooding");
    }

    return {
      casualties: {
        immediate: Math.round(fireballPop),
        thermal: Math.round(thermalPop * 0.8),
        shockwave: Math.round(shockwavePop * 0.3),
        total: Math.round(fireballPop + (thermalPop * 0.8) + (shockwavePop * 0.3))
      },
      infrastructure: {
        buildingsDestroyed: Math.round(buildingsDestroyed),
        buildingsPercentage: Math.round(buildingsPercentage),
        criticalInfrastructure,
        economicLoss: Math.round(economicLoss / 1000000000) // in billions
      },
      environmental: {
        effects: environmentalEffects,
        fireRadius: Math.round(fireballKm * 10) / 10,
        debrisField: Math.round(shockKm * 2),
        atmosphericEffects
      },
      zones: {
        fireball: {
          radius: Math.round(fireballKm * 10) / 10,
          description: "Complete vaporization",
          severity: "Total Destruction"
        },
        thermal: {
          radius: Math.round(thermalKm * 10) / 10,
          description: "Third-degree burns, fires",
          severity: "Severe Damage"
        },
        shockwave: {
          radius: Math.round(shockKm * 10) / 10,
          description: "Building collapse, debris",
          severity: "Heavy Damage"
        },
        airblast: {
          radius: Math.round(airblastKm * 10) / 10,
          description: "Broken windows, minor injuries",
          severity: "Light Damage"
        }
      }
    };
  }, [selectedCity, lastResult, asteroidSize, velocity]);

  if (!selectedCity) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a city to see impact consequences</p>
        </div>
      </div>
    );
  }

  if (isSimulating) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <Zap className="w-full h-full text-yellow-400" />
          </motion.div>
          <p className="text-white">Calculating impact consequences...</p>
        </div>
      </div>
    );
  }

  if (!consequenceData) {
    return (
      <div className="glass-card p-6 h-full">
        <h3 className="text-xl font-semibold mb-4 text-glow">Impact Analysis</h3>
        <div className="text-center text-gray-400">
          <p>Run simulation to see detailed consequences</p>
          <div className="mt-4 text-sm">
            <p><strong>Target:</strong> {selectedCity.name}</p>
            <p><strong>Population:</strong> {(selectedCity.population || 0).toLocaleString()}</p>
            <p><strong>Type:</strong> {selectedCity.coastalCity ? 'Coastal City' : 'Inland City'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 h-full overflow-y-auto"
    >
      <h3 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-red-400" />
        Impact Consequences
      </h3>

      {/* Casualties Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-300">
          <Users className="w-5 h-5" />
          Casualties
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">
              {consequenceData.casualties.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Total Casualties</div>
          </div>
          <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-500/30">
            <div className="text-lg font-bold text-orange-400">
              {consequenceData.casualties.immediate.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Immediate Deaths</div>
          </div>
        </div>
      </div>

      {/* Infrastructure Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-300">
          <Building className="w-5 h-5" />
          Infrastructure
        </h4>
        <div className="space-y-3">
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Buildings Destroyed</span>
              <span className="text-lg font-bold text-blue-400">
                {consequenceData.infrastructure.buildingsDestroyed.toLocaleString()} 
                ({consequenceData.infrastructure.buildingsPercentage}%)
              </span>
            </div>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
            <div className="text-sm text-gray-300 mb-2">Critical Infrastructure Affected:</div>
            <div className="flex flex-wrap gap-1">
              {consequenceData.infrastructure.criticalInfrastructure.map((item, index) => (
                <span key={index} className="text-xs bg-purple-600/30 px-2 py-1 rounded">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/30">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Economic Loss</span>
              <span className="text-lg font-bold text-green-400">
                ${consequenceData.infrastructure.economicLoss}B
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-300">
          <TreePine className="w-5 h-5" />
          Environmental Effects
        </h4>
        <div className="space-y-3">
          <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30">
            <div className="text-sm text-gray-300 mb-2">Primary Effects:</div>
            <div className="space-y-1">
              {consequenceData.environmental.effects.map((effect, index) => (
                <div key={index} className="text-xs text-red-300 flex items-center gap-2">
                  <Flame className="w-3 h-3" />
                  {effect}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900/30 p-3 rounded-lg border border-gray-500/30">
            <div className="text-sm text-gray-300 mb-2">Atmospheric Effects:</div>
            <div className="space-y-1">
              {consequenceData.environmental.atmosphericEffects.map((effect, index) => (
                <div key={index} className="text-xs text-gray-300 flex items-center gap-2">
                  <Factory className="w-3 h-3" />
                  {effect}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Zones Section */}
      <div>
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-300">
          <Zap className="w-5 h-5" />
          Damage Zones
        </h4>
        <div className="space-y-2">
          {Object.entries(consequenceData.zones).map(([zone, data]) => (
            <div key={zone} className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium capitalize text-yellow-300">{zone} Zone</span>
                <span className="text-sm font-bold text-yellow-400">{data.radius} km</span>
              </div>
              <div className="text-xs text-gray-300">{data.description}</div>
              <div className="text-xs font-medium mt-1" style={{
                color: zone === 'fireball' ? '#ef4444' : 
                       zone === 'thermal' ? '#f97316' : 
                       zone === 'shockwave' ? '#eab308' : '#84cc16'
              }}>
                {data.severity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactConsequencesDashboard;
