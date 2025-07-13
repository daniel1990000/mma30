import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Arena from './components/Arena.jsx';
import Fighter from './components/Fighter.jsx';

// Main app component: Sets up the 3D scene with movement logic.
function App() {
  const [keys, setKeys] = useState({}); // State to track pressed keys.

  // Effect to add keyboard event listeners.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      console.log(`Key down: ${key}`); // Debug: Log pressed keys to console.
      setKeys((prev) => ({ ...prev, [key]: true }));
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      console.log(`Key up: ${key}`); // Debug: Log released keys.
      setKeys((prev) => ({ ...prev, [key]: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Ref for the player fighter.
  const playerRef = React.useRef();

  // useFrame: Runs every frame for smooth updates.
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
    <Canvas 
      camera={{ position: [0, 2, 10] }} 
      style={{ width: '100vw', height: '100vh' }} // Fix: Make canvas full viewport size.
    >
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      <Arena />

      <Fighter ref={playerRef} position={[0, 0.2, 0]} color="red" />
    </Canvas>
  );
}

export default App;