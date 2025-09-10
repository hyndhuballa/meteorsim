import React from 'react';
import {
  Zap,
  Globe,
  Calculator,
  BookOpen,
  ArrowDown,
  Brain,
  Clock,
  Target,
  Satellite,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Hero Section */}
      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        {/* Main Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="p-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full shadow-2xl animate-pulse-glow">
              <Zap className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent text-glow animate-pulse">
          METEOR IMPACT
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          SIMULATOR
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Experience the devastating power of asteroid impacts with scientific accuracy.
          Featuring AI-powered risk analysis, real NASA data, interactive 3D Earth visualization,
          and comprehensive impact modeling. Explore cosmic consequences, learn planetary defense,
          and witness the forces that shaped our world.
        </p>

        {/* Comprehensive Feature Overview */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Complete Impact Analysis Suite</h3>

          {/* Primary Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Interactive 3D Earth</h4>
              <p className="text-gray-300 text-sm">Rotate and explore our planet with realistic impact visualizations and population heatmaps</p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Calculator className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Scientific Physics</h4>
              <p className="text-gray-300 text-sm">Accurate calculations based on NASA data, real asteroid properties, and validated impact models</p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Satellite className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Live NASA Data</h4>
              <p className="text-gray-300 text-sm">Real-time tracking of Near-Earth Objects with current orbital data and threat assessments</p>
            </div>
          </div>

          {/* Advanced Analysis Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 hover:scale-105 transition-transform duration-300">
              <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">AI Risk Analyzer</h5>
              <p className="text-gray-300 text-xs">AI-powered city vulnerability assessment with impact scenarios and emergency recommendations</p>
            </div>

            <div className="glass-card p-4 hover:scale-105 transition-transform duration-300">
              <Target className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">Impact Analysis</h5>
              <p className="text-gray-300 text-xs">Detailed consequence modeling including casualties, infrastructure damage, and economic impact</p>
            </div>

            <div className="glass-card p-4 hover:scale-105 transition-transform duration-300">
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">Time-Lapse Simulation</h5>
              <p className="text-gray-300 text-xs">Watch impacts unfold over time from initial contact through long-term aftermath effects</p>
            </div>

            <div className="glass-card p-4 hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">Aftermath Visualization</h5>
              <p className="text-gray-300 text-xs">Comprehensive post-impact analysis including environmental, geological, and societal effects</p>
            </div>
          </div>

          {/* Key Capabilities */}
          <div className="glass-card p-6">
            <h4 className="text-2xl font-bold text-white mb-6 text-center">What You Can Explore</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Simulate impacts on 20+ major world cities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Adjust asteroid size (10m - 10km) and velocity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Track real Near-Earth Objects from NASA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">AI-powered risk assessment and recommendations</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Calculate energy release, crater size, and damage zones</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-300">Visualize population density and vulnerability</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Explore time-lapse impact progression</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">Learn about planetary defense strategies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnterApp}
          className="group relative px-12 py-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl font-bold text-2xl text-white shadow-2xl hover:shadow-red-500/25 hover:scale-110 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-4">
            <span>LAUNCH SIMULATOR</span>
            <Zap className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </button>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <ArrowDown className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-400 text-sm mt-2">Scroll to explore features</p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Asteroids */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-pulse opacity-30 animation-delay-3000"></div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-32 max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Why Meteor Impact Simulation?</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Asteroid impacts have shaped Earth's history, from creating the Moon to ending the age of dinosaurs. 
                Understanding these cosmic events helps us prepare for future threats and appreciate the forces that continue to shape our planet.
              </p>
              <p>
                Our simulator uses real NASA data and scientific models to provide accurate impact calculations, 
                making complex astrophysics accessible to everyone through stunning visualizations.
              </p>
            </div>
          </div>

          <div className="glass-card p-8">
            <h4 className="text-2xl font-bold text-white mb-6 text-center">Quick Facts</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Daily space debris hitting Earth:</span>
                <span className="text-blue-400 font-mono">~50 tons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Chicxulub impact energy:</span>
                <span className="text-red-400 font-mono">100M Mt TNT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Tracked near-Earth asteroids:</span>
                <span className="text-green-400 font-mono">30,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Atmosphere protection limit:</span>
                <span className="text-purple-400 font-mono">~25 meters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;