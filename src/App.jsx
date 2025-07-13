import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Arena from './components/Arena.jsx';
import Fighter from './components/Fighter.jsx';

function Scene({ keys }) {
  const playerRef = useRef();
  const aiRef = useRef();

  // Use a ref for animation state to avoid re-renders in the game loop
  const playerAnimation = useRef('idle');
  
  // Keep health in state, as it changes less frequently
  const [health, setHealth] = useState({ player: 100, ai: 100 });

  const playerAnimValues = useRef({ shoulder: 0, elbow: 0, body: 0 });

  // Effect to trigger animations. This now updates the ref, not state.
  useEffect(() => {
    if (playerAnimation.current === 'idle') {
      if (keys['j']) playerAnimation.current = 'punch';
      else if (keys['l']) playerAnimation.current = 'takedown';
    }
  }, [keys]);

  useFrame((state, delta) => {
    if (!playerRef.current || !aiRef.current) return;

    // Movement Logic
    const speed = 2;
    const velocity = { x: 0, z: 0 };
    if (keys['w']) velocity.z -= speed * delta;
    if (keys['s']) velocity.z += speed * delta;
    if (keys['a']) velocity.x -= speed * delta;
    if (keys['d']) velocity.x += speed * delta;
    playerRef.current.position.x += velocity.x;
    playerRef.current.position.z += velocity.z;

    // Animation & Collision Logic
    const lerpAmount = 0.1;
    if (playerAnimation.current === 'punch') {
      playerAnimValues.current.shoulder = THREE.MathUtils.lerp(playerAnimValues.current.shoulder, -Math.PI / 2, lerpAmount);
      playerAnimValues.current.elbow = THREE.MathUtils.lerp(playerAnimValues.current.elbow, -Math.PI / 2, lerpAmount);
      
      const distance = playerRef.current.position.distanceTo(aiRef.current.position);
      if (distance < 1.5) console.log("HIT!");

      if (playerAnimValues.current.shoulder < -1.5) playerAnimation.current = 'punch_return';

    } else if (playerAnimation.current === 'punch_return') {
      playerAnimValues.current.shoulder = THREE.MathUtils.lerp(playerAnimValues.current.shoulder, 0, lerpAmount);
      playerAnimValues.current.elbow = THREE.MathUtils.lerp(playerAnimValues.current.elbow, 0, lerpAmount);
      if (playerAnimValues.current.shoulder > -0.1) playerAnimation.current = 'idle';
    } else if (playerAnimation.current === 'takedown') {
      playerAnimValues.current.body = THREE.MathUtils.lerp(playerAnimValues.current.body, 0.8, lerpAmount);
      if (playerAnimValues.current.body > 0.7) playerAnimation.current = 'takedown_return';
    } else if (playerAnimation.current === 'takedown_return') {
      playerAnimValues.current.body = THREE.MathUtils.lerp(playerAnimValues.current.body, 0, lerpAmount);
      if (playerAnimValues.current.body < 0.1) playerAnimation.current = 'idle';
    } else { // Idle
      playerAnimValues.current.shoulder = THREE.MathUtils.lerp(playerAnimValues.current.shoulder, 0, lerpAmount);
      playerAnimValues.current.elbow = THREE.MathUtils.lerp(playerAnimValues.current.elbow, 0, lerpAmount);
      playerAnimValues.current.body = THREE.MathUtils.lerp(playerAnimValues.current.body, 0, lerpAmount);
    }
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Arena />
      <Fighter 
        ref={playerRef} 
        position={[0, 0.2, 2]} 
        rotation={[0, Math.PI, 0]} 
        color="red"
        animationValues={playerAnimValues.current}
      />
      <Fighter 
        ref={aiRef} 
        position={[0, 0.2, -2]} 
        color="blue" 
      />
    </>
  );
}

function App() {
  const [keys, setKeys] = useState({});
  useEffect(() => {
    const handleKeyDown = (e) => setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    const handleKeyUp = (e) => setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return (
    <Canvas camera={{ position: [0, 5, 10] }} style={{ width: '100vw', height: '100vh' }} shadows>
      <Scene keys={keys} />
    </Canvas>
  );
}

export default App;