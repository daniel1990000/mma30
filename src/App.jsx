import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Arena from './components/Arena.jsx';
import Fighter from './components/Fighter.jsx';

// Main app component: Sets up the 3D scene.
// This is where we compose the Canvas (the 3D renderer), lights, camera controls, and add our 3D elements (arena and fighter).
function App() {
  return (
    // Canvas from React Three Fiber: Creates a Three.js scene in React.
    // colorManagement: Enables better color rendering.
    // camera: Sets initial camera position [x, y, z]—looking down slightly.
    <Canvas camera={{ position: [0, 2, 10] }}>
      // OrbitControls from drei: Allows orbiting the camera around the scene with mouse drag.
      // enableZoom, etc.: Basic controls for viewing.
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />

      // Ambient light: Soft overall lighting.
      <ambientLight intensity={0.5} />

      // Directional light: Simulates sunlight, positioned above.
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      // Arena: The floor environment.
      <Arena />

      // Fighter: Static dummy model, positioned at [0, 0, 0].
      // Color 'red' for player dummy (we'll add blue for AI later).
      <Fighter position={[0, 0, 0]} color="red" />
    </Canvas>
  );
}

export default App;