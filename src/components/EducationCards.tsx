import React, { useState } from 'react';
import { BookOpen, Shield, Lightbulb, ChevronRight } from 'lucide-react';

const EducationCards: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'science',
      title: 'The Science',
      icon: BookOpen,
      gradient: 'from-blue-600 to-cyan-600',
      content: [
        'Asteroids travel at speeds of 11-72 km/s when they hit Earth',
        'Impact energy follows E = ½mv², where small changes in velocity create massive energy differences',
        'The angle of impact affects crater formation - vertical impacts create circular craters',
        'Most asteroids burn up in the atmosphere, but large ones can reach the surface'
      ]
    },
    {
      id: 'safety',
      title: 'Planetary Defense',
      icon: Shield,
      gradient: 'from-green-600 to-emerald-600',
      content: [
        'NASA tracks over 90% of near-Earth asteroids larger than 1 km',
        'Early detection systems can provide years of warning for large asteroids',
        'Deflection missions like DART prove we can change asteroid trajectories',
        'Even small asteroids can be detected hours before impact for local warnings'
      ]
    },
    {
      id: 'facts',
      title: 'Amazing Facts',
      icon: Lightbulb,
      gradient: 'from-purple-600 to-pink-600',
      content: [
        'The Chicxulub impact 66 million years ago was equivalent to 100 trillion tons of TNT',
        'Earth is hit by about 50 tons of space material every day, mostly dust',
        'The atmosphere protects us by burning up objects smaller than ~25 meters',
        'Jupiter acts as a "cosmic vacuum cleaner," deflecting many asteroids away from Earth'
      ]
    }
  ];

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
        Learn More
      </h3>
      
      {cards.map((card) => (
        <div key={card.id} className="glass-card overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleCard(card.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${card.gradient}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">{card.title}</h4>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                expandedCard === card.id ? 'rotate-90' : ''
              }`} 
            />
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ${
            expandedCard === card.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-6 pt-0 border-t border-white/10">
              <ul className="space-y-3">
                {card.content.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${card.gradient} flex-shrink-0`}></div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationCards;