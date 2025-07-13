import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

const Fighter = React.forwardRef(({ position, rotation, color = 'red', keys = {} }, ref) => {
  const material = new MeshStandardMaterial({ color });

  // Refs for animation
  const animationGroupRef = useRef(); // A ref for the inner group that we'll animate
  const rightShoulderRef = useRef();
  const rightElbowRef = useRef();
  
  const [animation, setAnimation] = useState('idle');

  // Animation triggers
  useEffect(() => {
    if (animation === 'idle') {
      if (keys['j']) {
        setAnimation('punch');
      } else if (keys['l']) {
        setAnimation('takedown');
      }
    }
  }, [keys, animation]);

  // The main animation loop
  useFrame(() => {
    const lerpAmount = 0.1;
    // Animate based on the current animation state
    if (animation === 'punch') {
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -Math.PI / 2, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, -Math.PI / 2, lerpAmount);
      if (rightShoulderRef.current.rotation.x < -1.5) setAnimation('punch_return');
    } else if (animation === 'punch_return') {
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, lerpAmount);
      if (rightShoulderRef.current.rotation.x > -0.1) setAnimation('idle');
    } else if (animation === 'takedown') {
      // Lean the whole body forward
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0.8, lerpAmount);
      if (animationGroupRef.current.rotation.x > 0.7) setAnimation('takedown_return');
    } else if (animation === 'takedown_return') {
      // Return the body to idle
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0, lerpAmount);
      if (animationGroupRef.current.rotation.x < 0.1) setAnimation('idle');
    } else {
      // Idle state: ensure everything is back in place
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, lerpAmount);
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0, lerpAmount);
    }
  });

  return (
    // Outer group for positioning and base rotation. This is controlled by App.jsx
    <group ref={ref} position={position} rotation={rotation}>
      {/* Inner group for animations. This lets us animate the model without affecting its base position/rotation */}
      <group ref={animationGroupRef}>
        {/* Torso & Head */}
        <mesh position={[0, 1.2, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        </mesh>
        <mesh position={[0, 2.1, 0]} material={material} castShadow>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>

        {/* Right Arm */}
        <group ref={rightShoulderRef} position={[0.4, 1.8, 0]}>
          <mesh castShadow material={material}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <group ref={rightElbowRef} position={[0, -0.4, 0]}>
              <mesh position={[0, -0.4, 0]} castShadow material={material}>
                <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
              </mesh>
            </group>
          </mesh>
        </group>
        
        {/* Left Arm */}
        <group position={[-0.4, 1.8, 0]}>
          <mesh castShadow material={material}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <group position={[0, -0.4, 0]}>
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
    </group>
  );
});

export default Fighter;