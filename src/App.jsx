import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Arena from './components/Arena.jsx';
import Fighter from './components/Fighter.jsx';

function Scene({ keys }) {
  const playerRef = useRef();

  useFrame((state, delta) => {
    if (!playerRef.current) return;
    const speed = 2;
    const velocity = { x: 0, z: 0 };
    if (keys['w']) velocity.z -= speed * delta;
    if (keys['s']) velocity.z += speed * delta;
    if (keys['a']) velocity.x -= speed * delta;
    if (keys['d']) velocity.x += speed * delta;
    playerRef.current.position.x += velocity.x;
    playerRef.current.position.z += velocity.z;
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Arena />

      {/* Player Fighter (Red) - Add rotation to make him face the opponent */}
      <Fighter ref={playerRef} position={[0, 0.2, 2]} color="red" keys={keys} rotation={[0, Math.PI, 0]} />

      {/* AI Fighter (Blue) */}
      <Fighter position={[0, 0.2, -2]} color="blue" />
    </>
  );
}

function App() {
  const [keys, setKeys] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    };
    const handleKeyUp = (e) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Canvas 
      camera={{ position: [0, 5, 10] }}
      style={{ width: '100vw', height: '100vh' }}
      shadows
    >
      <Scene keys={keys} />
    </Canvas>
  );
}

export default App;