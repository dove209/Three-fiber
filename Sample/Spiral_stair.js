import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCursor, softShadows, OrbitControls } from '@react-three/drei'

softShadows()

const floorCount = 30;

const Stair = (props) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  useFrame((state) => {
    ref.current.scale.setScalar(hovered ? 1 + Math.sin(state.clock.elapsedTime * 10) / 50 : 1)
  })
  useCursor(hovered)
  return(
    <mesh
      {...props}
      ref={ref}
      receiveShadow
      castShadow
      onClick={(e) => {
        e.stopPropagation();
        setClicked(!clicked);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        setHovered(false);
      }}
    >
      <boxBufferGeometry args={[2, 6, 0.075]} />
      <meshStandardMaterial roughness={1} transparent opacity={0.6} color={clicked ? 'lightblue' : hovered ? 'aquamarine' : 'white'} />
    </mesh>
  )
}


function App() {
  return (
    <Canvas 
      shadows
      dpr={[1,2]}
      camera={{ position: [-15, 10, 10], fov: 50 }}
    >
      <axesHelper args={[10]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[1, 10, -2]}
        intensity={1}
        shadow-camera-far={70}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize={[512, 512]}
        castShadow
      />
      <directionalLight position={[-10, -10, 2]} intensity={3} />
      
      {/* Ground */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.75, 0]}>
        <planeBufferGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      
      {/* Stair */}
      <group position={[0,0,0]}>
      {
        new Array(floorCount).fill().map((_, i) => 
          <Stair 
            key={i}
            rotation={[-Math.PI / 2, 0, i / Math.PI / 2]}
            position={[-Math.sin(i / 4) * 5, i * 0.5, 5 - Math.cos(i / 5) * 5]}
          />
        )
      }
      </group>
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default App;
