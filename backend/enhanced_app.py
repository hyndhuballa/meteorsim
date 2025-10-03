#!/usr/bin/env python3
"""
Enhanced NASA Impact Simulator Backend
Comprehensive API for asteroid impact analysis with AI integration
"""

import os
import json
import math
import requests
import logging
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
NASA_API_KEY = os.getenv('NASA_API_KEY', 'wZH9g1tdRAIGSN7lOGjybio3awZoStL5OmkJ7Wnt')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBDGtqkVuXew1n533vl1hRiAt6zFBgd-KM')

# Configure Gemini AI
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    print("✅ Gemini AI configured successfully")
except Exception as e:
    print(f"⚠️ Gemini AI configuration failed: {e}")
    model = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NASADataService:
    """Service for fetching NASA NEO data"""

    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.nasa.gov/neo/rest/v1"

    def get_neo_lookup(self, asteroid_id):
        """Fetch detailed asteroid data from NASA NEO API"""
        try:
            url = f"{self.base_url}/neo/{asteroid_id}"
            params = {"api_key": self.api_key}
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"NASA API request failed for asteroid {asteroid_id}: {e}")
            return {"error": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error fetching asteroid {asteroid_id}: {e}")
            return {"error": str(e)}

# Initialize NASA service
nasa_service = NASADataService(NASA_API_KEY)

# Enhanced city database with detailed metrics
CITY_DATABASE = {
    'new-york': {
        'name': 'New York City',
        'lat': 40.7128,
        'lng': -74.0060,
        'population': 8336817,
        'area_km2': 778.2,
        'population_density': 10715,
        'infrastructure_score': 85,
        'emergency_preparedness': 78,
        'hospitals': 62,
        'shelters': 45,
        'evacuation_routes': 12,
        'geographic_risk': 65,
        'coastal': True,
        'elevation': 10
    },
    'london': {
        'name': 'London',
        'lat': 51.5074,
        'lng': -0.1278,
        'population': 9648110,
        'area_km2': 1572,
        'population_density': 6140,
        'infrastructure_score': 88,
        'emergency_preparedness': 82,
        'hospitals': 78,
        'shelters': 52,
        'evacuation_routes': 15,
        'geographic_risk': 45,
        'coastal': False,
        'elevation': 35
    },
    'tokyo': {
        'name': 'Tokyo',
        'lat': 35.6762,
        'lng': 139.6503,
        'population': 37400068,
        'area_km2': 2194,
        'population_density': 17045,
        'infrastructure_score': 92,
        'emergency_preparedness': 95,
        'hospitals': 156,
        'shelters': 89,
        'evacuation_routes': 28,
        'geographic_risk': 85,
        'coastal': True,
        'elevation': 40
    },
    'paris': {
        'name': 'Paris',
        'lat': 48.8566,
        'lng': 2.3522,
        'population': 2161000,
        'area_km2': 105.4,
        'population_density': 20500,
        'infrastructure_score': 86,
        'emergency_preparedness': 75,
        'hospitals': 45,
        'shelters': 32,
        'evacuation_routes': 8,
        'geographic_risk': 35,
        'coastal': False,
        'elevation': 35
    },
    'sydney': {
        'name': 'Sydney',
        'lat': -33.8688,
        'lng': 151.2093,
        'population': 5312163,
        'area_km2': 12368,
        'population_density': 430,
        'infrastructure_score': 84,
        'emergency_preparedness': 80,
        'hospitals': 38,
        'shelters': 28,
        'evacuation_routes': 18,
        'geographic_risk': 55,
        'coastal': True,
        'elevation': 58
    }
}

def calculate_detailed_impact_physics(diameter_m, velocity_km_s):
    """Calculate comprehensive impact physics"""
    # Constants
    EARTH_GRAVITY = 9.81  # m/s²
    ASTEROID_DENSITY = 2600  # kg/m³ (typical rocky asteroid)
    
    # Basic calculations
    radius_m = diameter_m / 2
    volume_m3 = (4/3) * math.pi * (radius_m ** 3)
    mass_kg = volume_m3 * ASTEROID_DENSITY
    velocity_m_s = velocity_km_s * 1000
    
    # Kinetic energy (Joules)
    kinetic_energy_j = 0.5 * mass_kg * (velocity_m_s ** 2)
    kinetic_energy_mt = kinetic_energy_j / (4.184e15)  # Convert to megatons TNT
    
    # Crater calculations
    crater_diameter_km = 1.8 * (diameter_m ** 0.78) * (velocity_km_s ** 0.44) / 1000
    crater_depth_km = crater_diameter_km / 5
    
    # Damage zones (km from impact)
    fireball_radius_km = 0.28 * (kinetic_energy_mt ** 0.33)
    thermal_radius_km = 1.9 * (kinetic_energy_mt ** 0.41)
    shockwave_radius_km = 4.6 * (kinetic_energy_mt ** 0.33)
    airblast_radius_km = 8.2 * (kinetic_energy_mt ** 0.33)
    
    return {
        'diameter_m': diameter_m,
        'mass_kg': mass_kg,
        'velocity_km_s': velocity_km_s,
        'kinetic_energy_mt': kinetic_energy_mt,
        'crater_diameter_km': crater_diameter_km,
        'crater_depth_km': crater_depth_km,
        'fireball_radius_km': fireball_radius_km,
        'thermal_radius_km': thermal_radius_km,
        'shockwave_radius_km': shockwave_radius_km,
        'airblast_radius_km': airblast_radius_km
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': {
            'nasa_api': 'connected' if NASA_API_KEY else 'missing_key',
            'gemini_ai': 'connected' if model else 'disconnected'
        }
    })

@app.route('/api/neo/hazardous', methods=['GET'])
def get_hazardous_asteroids():
    """Get hazardous Near Earth Objects from NASA API"""
    try:
        # Get current date and 7 days ahead
        start_date = datetime.now().strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={NASA_API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            hazardous_asteroids = []
            
            for date, asteroids in data['near_earth_objects'].items():
                for asteroid in asteroids:
                    if asteroid.get('is_potentially_hazardous_asteroid', False):
                        # Calculate enhanced risk score
                        diameter = asteroid['estimated_diameter']['meters']['estimated_diameter_max']
                        velocity = float(asteroid['close_approach_data'][0]['relative_velocity']['kilometers_per_second'])
                        miss_distance = float(asteroid['close_approach_data'][0]['miss_distance']['kilometers'])
                        
                        # Risk scoring algorithm
                        size_score = min(diameter / 1000 * 100, 100)  # Normalize to 100
                        velocity_score = min(velocity / 30 * 100, 100)  # Normalize to 100
                        proximity_score = max(0, 100 - (miss_distance / 7480000 * 100))  # Moon distance = 0 score
                        
                        risk_score = (size_score * 0.4 + velocity_score * 0.3 + proximity_score * 0.3)
                        
                        hazardous_asteroids.append({
                            'id': asteroid['id'],
                            'name': asteroid['name'],
                            'diameter_m': diameter,
                            'velocity_km_s': velocity,
                            'miss_distance_km': miss_distance,
                            'approach_date': asteroid['close_approach_data'][0]['close_approach_date'],
                            'risk_score': round(risk_score, 1),
                            'threat_level': get_threat_level(risk_score)
                        })
            
            # Sort by risk score
            hazardous_asteroids.sort(key=lambda x: x['risk_score'], reverse=True)
            
            return jsonify({
                'success': True,
                'count': len(hazardous_asteroids),
                'asteroids': hazardous_asteroids[:10]  # Top 10 most dangerous
            })
        else:
            return jsonify({
                'success': False,
                'error': f'NASA API error: {response.status_code}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_threat_level(risk_score):
    """Determine threat level based on risk score"""
    if risk_score >= 80:
        return 'EXTREME'
    elif risk_score >= 60:
        return 'HIGH'
    elif risk_score >= 40:
        return 'MODERATE'
    elif risk_score >= 20:
        return 'LOW'
    else:
        return 'MINIMAL'

@app.route('/api/neo/stats', methods=['GET'])
def get_neo_statistics():
    """Get comprehensive NEO statistics"""
    try:
        # Get NEO statistics from NASA
        url = f"https://api.nasa.gov/neo/rest/v1/stats?api_key={NASA_API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            stats = response.json()
            
            # Enhanced statistics
            enhanced_stats = {
                'total_discovered': stats['near_earth_object_count'],
                'potentially_hazardous': stats.get('potentially_hazardous_asteroid_count', 0),
                'size_distribution': {
                    'small': stats.get('near_earth_object_count', 0) * 0.85,  # < 140m
                    'medium': stats.get('near_earth_object_count', 0) * 0.12,  # 140m - 1km
                    'large': stats.get('near_earth_object_count', 0) * 0.03   # > 1km
                },
                'discovery_rate': {
                    'per_year': 2000,  # Approximate current rate
                    'trend': 'increasing'
                },
                'impact_probability': {
                    'next_100_years': 0.01,  # 1% chance
                    'civilization_threat': 0.0001  # 0.01% chance
                }
            }
            
            return jsonify({
                'success': True,
                'statistics': enhanced_stats,
                'last_updated': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': f'NASA API error: {response.status_code}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/impact/simulate', methods=['POST'])
def simulate_impact():
    """Simulate asteroid impact with detailed physics"""
    try:
        data = request.get_json()
        diameter = data.get('diameter', 100)  # meters
        velocity = data.get('velocity', 20)   # km/s
        city_id = data.get('city_id', 'new-york')

        # Get city data
        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])

        # Calculate physics
        physics = calculate_detailed_impact_physics(diameter, velocity)

        # Calculate casualties and damage
        population = city_data['population']
        area_km2 = city_data['area_km2']

        # Damage zones and casualties
        fireball_area = math.pi * (physics['fireball_radius_km'] ** 2)
        thermal_area = math.pi * (physics['thermal_radius_km'] ** 2)
        shockwave_area = math.pi * (physics['shockwave_radius_km'] ** 2)

        # Population density in damage zones
        pop_density = population / area_km2

        # Casualty estimates (simplified model)
        fireball_casualties = min(fireball_area * pop_density * 0.95, population)
        thermal_casualties = min(thermal_area * pop_density * 0.6, population)
        shockwave_casualties = min(shockwave_area * pop_density * 0.3, population)

        total_casualties = min(fireball_casualties + thermal_casualties + shockwave_casualties, population)

        # Infrastructure damage
        buildings_destroyed = min(shockwave_area * 1000, city_data.get('buildings', 100000))
        economic_damage_billion = physics['kinetic_energy_mt'] * 10  # Rough estimate

        result = {
            'physics': physics,
            'casualties': {
                'total': int(total_casualties),
                'fireball_zone': int(fireball_casualties),
                'thermal_zone': int(thermal_casualties),
                'shockwave_zone': int(shockwave_casualties),
                'survival_rate': max(0, (population - total_casualties) / population * 100)
            },
            'damage': {
                'buildings_destroyed': int(buildings_destroyed),
                'economic_damage_billion_usd': round(economic_damage_billion, 2),
                'infrastructure_damage_percent': min(90, physics['kinetic_energy_mt'] * 5)
            },
            'city_data': city_data,
            'timestamp': datetime.now().isoformat()
        }

        return jsonify({
            'success': True,
            'simulation': result
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ai/risk-analysis', methods=['POST'])
def ai_risk_analysis():
    """AI-powered city risk analysis using Gemini"""
    try:
        data = request.get_json()
        city_id = data.get('city_id', 'new-york')
        asteroid_size = data.get('asteroid_size', 100)

        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])

        if model:
            # Create detailed prompt for Gemini AI
            prompt = f"""
            You are Dr. Sarah Chen, a leading planetary defense expert with 20 years of experience at NASA's Planetary Defense Coordination Office.

            Analyze the asteroid impact risk for {city_data['name']} with the following parameters:
            - City: {city_data['name']}
            - Population: {city_data['population']:,}
            - Population Density: {city_data['population_density']:,} people/km²
            - Infrastructure Score: {city_data['infrastructure_score']}/100
            - Emergency Preparedness: {city_data['emergency_preparedness']}/100
            - Hospitals: {city_data['hospitals']}
            - Emergency Shelters: {city_data['shelters']}
            - Evacuation Routes: {city_data['evacuation_routes']}
            - Coastal City: {city_data['coastal']}
            - Elevation: {city_data['elevation']}m

            Asteroid Parameters:
            - Diameter: {asteroid_size} meters
            - Estimated Impact Energy: {calculate_detailed_impact_physics(asteroid_size, 20)['kinetic_energy_mt']:.2f} megatons TNT equivalent

            Provide a comprehensive risk assessment in exactly 150-200 words covering:
            1. Overall vulnerability assessment
            2. Key risk factors specific to this city
            3. Expected impact severity
            4. Critical emergency response recommendations

            Write as an expert briefing to emergency management officials. Be scientific but accessible.
            """

            try:
                response = model.generate_content(prompt)
                ai_analysis = response.text
            except Exception as e:
                print(f"Gemini API error: {e}")
                ai_analysis = f"AI analysis temporarily unavailable. Based on the data, {city_data['name']} shows moderate to high vulnerability due to population density of {city_data['population_density']:,} people/km². Immediate evacuation protocols should be activated for a {asteroid_size}m asteroid impact."
        else:
            ai_analysis = f"AI analysis unavailable. {city_data['name']} requires immediate assessment for {asteroid_size}m asteroid impact scenario."

        # Calculate basic risk factors
        risk_factors = {
            'population_density': min(100, city_data['population_density'] / 200),
            'infrastructure_vulnerability': 100 - city_data['infrastructure_score'],
            'emergency_preparedness': city_data['emergency_preparedness'],
            'geographic_risk': city_data.get('geographic_risk', 50)
        }

        overall_risk = sum(risk_factors.values()) / len(risk_factors)

        return jsonify({
            'success': True,
            'analysis': {
                'ai_analysis': ai_analysis,
                'risk_score': round(overall_risk, 1),
                'risk_factors': risk_factors,
                'city_data': city_data,
                'recommendations': generate_recommendations(city_data, asteroid_size)
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/impact/simulate-real', methods=['GET'])
def simulate_real_impact():
    """Simulate asteroid impact using lat/lng and optional provided asteroid parameters.
    Query params: asteroid_id (optional), lat, lng, diameter (m, optional), velocity (km/s, optional)
    Picks nearest known city to ground population metrics, then computes physics.
    """
    try:
        asteroid_id = request.args.get('asteroid_id')  # currently unused, kept for compatibility
        lat = float(request.args.get('lat', '0'))
        lng = float(request.args.get('lng', '0'))
        diameter = float(request.args.get('diameter', '100'))
        velocity = float(request.args.get('velocity', '20'))

        # Find nearest city in our database to ground casualty/damage calcs
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        nearest_key = None
        nearest_dist = float('inf')
        for key, cd in CITY_DATABASE.items():
            d = haversine(lat, lng, cd['lat'], cd['lng'])
            if d < nearest_dist:
                nearest_dist = d
                nearest_key = key
        city_data = CITY_DATABASE.get(nearest_key or 'new-york')

        physics = calculate_detailed_impact_physics(diameter, velocity)

        population = city_data['population']
        area_km2 = city_data['area_km2']
        pop_density = population / max(area_km2, 1)

        fireball_area = math.pi * (physics['fireball_radius_km'] ** 2)
        thermal_area = math.pi * (physics['thermal_radius_km'] ** 2)
        shockwave_area = math.pi * (physics['shockwave_radius_km'] ** 2)

        fireball_casualties = min(fireball_area * pop_density * 0.95, population)
        thermal_casualties = min(thermal_area * pop_density * 0.6, population)
        shockwave_casualties = min(shockwave_area * pop_density * 0.3, population)
        total_casualties = min(fireball_casualties + thermal_casualties + shockwave_casualties, population)

        result = {
            'asteroid': {
                'id': asteroid_id or 'custom',
                'diameter_meters': diameter,
                'is_hazardous': diameter >= 140
            },
            'impact': {
                'location': { 'lat': lat, 'lng': lng },
                'energy_mt': physics['kinetic_energy_mt'],
                'crater_km': physics['crater_diameter_km'],
                'thermal_km': physics['thermal_radius_km'],
                'shock_km': physics['shockwave_radius_km'],
                'velocity_kms': velocity
            },
            'casualties': {
                'total': int(total_casualties),
                'fireball_zone': int(fireball_casualties),
                'thermal_zone': int(thermal_casualties),
                'shockwave_zone': int(shockwave_casualties)
            },
            'city_data': city_data,
            'nearest_city_key': nearest_key,
        }

        return jsonify({ 'success': True, 'simulation': result })
    except Exception as e:
        return jsonify({ 'success': False, 'error': str(e) }), 500


@app.route('/api/ai/mitigations', methods=['POST'])
def ai_mitigations():
    """Generate technical and civil protection mitigations using Gemini, strictly grounded to provided data."""
    try:
        data = request.get_json()
        city_id = data.get('city_id', 'new-york')
        asteroid_size = data.get('asteroid_size', 100)
        velocity = data.get('velocity', 20)

        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])
        physics = calculate_detailed_impact_physics(asteroid_size, velocity)

        base_context = {
            'city': city_data,
            'asteroid': {
                'diameter_m': asteroid_size,
                'velocity_km_s': velocity,
                'energy_mt': physics['kinetic_energy_mt']
            }
        }

        technical_defaults = [
            'Kinetic impactor mission planning (multi-year lead time, trajectory change)',
            'Gravity tractor station-keeping (requires years of engagement)',
            'Nuclear standoff detonation (last resort; fragmentation risk management)',
            'Wide-field survey expansion to extend warning time',
            'Rapid-launch capability and mission rehearsal'
        ]
        civil_defaults = [
            'Tiered evacuations by concentric zones based on shock/thermal radii',
            'Hardened shelters and underground facilities activation',
            'Medical surge capacity and triage centers near low-risk zones',
            'Fuel, food, water stockpiles; backup comms and power',
            'Tsunami protocols for coastal areas; traffic contraflow plans'
        ]

        if model:
            prompt = f"""
You are a mitigation planner. ONLY use the structured JSON context below. Do not invent data. If something is not present, say 'Not available'.
Return a compact JSON with keys: technical_mitigations, civil_mitigations, priority_actions (3 items), rationale.

CONTEXT (JSON):
City: {json.dumps(city_data)}
Asteroid: {json.dumps(base_context['asteroid'])}

Rules:
- Ground all numbers to provided context (e.g., use energy_mt, population, coastal, hospitals).
- If coastal is true, include tsunami-specific steps.
- Keep items short (max 20 words each).
- Avoid speculative technologies; stick to standard methods.
"""
            try:
                response = model.generate_content(prompt)
                text = response.text or ''
            except Exception as e:
                print(f"Gemini API error in mitigations: {e}")
                text = ''
        else:
            text = ''

        mitigations = {
            'technical_mitigations': technical_defaults,
            'civil_mitigations': civil_defaults,
            'priority_actions': [
                'Issue immediate public guidance and activate EOC',
                'Pre-stage evacuations based on shock radius',
                'Secure hospitals, fuel, water, and shelters'
            ],
            'rationale': 'Defaults used; AI text merged when available.'
        }

        # Try to merge AI JSON if present
        try:
            ai_json_start = text.find('{')
            ai_json_end = text.rfind('}')
            if ai_json_start != -1 and ai_json_end != -1:
                ai_obj = json.loads(text[ai_json_start:ai_json_end+1])
                for k in ['technical_mitigations', 'civil_mitigations', 'priority_actions', 'rationale']:
                    if k in ai_obj:
                        mitigations[k] = ai_obj[k]
        except Exception:
            pass

        return jsonify({
            'success': True,
            'context': base_context,
            'mitigations': mitigations
        })
    except Exception as e:
        return jsonify({ 'success': False, 'error': str(e) }), 500


def generate_recommendations(city_data, asteroid_size):
    """Generate emergency recommendations based on city data and asteroid size"""
    recommendations = []

    if asteroid_size > 500:
        recommendations.append("IMMEDIATE EVACUATION: City-wide evacuation required within 12 hours")
        recommendations.append("INTERNATIONAL AID: Request immediate international emergency assistance")
    elif asteroid_size > 200:
        recommendations.append("MASS EVACUATION: Evacuate within 50km radius of predicted impact")
        recommendations.append("EMERGENCY SHELTERS: Open all available underground facilities")
    else:
        recommendations.append("SELECTIVE EVACUATION: Evacuate high-risk areas and coastal zones")
        recommendations.append("SHELTER IN PLACE: Reinforce buildings and prepare emergency supplies")

    if city_data['coastal']:
        recommendations.append("TSUNAMI WARNING: Activate coastal evacuation protocols immediately")

    if city_data['emergency_preparedness'] < 70:
        recommendations.append("EMERGENCY COORDINATION: Establish unified command center")

    if city_data['hospitals'] < 50:
        recommendations.append("MEDICAL SURGE: Request additional medical resources from neighboring regions")

    return recommendations

@app.route('/api/cities/data', methods=['GET'])
def get_cities_data():
    """Get comprehensive city database"""
    return jsonify({
        'success': True,
        'cities': CITY_DATABASE
    })

@app.route('/api/timeline/phases', methods=['POST'])
def get_timeline_phases():
    """Get impact timeline phases"""
    try:
        data = request.get_json()
        asteroid_size = data.get('asteroid_size', 100)

        phases = [
            {
                'id': 'approach',
                'name': 'Atmospheric Entry',
                'duration': '10 seconds',
                'description': 'Asteroid enters Earth\'s atmosphere at hypersonic speed',
                'effects': ['Visible fireball', 'Sonic booms', 'Atmospheric heating']
            },
            {
                'id': 'impact',
                'name': 'Ground Impact',
                'duration': 'Instantaneous',
                'description': 'Asteroid strikes surface with tremendous energy release',
                'effects': ['Crater formation', 'Seismic waves', 'Initial fireball']
            },
            {
                'id': 'fireball',
                'name': 'Fireball Expansion',
                'duration': '30 seconds',
                'description': 'Superheated plasma expands from impact site',
                'effects': ['Thermal radiation', 'Vaporization', 'Intense heat']
            },
            {
                'id': 'shockwave',
                'name': 'Shockwave Propagation',
                'duration': '2-5 minutes',
                'description': 'Pressure wave travels outward destroying structures',
                'effects': ['Building collapse', 'Overpressure', 'Debris field']
            },
            {
                'id': 'aftermath',
                'name': 'Immediate Aftermath',
                'duration': '1-24 hours',
                'description': 'Secondary effects and environmental changes begin',
                'effects': ['Dust cloud', 'Fires', 'Seismic aftershocks']
            }
        ]

        return jsonify({
            'success': True,
            'phases': phases,
            'asteroid_size': asteroid_size
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/aftermath/layers', methods=['POST'])
def get_aftermath_layers():
    """Get post-impact visualization layers"""
    try:
        data = request.get_json()
        asteroid_size = data.get('asteroid_size', 100)

        # Calculate impact energy for layer intensity
        physics = calculate_detailed_impact_physics(asteroid_size, 20)
        energy_mt = physics['kinetic_energy_mt']

        layers = [
            {
                'id': 'dust-cloud',
                'name': 'Dust Cloud',
                'intensity': min(100, energy_mt * 10),
                'duration': '6-12 months',
                'description': 'Atmospheric dust blocking sunlight',
                'color': '#8B4513'
            },
            {
                'id': 'fire-zones',
                'name': 'Fire Zones',
                'intensity': min(100, energy_mt * 15),
                'duration': '1-4 weeks',
                'description': 'Widespread fires from thermal radiation',
                'color': '#FF4500'
            },
            {
                'id': 'radiation-zones',
                'name': 'Radiation Zones',
                'intensity': min(100, energy_mt * 5),
                'duration': '1-10 years',
                'description': 'Radioactive contamination areas',
                'color': '#32CD32'
            },
            {
                'id': 'climate-effects',
                'name': 'Climate Effects',
                'intensity': min(100, energy_mt * 8),
                'duration': '2-5 years',
                'description': 'Global temperature and weather changes',
                'color': '#4169E1'
            }
        ]

        return jsonify({
            'success': True,
            'layers': layers,
            'impact_energy_mt': energy_mt
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/survival/zones', methods=['POST'])
def get_survival_zones():
    """Calculate survival probability zones"""
    try:
        data = request.get_json()
        city_id = data.get('city_id', 'new-york')
        asteroid_size = data.get('asteroid_size', 100)

        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])
        physics = calculate_detailed_impact_physics(asteroid_size, 20)

        # Calculate survival zones
        base_radius = physics['shockwave_radius_km']

        zones = [
            {
                'id': 'ground-zero',
                'name': 'Ground Zero',
                'radius': base_radius * 0.2,
                'survival_rate': 0,
                'color': '#DC2626',
                'description': 'Complete destruction - No survival possible',
                'factors': {
                    'shelters': 0,
                    'hospitals': 0,
                    'evacuation_routes': 0,
                    'infrastructure': 0
                }
            },
            {
                'id': 'critical-zone',
                'name': 'Critical Impact Zone',
                'radius': base_radius * 0.5,
                'survival_rate': 5,
                'color': '#EA580C',
                'description': 'Extreme danger - Survival only in reinforced shelters',
                'factors': {
                    'shelters': 10,
                    'hospitals': 5,
                    'evacuation_routes': 15,
                    'infrastructure': 20
                }
            },
            {
                'id': 'severe-zone',
                'name': 'Severe Damage Zone',
                'radius': base_radius * 0.8,
                'survival_rate': 25,
                'color': '#F59E0B',
                'description': 'Heavy casualties - Underground shelters essential',
                'factors': {
                    'shelters': 40,
                    'hospitals': 25,
                    'evacuation_routes': 35,
                    'infrastructure': 45
                }
            },
            {
                'id': 'moderate-zone',
                'name': 'Moderate Risk Zone',
                'radius': base_radius * 1.2,
                'survival_rate': 60,
                'color': '#EAB308',
                'description': 'Significant risk - Immediate evacuation required',
                'factors': {
                    'shelters': 70,
                    'hospitals': 60,
                    'evacuation_routes': 65,
                    'infrastructure': 70
                }
            },
            {
                'id': 'safe-zone',
                'name': 'Relative Safety Zone',
                'radius': base_radius * 2.5,
                'survival_rate': 95,
                'color': '#22C55E',
                'description': 'High survival rate - Minor injuries possible',
                'factors': {
                    'shelters': 95,
                    'hospitals': 90,
                    'evacuation_routes': 95,
                    'infrastructure': 95
                }
            }
        ]

        return jsonify({
            'success': True,
            'zones': zones,
            'city_data': city_data,
            'impact_radius': base_radius
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts/timeline', methods=['POST'])
def get_alert_timeline():
    """Generate global alert system timeline"""
    try:
        data = request.get_json()
        asteroid_size = data.get('asteroid_size', 100)
        detection_time = data.get('detection_time', 72)  # hours before impact

        # Calculate timeline based on asteroid size and detection time
        timeline_phases = [
            {
                'id': 'detection',
                'name': 'Initial Detection',
                'time_to_impact': detection_time,
                'duration': 'T-72h',
                'status': 'active',
                'actions': [
                    'Automated telescope detection',
                    'Trajectory calculation initiated',
                    'Size and composition analysis',
                    'Impact probability assessment'
                ],
                'agencies': ['NASA', 'ESA', 'JAXA', 'Roscosmos']
            },
            {
                'id': 'verification',
                'name': 'Threat Verification',
                'time_to_impact': detection_time - 24,
                'duration': 'T-48h',
                'status': 'pending',
                'actions': [
                    'International observatory network activated',
                    'Trajectory refinement and confirmation',
                    'Impact zone prediction narrowed',
                    'Threat level classification assigned'
                ],
                'agencies': ['International Astronomical Union', 'Minor Planet Center']
            },
            {
                'id': 'government-alert',
                'name': 'Government Notification',
                'time_to_impact': detection_time - 36,
                'duration': 'T-36h',
                'status': 'pending',
                'actions': [
                    'Space agencies notify government officials',
                    'Emergency response teams activated',
                    'International coordination initiated',
                    'Media briefing preparation'
                ],
                'agencies': ['NASA Planetary Defense', 'UN Office for Outer Space Affairs']
            },
            {
                'id': 'public-warning',
                'name': 'Public Warning Issued',
                'time_to_impact': detection_time - 48,
                'duration': 'T-24h',
                'status': 'pending',
                'actions': [
                    'Emergency Alert System (EAS) activated',
                    'Mass media notifications sent',
                    'Social media emergency broadcasts',
                    'International warning coordination'
                ],
                'agencies': ['FEMA', 'Local Emergency Management', 'Media Networks']
            },
            {
                'id': 'evacuation',
                'name': 'Mass Evacuation',
                'time_to_impact': detection_time - 60,
                'duration': 'T-12h',
                'status': 'pending',
                'actions': [
                    'Mandatory evacuation orders issued',
                    'Transportation networks mobilized',
                    'Emergency shelters opened',
                    'Military assistance deployed'
                ],
                'agencies': ['National Guard', 'Transportation Authorities', 'Red Cross']
            }
        ]

        # Adjust timeline based on asteroid size
        if asteroid_size > 500:  # Large asteroid - more time needed
            for phase in timeline_phases:
                phase['time_to_impact'] = phase['time_to_impact'] * 1.5
        elif asteroid_size < 100:  # Small asteroid - less warning time
            for phase in timeline_phases:
                phase['time_to_impact'] = phase['time_to_impact'] * 0.7

        return jsonify({
            'success': True,
            'timeline': timeline_phases,
            'total_warning_time': detection_time,
            'asteroid_size': asteroid_size,
            'threat_level': get_threat_level_from_size(asteroid_size)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_threat_level_from_size(size):
    """Determine threat level based on asteroid size"""
    if size >= 1000:
        return 'EXTINCTION_LEVEL'
    elif size >= 500:
        return 'CIVILIZATION_THREATENING'
    elif size >= 200:
        return 'REGIONAL_CATASTROPHE'
    elif size >= 100:
        return 'CITY_DESTROYER'
    elif size >= 50:
        return 'LOCAL_DAMAGE'
    else:
        return 'MINIMAL_THREAT'

# simple in-memory cache helper (TTL seconds)
_cache = {}
import time
def get_cached(key, ttl_seconds, fetch_fn):
    now = time.time()
    entry = _cache.get(key)
    if entry:
        ts, value = entry
        if now - ts < ttl_seconds:
            return value
    value = fetch_fn()
    _cache[key] = (now, value)
    return value

def compute_impact_metrics(diameter_m: float, velocity_km_s: float, density_kg_m3: float = 2500.0):
    """
    Returns mass (kg), energy (J), megatons, approx Mw (earthquake energy equivalent).
    Safe defaults used if inputs missing (returns None for invalid inputs).
    """
    try:
        if not diameter_m or diameter_m <= 0:
            return None
        r = diameter_m / 2.0
        volume_m3 = (4.0 / 3.0) * math.pi * (r ** 3)            # sphere volume
        mass_kg = volume_m3 * density_kg_m3                     # assume density
        v_m_s = max(0.0, float(velocity_km_s)) * 1000.0         # convert km/s -> m/s
        energy_j = 0.5 * mass_kg * (v_m_s ** 2)
        megatons = energy_j / 4.184e15                          # 1 Mt TNT = 4.184e15 J
        approx_mw = (math.log10(energy_j) - 4.8) / 1.5 if energy_j > 0 else None
        return {
            "mass_kg": mass_kg,
            "energy_j": energy_j,
            "megaton_tnt": megatons,
            "approx_Mw": approx_mw
        }
    except Exception as e:
        logger.error(f"compute_impact_metrics error: {e}")
        return None

def estimate_transient_crater_km_from_megatons(megatons: float):
    """
    Quick, simple empirical scaling to produce an approximate transient crater diameter (km).
    This is an approximate heuristic for visualization only. For authoritative modelling,
    use a detailed crater-scaling model (e.g., Melosh/Holsapple) or Earth Impact Effects.
    """
    try:
        if megatons is None or megatons <= 0:
            return None
        # simple empirical scaling: D_km ≈ 0.07 * (E_mt ^ 0.3)
        D_km = 0.07 * (megatons ** 0.3)
        return D_km
    except Exception as e:
        logger.error(f"estimate_transient_crater_km_from_megatons error: {e}")
        return None

@app.route("/api/physics/asteroid")
def asteroid_physics():
    """
    Query string:
      ?asteroid_id=<id_or_neo_reference_id_or_name>
    Response: JSON with `summary` (human text), `metrics` (numbers), and `raw` (raw asteroid data)
    """
    asteroid_id = request.args.get("asteroid_id") or request.args.get("designation")
    if not asteroid_id:
        return jsonify({"error": "Provide asteroid_id or designation query param"}), 400

    cache_key = f"physics_{asteroid_id}"
    # small cache to avoid rate-limits for repeated lookups
    data = get_cached(cache_key, 300, lambda: nasa_service.get_neo_lookup(asteroid_id))

    if not data or "error" in data:
        return jsonify({"error": "Failed to fetch asteroid data", "details": data}), 500

    # normalize diameter (meters)
    diam_m = None
    diam_info = data.get("estimated_diameter", {}).get("meters", {})
    if diam_info:
        min_d = diam_info.get("estimated_diameter_min")
        max_d = diam_info.get("estimated_diameter_max")
        if min_d is not None and max_d is not None:
            diam_m = (float(min_d) + float(max_d)) / 2.0

    # try to get a reasonable encounter velocity from close_approach_data
    velocity_km_s = None
    ca = None
    if data.get("close_approach_data"):
        ca = data["close_approach_data"][0]
        vstr = ca.get("relative_velocity", {}).get("kilometers_per_second")
        try:
            velocity_km_s = float(vstr)
        except Exception:
            velocity_km_s = None

    # if missing velocity, use a conservative default (typical impact velocities ~ 12-25 km/s).
    if velocity_km_s is None:
        velocity_km_s = 20.0

    # density default (rocky asteroid)
    density = 2500.0

    metrics = compute_impact_metrics(diam_m if diam_m else 100.0, velocity_km_s, density)

    crater_km = estimate_transient_crater_km_from_megatons(metrics["megaton_tnt"]) if metrics else None

    # human readable summary
    name = data.get("name") or asteroid_id
    hazardous = "potentially hazardous" if data.get("is_potentially_hazardous_asteroid") else "not hazardous"
    close_date = ca.get("close_approach_date") if ca else None
    miss_km = None
    if ca:
        try:
            miss_km = float(ca.get("miss_distance", {}).get("kilometers") or 0.0)
        except Exception:
            miss_km = None

    summary = (
        f"{name} (~{int(diam_m) if diam_m else 'unknown'} m) {('approaches on '+close_date) if close_date else 'has recent approach data'}. "
        f"Miss distance ≈ {int(miss_km):,} km. Status: {hazardous}. "
        f"Estimated impact energy (if it hit): {metrics['energy_j']:.3e} J (~{metrics['megaton_tnt']:.2f} Mt TNT). "
        f"Rough seismic-equivalent Mw ≈ {metrics['approx_Mw']:.2f}. "
        f"Estimated transient crater diameter (very approximate): {crater_km:.2f} km." if metrics else "Metrics not available."
    )

    response = {
        "asteroid_id": asteroid_id,
        "name": name,
        "is_hazardous": data.get("is_potentially_hazardous_asteroid", False),
        "diameter_m": diam_m,
        "velocity_km_s": velocity_km_s,
        "density_kg_m3": density,
        "metrics": metrics,
        "crater_km": crater_km,
        "close_approach": {
            "date": close_date,
            "miss_distance_km": miss_km,
            "raw": ca
        },
        "summary": summary,
        "raw": data
    }

    return jsonify(response)

if __name__ == '__main__':
    print("🚀 Enhanced NASA Impact Simulator Backend Starting...")
    print(f"🔑 NASA API Key: {'✅ Configured' if NASA_API_KEY else '❌ Missing'}")
    print(f"🤖 Gemini AI: {'✅ Configured' if model else '❌ Missing'}")
    print("🌐 CORS enabled for frontend communication")
    print("📡 Available endpoints:")
    print("   - GET  /api/health")
    print("   - GET  /api/neo/hazardous")
    print("   - GET  /api/neo/stats")
    print("   - GET  /api/physics/asteroid")
    print("   - POST /api/impact/simulate")
    print("   - GET  /api/impact/simulate-real")
    print("   - POST /api/ai/risk-analysis")
    print("   - POST /api/ai/mitigations")
    print("   - GET  /api/cities/data")
    print("   - POST /api/timeline/phases")
    print("   - POST /api/aftermath/layers")
    print("   - POST /api/survival/zones")
    print("   - POST /api/alerts/timeline")
    print("🎯 Enhanced backend ready for comprehensive impact analysis!")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
