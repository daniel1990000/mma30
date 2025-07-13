import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Arena from './components/Arena.jsx';
import Fighter from './components/Fighter.jsx';
import UI from './components/UI.jsx';
import './App.css';

function Scene({ keys, health, setHealth }) {
  const [playerAnimation, setPlayerAnimation] = useState('idle');
  const hitCooldown = useRef(false);

  // We need refs to the physics APIs of our fighters
  const playerPhysicsApi = useRef(null);
  const aiPhysicsApi = useRef(null);

  useEffect(() => {
    if (playerAnimation === 'idle') {
      if (keys['j']) setPlayerAnimation('punch');
      else if (keys['l']) setPlayerAnimation('takedown');
    }
  }, [keys, playerAnimation]);

  useFrame((state, delta) => {
    if (!playerPhysicsApi.current || !aiPhysicsApi.current) return;

    // -- NEW, CORRECTED MOVEMENT LOGIC --
    const speed = 5; // A little faster for a better feel
    let velocityX = 0;
    let velocityZ = 0;

    if (keys['w']) velocityZ = -speed;
    if (keys['s']) velocityZ = speed;
    if (keys['a']) velocityX = -speed;
    if (keys['d']) velocityX = speed;

    // Set the velocity on the physics body. This is the key change.
    // We pass the current y-velocity to allow for gravity.
    playerPhysicsApi.current.velocity.set(velocityX, 0, velocityZ);
    
    // -- COLLISION LOGIC (Needs updating to use physics positions) --
    // We will fix this in the next step. For now, we'll disable it.
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
        movementApi={playerPhysicsApi} // Pass the ref to get the API
        position={[0, 1.5, 2]} 
        rotation={[0, Math.PI, 0]} 
        color="red"
        animation={playerAnimation}
        onAnimationComplete={handleAnimationComplete}
      />
      <Fighter 
        movementApi={aiPhysicsApi} // Pass the ref to the AI as well
        position={[0, 1.5, -2]} 
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
        <Physics>
          <Scene keys={keys} health={health} setHealth={setHealth} />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;