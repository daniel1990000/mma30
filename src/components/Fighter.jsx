import React, { useRef, useEffect } from 'react';
import { CylinderGeometry, SphereGeometry, MeshStandardMaterial } from 'three';

const Fighter = React.forwardRef(({ 
  position, 
  rotation, 
  color = 'red', 
  bodyRotation = 0,
  shoulderRotation = 0,
  elbowRotation = 0
}, ref) => {
  const material = new MeshStandardMaterial({ color });

  // Refs for the fighter's body parts
  const animationGroupRef = useRef();
  const rightShoulderRef = useRef();
  const rightElbowRef = useRef();

  // Apply rotations from props
  useEffect(() => {
    animationGroupRef.current.rotation.x = bodyRotation;
    rightShoulderRef.current.rotation.x = shoulderRotation;
    rightElbowRef.current.rotation.x = elbowRotation;
  }, [bodyRotation, shoulderRotation, elbowRotation]);

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
            <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
            <group position={[0, -0.4, 0]}>
              <mesh position={[0, -0.4, 0]} castShadow material={material}>
                <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
              </mesh>
            </group>
          </mesh>
        </group>
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