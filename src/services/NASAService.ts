// NASA API Service for real-time Near Earth Objects data
const API_BASE_URL = 'http://localhost:5000/api';

export interface NEOData {
  id: string;
  name: string;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    miss_distance: {
      kilometers: string;
    };
    relative_velocity: {
      kilometers_per_second: string;
    };
  }>;
  risk_score?: number;
  date?: string;
}

export interface NEOStats {
  total_asteroids: number;
  hazardous_asteroids: number;
  size_distribution: {
    small: number;
    medium: number;
    large: number;
    massive: number;
  };
  date_range: {
    start: string;
    end: string;
  };
}

export interface ImpactSimulation {
  asteroid: {
    id: string;
    name: string;
    diameter_meters: number;
    is_hazardous: boolean;
  };
  impact: {
    location: { lat: number; lng: number };
    energy_mt: number;
    crater_km: number;
    thermal_km: number;
    shock_km: number;
    velocity_kms: number;
  };
}

class NASAService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  async getNEOFeed(startDate?: string, endDate?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await fetch(`${this.baseUrl}/neo/feed?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NEO feed:', error);
      throw error;
    }
  }

  async getHazardousAsteroids(): Promise<{ count: number; asteroids: NEOData[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/neo/hazardous`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching hazardous asteroids:', error);
      throw error;
    }
  }

  async getNEODetails(asteroidId: string): Promise<NEOData> {
    try {
      const response = await fetch(`${this.baseUrl}/neo/lookup/${asteroidId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NEO details:', error);
      throw error;
    }
  }

  async getNEOStats(): Promise<NEOStats> {
    try {
      const response = await fetch(`${this.baseUrl}/neo/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NEO stats:', error);
      throw error;
    }
  }

  async simulateRealAsteroidImpact(
    asteroidId: string,
    lat: number,
    lng: number,
    diameter?: number,
    velocity?: number,
  ): Promise<ImpactSimulation> {
    try {
      const params = new URLSearchParams({
        asteroid_id: asteroidId,
        lat: lat.toString(),
        lng: lng.toString(),
      });
      if (diameter) params.append('diameter', String(diameter));
      if (velocity) params.append('velocity', String(velocity));

      const response = await fetch(`${this.baseUrl}/impact/simulate-real?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error simulating real asteroid impact:', error);
      throw error;
    }
  }

  async aiRiskAnalysis(city_id: string, asteroid_size: number) {
    const response = await fetch(`${this.baseUrl}/ai/risk-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city_id, asteroid_size })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async aiMitigations(city_id: string, asteroid_size: number, velocity: number) {
    const response = await fetch(`${this.baseUrl}/ai/mitigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city_id, asteroid_size, velocity })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async browseAsteroids(page: number = 0, size: number = 20): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await fetch(`${this.baseUrl}/neo/browse?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error browsing asteroids:', error);
      throw error;
    }
  }

  // Utility methods
  formatAsteroidSize(diameter: number): string {
    if (diameter < 50) return 'Small';
    if (diameter < 200) return 'Medium';
    if (diameter < 1000) return 'Large';
    return 'Massive';
  }

  formatDistance(kilometers: string): string {
    const km = parseFloat(kilometers);
    if (km < 1000000) {
      return `${Math.round(km).toLocaleString()} km`;
    } else {
      const au = km / 149597870.7; // Convert to Astronomical Units
      return `${au.toFixed(3)} AU`;
    }
  }

  formatVelocity(kms: string): string {
    const velocity = parseFloat(kms);
    return `${velocity.toFixed(2)} km/s`;
  }

  getRiskLevel(riskScore: number): { level: string; color: string } {
    if (riskScore >= 8) return { level: 'Extreme', color: '#DC2626' };
    if (riskScore >= 6) return { level: 'High', color: '#EA580C' };
    if (riskScore >= 4) return { level: 'Moderate', color: '#D97706' };
    if (riskScore >= 2) return { level: 'Low', color: '#65A30D' };
    return { level: 'Minimal', color: '#16A34A' };
  }

  calculateTimeToImpact(closeApproachDate: string): string {
    const approachDate = new Date(closeApproachDate);
    const now = new Date();
    const diffMs = approachDate.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Past approach';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} days, ${diffHours} hours`;
    } else {
      return `${diffHours} hours`;
    }
  }
}

export const nasaService = new NASAService();
export default NASAService;
