import React from 'react';
import { MeshStandardMaterial, PlaneGeometry } from 'three';

// Arena component: A simple flat floor plane.
export default function Arena() {
  return (
    // Mesh: Basic Three.js object. Geometry is a plane (flat surface), material for color/texture.
    // Rotation: Lay it flat on the xz-plane (floor).
    // Position: At y=0.
    // ReceiveShadow: Allows shadows if we add them later.
    <mesh rotation={[-Math.PI / 2]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} /> // Size: 20x20 units.
      <meshStandardMaterial color="gray" /> // Gray color for arena floor.
    </mesh>
  );
}