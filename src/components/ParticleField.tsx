import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  radius?: number;
  color?: string;
  speed?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 2000,
  radius = 50,
  color = '#ffffff',
  speed = 0.001
}) => {
  const mesh = useRef<THREE.Points>(null);
  
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      // Random position in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.cbrt(Math.random());
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Random colors with slight variation
      const variation = 0.3;
      colors[i * 3] = colorObj.r + (Math.random() - 0.5) * variation;
      colors[i * 3 + 1] = colorObj.g + (Math.random() - 0.5) * variation;
      colors[i * 3 + 2] = colorObj.b + (Math.random() - 0.5) * variation;
      
      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return [positions, colors, sizes];
  }, [count, radius, color]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += speed;
      mesh.current.rotation.x += speed * 0.5;
      
      // Twinkling effect
      const time = state.clock.elapsedTime;
      const geometry = mesh.current.geometry;
      const sizesAttribute = geometry.attributes.size;
      
      for (let i = 0; i < count; i++) {
        const originalSize = sizes[i];
        sizesAttribute.array[i] = originalSize * (0.5 + 0.5 * Math.sin(time * 2 + i * 0.1));
      }
      sizesAttribute.needsUpdate = true;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
