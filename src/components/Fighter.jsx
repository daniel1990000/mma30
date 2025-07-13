import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';

const Fighter = React.forwardRef(({ position = [0, 0, 0], color = 'red', keys = {} }, ref) => {
  const material = new MeshStandardMaterial({ color });

  // Create refs for the parts we want to animate
  const rightArmRef = useRef();

  // State to manage the punch animation
  const [isPunching, setIsPunching] = useState(false);
  const punchProgress = useRef(0);

  // This effect listens for the 'j' key press from the props
  useEffect(() => {
    // Start the punch animation if 'j' is pressed and we aren't already punching
    if (keys['j'] && !isPunching) {
      setIsPunching(true);
      punchProgress.current = 0; // Reset the animation progress
    }
  }, [keys, isPunching]);

  // useFrame runs on every frame, driving our animation
  useFrame((state, delta) => {
    if (isPunching) {
      // Adjust the speed of the punch animation
      punchProgress.current += delta * 5;

      if (punchProgress.current <= 1) {
        // The first half of the animation: arm moves forward
        rightArmRef.current.rotation.x = -punchProgress.current * Math.PI / 2;
      } else if (punchProgress.current <= 2) {
        // The second half: arm returns to the start
        rightArmRef.current.rotation.x = -(2 - punchProgress.current) * Math.PI / 2;
      } else {
        // Animation finished: reset state and arm rotation
        rightArmRef.current.rotation.x = 0;
        setIsPunching(false);
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Torso */}
      <mesh position={[0, 1.2, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.1, 0]} material={material} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.4, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} material={material} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
      </mesh>

      {/* Right Arm - We attach the ref here to control it */}
      <mesh ref={rightArmRef} position={[0.4, 1.8, 0]} rotation={[0, 0, -Math.PI / 2]} material={material} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.2, 0.3, 0]} material={material} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      </mesh>
    </group>
  );
});

export default Fighter;