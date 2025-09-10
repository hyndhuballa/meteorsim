import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface ImpactResult {
  energyMt: number;
  craterKm: number;
  thermalKm: number;
  shockKm: number;
  city?: City | null;
}

interface GlobeVisualizationProps {
  cities: City[];
  selectedCity: City | null;
  lastResult: ImpactResult | null;
  isSimulating: boolean;
  asteroidSize?: number;
  velocity?: number;
  showPopulationHeatmap?: boolean;
}

/**
 * Custom hook to measure a component's dimensions using ResizeObserver.
 * This is a modern replacement for the outdated `react-use-dimensions` package.
 */
const useComponentDimensions = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return [ref, dimensions] as const;
};

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  cities,
  selectedCity,
  lastResult,
  isSimulating,
  asteroidSize = 100,
  velocity = 20,
  showPopulationHeatmap = false,
}) => {
  const [containerRef, { width, height }] = useComponentDimensions();
  const globeEl = useRef<GlobeMethods | undefined>();
  const [rings, setRings] = useState<any[]>([]);
  const [marker, setMarker] = useState<any[]>([]);
  const [blast, setBlast] = useState<any[]>([]);
  const [trail, setTrail] = useState<any[]>([]);
  const [asteroid, setAsteroid] = useState<any>(null);
  const [asteroidModel, setAsteroidModel] = useState<THREE.Object3D | null>(null);
  const [populationData, setPopulationData] = useState<any[]>([]);

  // Create a custom asteroid model
  useEffect(() => {
    // Create a custom asteroid geometry instead of loading external model
    const createAsteroidModel = () => {
      const geometry = new THREE.IcosahedronGeometry(1, 2); // Rough, asteroid-like shape

      // Deform the geometry to make it more asteroid-like
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        vertex.multiplyScalar(0.8 + Math.random() * 0.4); // Random deformation
        positions[i] = vertex.x;
        positions[i + 1] = vertex.y;
        positions[i + 2] = vertex.z;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Create glowing material
      const material = new THREE.MeshLambertMaterial({
        color: 0xffa500,
        emissive: 0xff3300,
        emissiveIntensity: 0.5,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Add a glowing aura
      const auraGeometry = new THREE.SphereGeometry(1.2, 16, 16);
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide,
      });
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);

      const asteroidGroup = new THREE.Group();
      asteroidGroup.add(mesh);
      asteroidGroup.add(aura);

      return asteroidGroup;
    };

    setAsteroidModel(createAsteroidModel());
  }, []);

  // Load population data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/world_population.json')
      .then(res => res.json())
      .then(data => setPopulationData(data.data));
  }, []);

  useEffect(() => {
    const globe = globeEl.current;
    if (!globe) return;

    // Halt rotation and zoom to selected city
    if (selectedCity) {
      globe.controls().autoRotate = false;
      globe.pointOfView({ lat: selectedCity.lat, lng: selectedCity.lng, altitude: 1.5 }, 1000);
      setMarker([selectedCity]);
    } else {
      // Resume rotation if no city is selected
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.2;
      setMarker([]);
    }
  }, [selectedCity]);

  useEffect(() => {
    // This effect handles the two stages of the simulation animation
    if (isSimulating && !lastResult) {
      // STAGE 1: Simulation has started, launch the asteroid arc
      if (!selectedCity) return;
      
      // Clear previous animations & hide old arc
      setRings([]);
      setBlast([]);
      setTrail([]);

      // Create a realistic starting point for the asteroid from "space"
      // Calculate approach angle based on asteroid velocity and physics
      const approachAngle = Math.random() * 360; // Random approach direction
      const approachDistance = 3.5; // Start further out for more dramatic effect

      // Calculate starting position based on approach angle
      const startLat = selectedCity.lat + (approachDistance * Math.cos((approachAngle * Math.PI) / 180));
      const startLng = selectedCity.lng + (approachDistance * Math.sin((approachAngle * Math.PI) / 180));

      setAsteroid({
        lat: startLat,
        prevLat: startLat,
        lng: startLng,
        prevLng: startLng,
        alt: 4.0, // Start higher for more dramatic entry
        target: selectedCity,
        startTime: Date.now(),
        duration: 2000, // Longer duration for better visibility
        size: Math.max(0.01, Math.min(0.05, asteroidSize / 20000)), // Scale based on asteroid size
        velocity: velocity,
        approachAngle: approachAngle
      });

    } else if (!isSimulating && lastResult?.city) {
      // STAGE 2: Simulation is complete, show the impact explosion
      setAsteroid(null); // Asteroid has impacted, remove it

      const { city, craterKm, thermalKm, shockKm } = lastResult;
      if (!city) return;
      // Zoom to impact site
      globeEl.current?.pointOfView({ lat: city.lat, lng: city.lng, altitude: 0.5 }, 1500);

      // Create enhanced risk zones with proper labeling
      const fireballKm = craterKm * 0.33; // Fireball is smaller than crater
      const airblastKm = shockKm * 1.5; // Airblast extends beyond shockwave

      const newRingsData = [
        {
          lat: city.lat,
          lng: city.lng,
          maxR: fireballKm,
          color: 'rgba(255, 0, 0, 0.8)',
          label: 'Fireball Zone',
          severity: 'Total Destruction',
          description: 'Complete vaporization'
        },
        {
          lat: city.lat,
          lng: city.lng,
          maxR: thermalKm,
          color: 'rgba(255, 100, 0, 0.6)',
          label: 'Thermal Zone',
          severity: 'Severe Damage',
          description: 'Third-degree burns, fires'
        },
        {
          lat: city.lat,
          lng: city.lng,
          maxR: shockKm,
          color: 'rgba(255, 200, 0, 0.4)',
          label: 'Shockwave Zone',
          severity: 'Heavy Damage',
          description: 'Building collapse, debris'
        },
        {
          lat: city.lat,
          lng: city.lng,
          maxR: airblastKm,
          color: 'rgba(255, 255, 100, 0.3)',
          label: 'Airblast Zone',
          severity: 'Light Damage',
          description: 'Broken windows, minor injuries'
        }
      ];

      // Add a blast animation
      const blastData = [{
        lat: city.lat,
        lng: city.lng,
        altitude: 0.01,
        color: 'yellow'
      }];
      setBlast(blastData);
      setRings(newRingsData);

      // Clear animations after a delay
      setTimeout(() => { setRings([]); setBlast([]); }, 5000);
    }
  }, [isSimulating, lastResult]);

  // Combine cities, blast animations, and zone labels into a single array for the htmlElementsData prop
  const htmlElements = useMemo(() => {
    const cityElements = cities.map(city => ({ ...city, type: 'city' }));
    const blastElements = blast.map(b => ({ ...b, type: 'blast' }));

    // Add zone labels when rings are active
    const zoneLabels: any[] = [];
    if (rings.length > 0 && lastResult?.city) {
      rings.forEach((ring, index) => {
        // Position labels at the edge of each ring
        const labelDistance = ring.maxR * 0.8; // Position labels slightly inside the ring
        const angleOffset = index * 90; // Spread labels around the circle

        const labelLat = lastResult.city!.lat + (labelDistance / 111) * Math.cos((angleOffset * Math.PI) / 180);
        const labelLng = lastResult.city!.lng + (labelDistance / (111 * Math.cos((lastResult.city!.lat * Math.PI) / 180))) * Math.sin((angleOffset * Math.PI) / 180);

        zoneLabels.push({
          lat: labelLat,
          lng: labelLng,
          type: 'zone-label',
          label: ring.label,
          severity: ring.severity,
          description: ring.description,
          color: ring.color,
          radius: ring.maxR
        });
      });
    }

    return [...cityElements, ...blastElements, ...zoneLabels];
  }, [cities, blast, rings, lastResult]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Globe
      width={width}
      height={height}
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      customLayerData={asteroidModel && asteroid ? [asteroid] : []}
      customThreeObject={() => {
        // This is a clone of the model, so we can rotate it
        if (asteroidModel) {
          asteroidModel.rotation.y += 0.05; // Give it a spin
          return asteroidModel.clone();
        }
        return new THREE.Object3D();
      }}
      customThreeObjectUpdate={(obj, d: any) => {
        const { lat, lng, alt, target, startTime, duration, prevLat, prevLng, size, velocity } = d;
        const globe = globeEl.current;
        if (!globe) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Enhanced physics-based trajectory
        // Simulate gravitational acceleration as asteroid approaches
        const gravityFactor = 1 - (alt / 4.0); // Stronger gravity closer to surface
        const acceleratedProgress = progress + (gravityFactor * progress * progress * 0.3);
        const finalProgress = Math.min(acceleratedProgress, 1);

        // Interpolate position with realistic trajectory curve
        const newLat = lat + (target.lat - lat) * finalProgress;
        const newLng = lng + (target.lng - lng) * finalProgress;

        // More realistic altitude curve - steep descent in final approach
        let newAlt;
        if (finalProgress < 0.7) {
          newAlt = alt * (1 - finalProgress * 0.3); // Gradual descent initially
        } else {
          // Steep final descent
          const finalDescentProgress = (finalProgress - 0.7) / 0.3;
          newAlt = alt * 0.79 * (1 - finalDescentProgress * finalDescentProgress);
        }
        newAlt = Math.max(0.01, newAlt);

        // Scale asteroid based on size, velocity, and atmospheric heating effect
        const atmosphereEntry = Math.max(0, 1 - (newAlt / 0.5)); // Start glowing when entering atmosphere
        const baseScale = size / 1000; // Base scale from asteroid size
        const velocityScale = 1 + (velocity / 50); // Velocity affects apparent size
        const scale = baseScale * velocityScale * (1 + atmosphereEntry * 2); // Combined scaling
        obj.scale.setScalar(scale);

        Object.assign(obj.position, globe.getCoords(newLat, newLng, newAlt));

        // Enhanced trail with atmospheric heating effects
        if (finalProgress > 0.1) { // Start trail after initial approach
          const trailIntensity = Math.min(1, atmosphereEntry * 2);
          const newTrailSegment = {
            startLat: prevLat,
            startLng: prevLng,
            endLat: newLat,
            endLng: newLng,
            intensity: trailIntensity,
            altitude: newAlt
          };
          setTrail(currentTrail => [...currentTrail.slice(-15), newTrailSegment]); // Shorter, more intense trail
        }

        d.prevLat = newLat;
        d.prevLng = newLng;
      }}
      
      // Selected City Marker
      pointsData={marker}
      pointColor={() => 'rgba(255, 255, 0, 0.75)'}
      pointAltitude={0.01}
      pointRadius={0.5}

      // Impact Rings
      ringsData={rings}
      ringColor={(d: any) => d.color}
      ringMaxRadius="maxR"
      ringPropagationSpeed={(d: any) => d.maxR / 5}
      ringRepeatPeriod={1000}

      // Enhanced Fiery Asteroid Trail with atmospheric heating
      arcsData={trail}
      arcColor={(d: any) => {
        const intensity = d.intensity || 0.5;
        const red = Math.min(255, 200 + intensity * 55);
        const green = Math.min(255, 100 + intensity * 100);
        const blue = Math.max(0, 50 - intensity * 50);
        return `rgba(${red}, ${green}, ${blue}, ${0.4 + intensity * 0.4})`;
      }}
      arcDashLength={0.95}
      arcDashGap={0.05}
      arcStroke={(d: any) => 0.5 + (d.intensity || 0.5) * 1.5}
      arcAltitude={(d: any) => (d.altitude || 0.1) * 0.5}

      // Population Density Heatmap
      heatmapsData={showPopulationHeatmap ? populationData : []}

      // Combined HTML Elements for City Labels and Blast Animation
      htmlElementsData={htmlElements}
      htmlLat={(d: any) => d.lat}
      htmlLng={(d: any) => d.lng}
      htmlElement={(d: any) => {
        const el = document.createElement('div');
        if (d.type === 'city') {
          el.innerHTML = `<div class="city-label">${d.name}</div>`;
          // Add a dot on the city location
          const dot = document.createElement('div');
          dot.style.cssText = 'position: absolute; width: 6px; height: 6px; background-color: rgba(0, 255, 255, 0.7); border-radius: 50%; transform: translate(-50%, -50%);';
          el.appendChild(dot);
        } else if (d.type === 'blast') {
          el.innerHTML = `<div class="animate-expand-ring" style="border: 3px solid ${d.color}; border-radius: 50%; position: absolute; width: 200px; height: 200px; top: 50%; left: 50%;"></div>`;
        } else if (d.type === 'zone-label') {
          el.innerHTML = `
            <div style="
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 8px 12px;
              border-radius: 8px;
              border: 2px solid ${d.color.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')')};
              font-size: 12px;
              font-weight: bold;
              text-align: center;
              backdrop-filter: blur(4px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
              transform: translate(-50%, -50%);
              white-space: nowrap;
              pointer-events: none;
            ">
              <div style="color: ${d.color.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')')}; font-size: 14px; margin-bottom: 2px;">
                ${d.label}
              </div>
              <div style="color: #ffff00; font-size: 10px; margin-bottom: 2px;">
                ${d.severity}
              </div>
              <div style="color: #cccccc; font-size: 9px;">
                ${d.radius.toFixed(1)} km radius
              </div>
            </div>
          `;
        }
        return el;
      }}
    />
    </div>
  );
};

export default GlobeVisualization;