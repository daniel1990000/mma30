import React from 'react';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';

// Fighter component: Procedural low-poly MMA dummy model.
// Uses cylinders for limbs/torso, spheres for head and joints.
// Humanoid proportions: Torso tall, limbs attached.
// All positions are relative to the fighter's base position.
export default function Fighter({ position = [0, 0, 0], color = 'red' }) {
  const material = new MeshStandardMaterial({ color }); // Shared material with color (red for player).

  return (
    // Group: Wraps all parts to position the whole fighter at once.
    <group position={position}>
      // Torso: Cylinder.
      <mesh position={[0, 1.2, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} /> // Radius top/bottom 0.3, height 1.5, low-poly (8 sides).
      </mesh>

      // Head: Sphere on top of torso.
      <mesh position={[0, 2.1, 0]} material={material} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} /> // Radius 0.35, low-poly.
      </mesh>

      // Left Arm: Cylinder, positioned from shoulder.
      <mesh position={[-0.4, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} material={material} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} /> // Shorter for arm.
      </mesh>

      // Right Arm: Mirror of left.
      <mesh position={[0.4, 1.8, 0]} rotation={[0, 0, -Math.PI / 2]} material={material} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
      </mesh>

      // Left Leg: Cylinder from hip.
      <mesh position={[-0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} /> // Height 1 for leg.
      </mesh>

      // Right Leg: Mirror.
      <mesh position={[0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>

      // Joints: Small spheres for elbows, knees, etc. (simple).
      <mesh position={[-0.4 - 0.4, 1.8, 0]} material={material} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} /> // Elbow.
      </mesh>
      <mesh position={[0.4 + 0.4, 1.8, 0]} material={material} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>
      <mesh position={[-0.2, -0.2, 0]} material={material} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} /> // Knee.
      </mesh>
      <mesh position={[0.2, -0.2, 0]} material={material} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
      </mesh>
    </group>
  );
}