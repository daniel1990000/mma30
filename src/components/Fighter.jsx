import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

const Fighter = ({ 
  position, 
  rotation, 
  color = 'red', 
  animation,
  onAnimationComplete,
  movementApi // We'll receive the physics API for movement
}) => {
  const material = new MeshStandardMaterial({ color });

  // Create a physical box for the fighter.
  // This box will collide with other physics objects.
  const [ref, api] = useBox(() => ({
    mass: 1, // Make it a dynamic object
    position,
    args: [0.8, 2.5, 0.8] // Dimensions of the collision box
  }));

  // Pass the physics api up to the parent if needed
  useEffect(() => {
    if (movementApi) {
      movementApi.current = api;
    }
  }, [api, movementApi]);

  const animationGroupRef = useRef();
  const rightShoulderRef = useRef();
  const rightElbowRef = useRef();
  
  const returnAnimation = useRef(false);

  useEffect(() => {
    returnAnimation.current = false;
  }, [animation]);

  useFrame(() => {
    if (!animationGroupRef.current) return;
    const lerpAmount = 0.1;

    // Handle idle state
    if (animation === 'idle') {
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0, lerpAmount);
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, lerpAmount);
      return;
    }

    // Handle return phase of animations
    if (returnAnimation.current) {
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0, lerpAmount);
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, lerpAmount);
      if (Math.abs(animationGroupRef.current.rotation.x) < 0.1 && Math.abs(rightShoulderRef.current.rotation.x) < 0.1) {
        if (onAnimationComplete) onAnimationComplete();
      }
      return;
    }
    
    // Handle main animation phase
    if (animation === 'punch') {
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -Math.PI / 2, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, -Math.PI / 2, lerpAmount);
      if (rightShoulderRef.current.rotation.x < -1.5) returnAnimation.current = true;
    } else if (animation === 'takedown') {
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0.8, lerpAmount);
      if (animationGroupRef.current.rotation.x > 0.7) returnAnimation.current = true;
    }
  });

  return (
    // This group is now controlled by the physics engine
    <group ref={ref} rotation={rotation}>
      {/* Visual model is a child of the physics body */}
      <group ref={animationGroupRef}>
        {/* The rest of your fighter model is unchanged */}
        <mesh position={[0, 0, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        </mesh>
        <mesh position={[0, 0.9, 0]} material={material} castShadow>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
        <group ref={rightShoulderRef} position={[0.4, 0.6, 0]}>
          <mesh castShadow material={material}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <group ref={rightElbowRef} position={[0, -0.4, 0]}>
              <mesh position={[0, -0.4, 0]} castShadow material={material}>
                <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
              </mesh>
            </group>
          </mesh>
        </group>
        <group position={[-0.4, 0.6, 0]}>
          <mesh castShadow material={material}>
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <group position={[0, -0.4, 0]}>
              <mesh position={[0, -0.4, 0]} castShadow material={material}>
                <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
              </mesh>
            </group>
          </mesh>
        </group>
        <mesh position={[-0.2, -0.9, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        </mesh>
        <mesh position={[0.2, -0.9, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
        </mesh>
      </group>
    </group>
  );
};

export default Fighter;