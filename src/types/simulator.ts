export interface City {
  name: string;
  lat: number;
  lng: number;
  population: number;
}

export interface Asteroid {
  name: string;
  size: number;
  velocity: number;
}

export interface ImpactResults {
  energy: number;
  craterDiameter: number;
  thermalRadius: number;
  shockwaveRadius: number;
  mass: number;
}

export interface SimulationParams {
  city: City;
  asteroidSize: number;
  velocity: number;
  angle: number;
}