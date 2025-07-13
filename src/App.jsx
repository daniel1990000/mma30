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
  const playerPhysicsApi = useRef(null);
  const aiPhysicsApi = useRef(null);

  useEffect(() => {
    if (playerAnimation === 'idle') {
      if (keys['j']) setPlayerAnimation('punch');
      else if (keys['l']) setPlayerAnimation('takedown');
    }
  }, [keys, playerAnimation]);

  useFrame(() => {
    if (!playerPhysicsApi.current || !aiPhysicsApi.current) return;

    // -- NEW MOVEMENT LOGIC --
    // We now set velocity on the physics body.
    const speed = 5;
    let velocityX = 0;
    let velocityZ = 0;
    if (keys['w']) velocityZ = -speed;
    if (keys['s']) velocityZ = speed;
    if (keys['a']) velocityX = -speed;
    if (keys['d']) velocityX = speed;
    playerPhysicsApi.current.velocity.set(velocityX, 0, velocityZ);

    // Collision & Damage Logic
    // (This will need to be updated later as positions are now on the physics body)
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
        movementApi={playerPhysicsApi}
        position={[0, 1.5, 2]} 
        rotation={[0, Math.PI, 0]} 
        color="red"
        animation={playerAnimation}
        onAnimationComplete={handleAnimationComplete}
      />
      <Fighter 
        movementApi={aiPhysicsApi}
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
        {/* Wrap the Scene in the Physics component */}
        <Physics>
          <Scene keys={keys} health={health} setHealth={setHealth} />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;