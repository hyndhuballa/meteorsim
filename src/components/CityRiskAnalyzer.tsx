import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  Shield, 
  Users, 
  Building, 
  Waves,
  Flame,
  Zap,
  TrendingUp,
  MapPin,
  Calculator
} from 'lucide-react';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface RiskAnalysis {
  cityId: string;
  overallRisk: number; // 0-100
  vulnerabilityFactors: {
    population: number;
    infrastructure: number;
    geography: number;
    preparedness: number;
  };
  impactScenarios: {
    small: { size: number; casualties: number; damage: string };
    medium: { size: number; casualties: number; damage: string };
    large: { size: number; casualties: number; damage: string };
    catastrophic: { size: number; casualties: number; damage: string };
  };
  recommendations: string[];
  evacuationTime: number; // hours
  shelterCapacity: number; // percentage
}

interface CityRiskAnalyzerProps {
  cities: City[];
  selectedCity: City | null;
  onCitySelect?: (city: City) => void;
}

const CityRiskAnalyzer: React.FC<CityRiskAnalyzerProps> = ({
  cities,
  selectedCity,
  onCitySelect
}) => {
  const [analysisData, setAnalysisData] = useState<RiskAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'small' | 'medium' | 'large' | 'catastrophic'>('medium');

  // AI-powered risk calculation
  const calculateCityRisk = (city: City): RiskAnalysis => {
    // Simulate AI analysis based on city characteristics
    const cityData = getCityData(city);
    
    const vulnerabilityFactors = {
      population: cityData.populationDensity,
      infrastructure: cityData.infrastructureVulnerability,
      geography: cityData.geographicRisk,
      preparedness: cityData.emergencyPreparedness
    };

    const overallRisk = Math.round(
      (vulnerabilityFactors.population * 0.3 +
       vulnerabilityFactors.infrastructure * 0.25 +
       vulnerabilityFactors.geography * 0.25 +
       (100 - vulnerabilityFactors.preparedness) * 0.2)
    );

    const basePopulation = cityData.population;
    
    return {
      cityId: city.id,
      overallRisk,
      vulnerabilityFactors,
      impactScenarios: {
        small: {
          size: 50,
          casualties: Math.round(basePopulation * 0.001),
          damage: '$500M - $2B'
        },
        medium: {
          size: 200,
          casualties: Math.round(basePopulation * 0.05),
          damage: '$10B - $50B'
        },
        large: {
          size: 500,
          casualties: Math.round(basePopulation * 0.15),
          damage: '$100B - $500B'
        },
        catastrophic: {
          size: 1000,
          casualties: Math.round(basePopulation * 0.35),
          damage: '$1T+'
        }
      },
      recommendations: generateRecommendations(city, overallRisk),
      evacuationTime: cityData.evacuationTime,
      shelterCapacity: cityData.shelterCapacity
    };
  };

  const getCityData = (city: City) => {
    // Simulate city-specific data
    const cityProfiles: { [key: string]: any } = {
      'new-york': {
        population: 8400000,
        populationDensity: 95,
        infrastructureVulnerability: 80,
        geographicRisk: 60,
        emergencyPreparedness: 85,
        evacuationTime: 12,
        shelterCapacity: 45
      },
      'tokyo': {
        population: 14000000,
        populationDensity: 98,
        infrastructureVulnerability: 70,
        geographicRisk: 85,
        emergencyPreparedness: 95,
        evacuationTime: 8,
        shelterCapacity: 75
      },
      'london': {
        population: 9000000,
        populationDensity: 85,
        infrastructureVulnerability: 65,
        geographicRisk: 40,
        emergencyPreparedness: 80,
        evacuationTime: 10,
        shelterCapacity: 60
      }
    };

    return cityProfiles[city.id] || {
      population: 5000000,
      populationDensity: 70,
      infrastructureVulnerability: 75,
      geographicRisk: 50,
      emergencyPreparedness: 70,
      evacuationTime: 15,
      shelterCapacity: 40
    };
  };

  const generateRecommendations = (city: City, riskLevel: number): string[] => {
    const recommendations = [];
    
    if (riskLevel > 80) {
      recommendations.push('Immediate evacuation planning required');
      recommendations.push('Strengthen critical infrastructure');
      recommendations.push('Establish multiple emergency shelters');
    } else if (riskLevel > 60) {
      recommendations.push('Enhance early warning systems');
      recommendations.push('Improve emergency response protocols');
      recommendations.push('Increase shelter capacity');
    } else {
      recommendations.push('Maintain current preparedness levels');
      recommendations.push('Regular emergency drills');
      recommendations.push('Monitor threat assessments');
    }

    return recommendations;
  };

  const analyzeCity = async (city: City) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysis = calculateCityRisk(city);
    setAnalysisData(analysis);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (selectedCity) {
      analyzeCity(selectedCity);
    }
  }, [selectedCity]);

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return '#DC2626';
    if (risk >= 60) return '#EA580C';
    if (risk >= 40) return '#D97706';
    return '#16A34A';
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'small': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'large': return '#EF4444';
      case 'catastrophic': return '#DC2626';
      default: return '#6B7280';
    }
  };

  if (!selectedCity) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a city to analyze risk factors</p>
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
          <Brain className="w-6 h-6 text-purple-400" />
          AI Risk Analyzer
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4" />
          {selectedCity.name}
        </div>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <Calculator className="w-full h-full text-purple-400" />
            </motion.div>
            <p className="text-white">AI analyzing city vulnerabilities...</p>
            <p className="text-sm text-gray-400 mt-2">Processing population, infrastructure, and geographic data</p>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="p-4 rounded-lg border" style={{
            backgroundColor: `${getRiskColor(analysisData.overallRisk)}10`,
            borderColor: `${getRiskColor(analysisData.overallRisk)}30`
          }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-white">Overall Risk Score</h4>
              <div 
                className="text-3xl font-bold"
                style={{ color: getRiskColor(analysisData.overallRisk) }}
              >
                {analysisData.overallRisk}/100
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${analysisData.overallRisk}%`,
                  backgroundColor: getRiskColor(analysisData.overallRisk)
                }}
              />
            </div>
          </div>

          {/* Vulnerability Factors */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Vulnerability Analysis</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(analysisData.vulnerabilityFactors).map(([factor, value]) => (
                <div key={factor} className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {factor === 'population' && <Users className="w-4 h-4 text-blue-400" />}
                    {factor === 'infrastructure' && <Building className="w-4 h-4 text-orange-400" />}
                    {factor === 'geography' && <Waves className="w-4 h-4 text-green-400" />}
                    {factor === 'preparedness' && <Shield className="w-4 h-4 text-purple-400" />}
                    <span className="text-sm font-medium text-white capitalize">{factor}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{value}%</div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <div 
                      className="h-1 rounded-full bg-blue-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Scenarios */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Impact Scenarios</h4>
            
            {/* Scenario Selector */}
            <div className="flex gap-2 mb-4">
              {Object.keys(analysisData.impactScenarios).map((scenario) => (
                <button
                  key={scenario}
                  onClick={() => setSelectedScenario(scenario as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedScenario === scenario
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: selectedScenario === scenario 
                      ? `${getScenarioColor(scenario)}30`
                      : 'transparent',
                    borderColor: `${getScenarioColor(scenario)}50`
                  }}
                >
                  {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                </button>
              ))}
            </div>

            {/* Selected Scenario Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedScenario}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: `${getScenarioColor(selectedScenario)}10`,
                  borderColor: `${getScenarioColor(selectedScenario)}30`
                }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-400">Asteroid Size</div>
                    <div className="text-xl font-bold text-white">
                      {analysisData.impactScenarios[selectedScenario].size}m
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Casualties</div>
                    <div className="text-xl font-bold text-white">
                      {analysisData.impactScenarios[selectedScenario].casualties.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Economic Damage</div>
                    <div className="text-xl font-bold text-white">
                      {analysisData.impactScenarios[selectedScenario].damage}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Emergency Preparedness */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Emergency Preparedness</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Evacuation Time</span>
                </div>
                <div className="text-2xl font-bold text-white">{analysisData.evacuationTime}h</div>
              </div>
              
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Shelter Capacity</span>
                </div>
                <div className="text-2xl font-bold text-white">{analysisData.shelterCapacity}%</div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">AI Recommendations</h4>
            <div className="space-y-2">
              {analysisData.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30"
                >
                  <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-200">{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-600">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onCitySelect?.(selectedCity)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Target className="w-4 h-4" />
                Simulate Impact
              </button>
              
              <button
                onClick={() => analyzeCity(selectedCity)}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg text-white font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Re-analyze
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default CityRiskAnalyzer;
