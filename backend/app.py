from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
from datetime import datetime, timedelta
import os
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# NASA API Configuration
NASA_API_KEY = "wZH9g1tdRAIGSN7lOGjybio3awZoStL5OmkJ7Wnt"
NASA_NEO_BASE_URL = "https://api.nasa.gov/neo/rest/v1"
NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"

class NASADataService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = requests.Session()
        
    def get_neo_feed(self, start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        """Get Near Earth Objects feed for a date range"""
        if not start_date:
            start_date = datetime.now().strftime('%Y-%m-%d')
        if not end_date:
            end_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
            
        url = f"{NASA_NEO_BASE_URL}/feed"
        params = {
            'start_date': start_date,
            'end_date': end_date,
            'api_key': self.api_key
        }
        
        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching NEO feed: {e}")
            return {"error": str(e)}
    
    def get_neo_lookup(self, asteroid_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific asteroid"""
        url = f"{NASA_NEO_BASE_URL}/neo/{asteroid_id}"
        params = {'api_key': self.api_key}
        
        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching NEO lookup: {e}")
            return {"error": str(e)}
    
    def get_neo_browse(self, page: int = 0, size: int = 20) -> Dict[str, Any]:
        """Browse all Near Earth Objects"""
        url = f"{NASA_NEO_BASE_URL}/neo/browse"
        params = {
            'page': page,
            'size': size,
            'api_key': self.api_key
        }
        
        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching NEO browse: {e}")
            return {"error": str(e)}
    
    def get_potentially_hazardous_asteroids(self) -> List[Dict[str, Any]]:
        """Get potentially hazardous asteroids from recent feed"""
        feed_data = self.get_neo_feed()
        hazardous_asteroids = []
        
        if 'near_earth_objects' in feed_data:
            for date, asteroids in feed_data['near_earth_objects'].items():
                for asteroid in asteroids:
                    if asteroid.get('is_potentially_hazardous_asteroid', False):
                        # Calculate risk score based on size and close approach
                        risk_score = self.calculate_risk_score(asteroid)
                        asteroid['risk_score'] = risk_score
                        asteroid['date'] = date
                        hazardous_asteroids.append(asteroid)
        
        # Sort by risk score (highest first)
        hazardous_asteroids.sort(key=lambda x: x.get('risk_score', 0), reverse=True)
        return hazardous_asteroids
    
    def calculate_risk_score(self, asteroid: Dict[str, Any]) -> float:
        """Calculate a risk score for an asteroid based on size and proximity"""
        try:
            # Get estimated diameter (average of min and max)
            diameter_data = asteroid.get('estimated_diameter', {}).get('kilometers', {})
            min_diameter = diameter_data.get('estimated_diameter_min', 0)
            max_diameter = diameter_data.get('estimated_diameter_max', 0)
            avg_diameter = (min_diameter + max_diameter) / 2
            
            # Get closest approach distance
            close_approaches = asteroid.get('close_approach_data', [])
            if close_approaches:
                closest_distance = float(close_approaches[0].get('miss_distance', {}).get('kilometers', float('inf')))
                
                # Calculate risk score (larger size and closer distance = higher risk)
                # Normalize values for scoring
                size_factor = min(avg_diameter * 1000, 10)  # Cap at 10 for very large asteroids
                distance_factor = max(0, 10 - (closest_distance / 1000000))  # Closer = higher score
                
                risk_score = (size_factor * 0.6) + (distance_factor * 0.4)
                return round(risk_score, 2)
            
            return 0.0
        except (ValueError, KeyError, TypeError):
            return 0.0

# Initialize NASA service
nasa_service = NASADataService(NASA_API_KEY)

@app.route('/api/neo/feed')
def get_neo_feed():
    """Get Near Earth Objects feed"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    data = nasa_service.get_neo_feed(start_date, end_date)
    return jsonify(data)

@app.route('/api/neo/hazardous')
def get_hazardous_asteroids():
    """Get potentially hazardous asteroids with risk scores"""
    asteroids = nasa_service.get_potentially_hazardous_asteroids()
    return jsonify({
        'count': len(asteroids),
        'asteroids': asteroids
    })

@app.route('/api/neo/lookup/<asteroid_id>')
def get_neo_details(asteroid_id):
    """Get detailed information about a specific asteroid"""
    data = nasa_service.get_neo_lookup(asteroid_id)
    return jsonify(data)

@app.route('/api/neo/browse')
def browse_asteroids():
    """Browse all Near Earth Objects"""
    page = request.args.get('page', 0, type=int)
    size = request.args.get('size', 20, type=int)
    
    data = nasa_service.get_neo_browse(page, size)
    return jsonify(data)

@app.route('/api/neo/stats')
def get_neo_stats():
    """Get NEO statistics and summary"""
    try:
        # Get recent feed data
        feed_data = nasa_service.get_neo_feed()
        
        if 'near_earth_objects' in feed_data:
            total_asteroids = 0
            hazardous_count = 0
            size_categories = {'small': 0, 'medium': 0, 'large': 0, 'massive': 0}
            
            for date, asteroids in feed_data['near_earth_objects'].items():
                total_asteroids += len(asteroids)
                
                for asteroid in asteroids:
                    if asteroid.get('is_potentially_hazardous_asteroid', False):
                        hazardous_count += 1
                    
                    # Categorize by size
                    diameter_data = asteroid.get('estimated_diameter', {}).get('meters', {})
                    max_diameter = diameter_data.get('estimated_diameter_max', 0)
                    
                    if max_diameter < 50:
                        size_categories['small'] += 1
                    elif max_diameter < 200:
                        size_categories['medium'] += 1
                    elif max_diameter < 1000:
                        size_categories['large'] += 1
                    else:
                        size_categories['massive'] += 1
            
            return jsonify({
                'total_asteroids': total_asteroids,
                'hazardous_asteroids': hazardous_count,
                'size_distribution': size_categories,
                'date_range': {
                    'start': min(feed_data['near_earth_objects'].keys()) if feed_data['near_earth_objects'] else None,
                    'end': max(feed_data['near_earth_objects'].keys()) if feed_data['near_earth_objects'] else None
                }
            })
        
        return jsonify({'error': 'No data available'})
        
    except Exception as e:
        logger.error(f"Error getting NEO stats: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/impact/simulate')
def simulate_impact():
    """Simulate impact for a real asteroid"""
    asteroid_id = request.args.get('asteroid_id')
    target_lat = request.args.get('lat', type=float)
    target_lng = request.args.get('lng', type=float)
    
    if not asteroid_id or target_lat is None or target_lng is None:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    # Get asteroid details
    asteroid_data = nasa_service.get_neo_lookup(asteroid_id)
    
    if 'error' in asteroid_data:
        return jsonify(asteroid_data), 500
    
    # Calculate impact parameters based on real asteroid data
    diameter_data = asteroid_data.get('estimated_diameter', {}).get('meters', {})
    avg_diameter = (diameter_data.get('estimated_diameter_min', 100) + 
                   diameter_data.get('estimated_diameter_max', 100)) / 2
    
    # Estimate velocity (typical asteroid velocity is 15-25 km/s)
    velocity = 20  # km/s default
    
    # Calculate impact effects using the same physics as the main app
    density = 3000  # kg/m^3
    radius_meters = avg_diameter / 2
    mass = (4 / 3) * 3.14159 * (radius_meters ** 3) * density
    v_m_s = velocity * 1000
    energy_j = 0.5 * mass * (v_m_s ** 2)
    energy_mt = energy_j / 4.184e15
    
    # Calculate damage zones
    angle_factor = 0.7071  # sin(45°)
    crater_km = (avg_diameter * velocity * angle_factor) / 1000
    thermal_km = crater_km * 4
    shock_km = crater_km * 8
    
    return jsonify({
        'asteroid': {
            'id': asteroid_id,
            'name': asteroid_data.get('name', 'Unknown'),
            'diameter_meters': avg_diameter,
            'is_hazardous': asteroid_data.get('is_potentially_hazardous_asteroid', False)
        },
        'impact': {
            'location': {'lat': target_lat, 'lng': target_lng},
            'energy_mt': max(1, round(energy_mt)),
            'crater_km': max(0.1, round(crater_km, 2)),
            'thermal_km': round(thermal_km, 2),
            'shock_km': round(shock_km, 2),
            'velocity_kms': velocity
        }
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'nasa_api_status': 'connected'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
