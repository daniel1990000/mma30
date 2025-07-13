import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Arena from './components/Arena.jsx';
import Fighter from './components/Fighter.jsx';
import UI from './components/UI.jsx';
import './App.css';

function Scene({ keys, health, setHealth }) {
  const playerRef = useRef();
  const aiRef = useRef();
  const [playerAnimation, setPlayerAnimation] = useState('idle');
  const hitCooldown = useRef(false);

  useEffect(() => {
    if (playerAnimation === 'idle') {
      if (keys['j']) setPlayerAnimation('punch');
      else if (keys['l']) setPlayerAnimation('takedown');
    }
  }, [keys, playerAnimation]);

  // THIS IS THE LINE TO FIX
  useFrame((state, delta) => { // Add 'delta' back here
    if (!playerRef.current || !aiRef.current) return;

    // Movement
    const speed = 2;
    const velocity = { x: 0, z: 0 };
    if (keys['w']) velocity.z -= speed * delta;
    if (keys['s']) velocity.z += speed * delta;
    if (keys['a']) velocity.x -= speed * delta;
    if (keys['d']) velocity.x += speed * delta;
    playerRef.current.position.x += velocity.x;
    playerRef.current.position.z += velocity.z;

    // Collision & Damage Logic
    if (playerAnimation === 'punch' && !hitCooldown.current) {
      const distance = playerRef.current.position.distanceTo(aiRef.current.position);
      if (distance < 1.5) {
        console.log("HIT! Reducing AI health.");
        setHealth(prev => ({ ...prev, ai: Math.max(0, prev.ai - 10) }));
        hitCooldown.current = true;
      }
    }
  });
  
  const handleAnimationComplete = () => {
    setPlayerAnimation('idle');
    hitCooldown.current = false;
  };

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
        animation={playerAnimation}
        onAnimationComplete={handleAnimationComplete}
      />
      <Fighter 
        ref={aiRef} 
        position={[0, 0.2, -2]} 
        color="blue" 
        animation="idle"
      />
    </>
  );
}

function App() {
  const [keys, setKeys] = useState({});
  const [health, setHealth] = useState({ player: 100, ai: 100 });

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
    <div className="app-container">
      <UI health={health} />
      <Canvas camera={{ position: [0, 5, 10] }} shadows>
        <Scene keys={keys} health={health} setHealth={setHealth} />
      </Canvas>
    </div>
  );
}

export default App;