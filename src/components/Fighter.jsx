import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

const Fighter = React.forwardRef(({ position = [0, 0, 0], color = 'red', keys = {} }, ref) => {
  const material = new MeshStandardMaterial({ color });

  // Refs for animation
  const rightShoulderRef = useRef();
  const rightElbowRef = useRef();
  const [animation, setAnimation] = useState('idle');

  // Animation triggers
  useEffect(() => {
    // Start punch if 'j' is pressed and we are idle
    if (keys['j'] && animation === 'idle') {
      setAnimation('punch');
    }
  }, [keys]);

  // The main animation loop, running on every frame
  useFrame((state, delta) => {
    if (animation === 'punch') {
      // Punch Animation: Rotate shoulder and elbow
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -Math.PI / 2, 0.1);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, -Math.PI / 2, 0.1);

      // After a short delay, end the animation
      if (rightShoulderRef.current.rotation.x < -1.5) {
        setAnimation('punch_return');
      }
    } else if (animation === 'punch_return') {
      // Return to Idle: Lerp rotation back to 0
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, 0.1);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, 0.1);

      // Once returned, set to idle
      if (rightShoulderRef.current.rotation.x > -0.1) {
        setAnimation('idle');
      }
    } else {
      // Idle state: ensure arms are back in place
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, 0.1);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Torso & Head */}
      <mesh position={[0, 1.2, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
      </mesh>
      <mesh position={[0, 2.1, 0]} material={material} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
      </mesh>

      {/* --- Right Arm (Articulated) --- */}
      <group ref={rightShoulderRef} position={[0.4, 1.8, 0]}>
        {/* Upper Arm */}
        <mesh castShadow material={material}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <group ref={rightElbowRef} position={[0, -0.4, 0]}>
            {/* Forearm */}
            <mesh position={[0, -0.4, 0]} castShadow material={material}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            </mesh>
          </group>
        </mesh>
      </group>
      
      {/* --- Left Arm (Articulated) --- */}
      <group position={[-0.4, 1.8, 0]}>
         {/* Upper Arm */}
        <mesh castShadow material={material}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <group position={[0, -0.4, 0]}>
            {/* Forearm */}
            <mesh position={[0, -0.4, 0]} castShadow material={material}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            </mesh>
          </group>
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>
      <mesh position={[0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>
    </group>
  );
});

export default Fighter;