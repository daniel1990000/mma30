import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';
import * as THREE from 'three';

const Fighter = React.forwardRef(({ 
  position, 
  rotation, 
  color = 'red', 
  animation,
  onAnimationComplete
}, ref) => {
  const material = new MeshStandardMaterial({ color });

  const animationGroupRef = useRef();
  const rightShoulderRef = useRef();
  const rightElbowRef = useRef();
  
  // Internal state to track the animation's return phase
  const [returnAnimation, setReturnAnimation] = useState(false);

  // This effect resets the return state when a new animation begins
  useEffect(() => {
    setReturnAnimation(false);
  }, [animation]);

  useFrame(() => {
    if (!animationGroupRef.current) return;
    const lerpAmount = 0.1;

    if (animation === 'idle') {
      // Smoothly return all parts to their default position
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0, lerpAmount);
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, lerpAmount);
      return;
    }

    if (returnAnimation) {
      // If in the return phase, go back to idle position
      const isReturning = 
        animationGroupRef.current.rotation.x > 0.1 ||
        rightShoulderRef.current.rotation.x < -0.1;

      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0, lerpAmount);
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, 0, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, 0, lerpAmount);

      if (!isReturning && onAnimationComplete) {
        onAnimationComplete();
      }
      return;
    }

    // Perform the main animation
    if (animation === 'punch') {
      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -Math.PI / 2, lerpAmount);
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(rightElbowRef.current.rotation.x, -Math.PI / 2, lerpAmount);
      if (rightShoulderRef.current.rotation.x < -1.5) setReturnAnimation(true);
    } else if (animation === 'takedown') {
      animationGroupRef.current.rotation.x = THREE.MathUtils.lerp(animationGroupRef.current.rotation.x, 0.8, lerpAmount);
      if (animationGroupRef.current.rotation.x > 0.7) setReturnAnimation(true);
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <group ref={animationGroupRef}>
        <mesh position={[0, 1.2, 0]} material={material} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        </mesh>
        <mesh position={[0, 2.1, 0]} material={material} castShadow>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
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
        <group position={[-0.4, 1.8, 0]}>
          <mesh castShadow material={material}>
            <cylinderGeometry args={[0.15, 0.15,