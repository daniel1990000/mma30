import React from 'react';
import { usePlane } from '@react-three/cannon';

export default function Arena() {
  // Create a static physics plane.
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Lay it flat
    position: [0, -0.2, 0] // Position it just below the fighters
  }));

  return (
    // The visual mesh is attached to the physics plane ref.
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}