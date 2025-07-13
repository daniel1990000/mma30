import React from 'react';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';

// Fighter component: Procedural low-poly MMA dummy model.
// Now forwarded ref to the group for external position updates.
const Fighter = React.forwardRef(({ position = [0, 0, 0], color = 'red' }, ref) => {
  const material = new MeshStandardMaterial({ color }); // Shared material with color.

  return (
    // Group: Wraps all parts, now with ref.
    <group ref={ref} position={position}>
      // Torso: Cylinder.
      <mesh position={[0, 1.2, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
      </mesh>

      // Head: Sphere on top of torso.
      <mesh position={[0, 2.1, 0]} material={material} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
      </mesh>

      // Left Arm: Cylinder, positioned from shoulder.
      <mesh position={[-0.4, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} material={material} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
      </mesh>

      // Right Arm: Mirror of left.
      <mesh position={[0.4, 1.8, 0]} rotation={[0, 0, -Math.PI / 2]} material={material} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
      </mesh>

      // Left Leg: Cylinder from hip.
      <mesh position={[-0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>

      // Right Leg: Mirror.
      <mesh position={[0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>

      // Joints: Small spheres for elbows, knees, etc.
      <mesh position={[-0.4 - 0.4, 1.8, 0]} material={material} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>
      <mesh position={[0.4 + 0.4, 1.8, 0]} material={material} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>
      <mesh position={[-0.2, -0.2, 0]} material={material} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
      </mesh>
      <mesh position={[0.2, -0.2, 0]} material={material} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
      </mesh>
    </group>
  );
});

export default Fighter;