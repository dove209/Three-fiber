/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei'

const Dodecahedron = ({ ...props }) => {
  return (
    <mesh {...props}>
      <dodecahedronGeometry />
      <meshStandardMaterial roughness={0.75} emissive="#404057" />
      <Html>
        <div 
          style={{
            padding: '10px 15px',
            backgroundColor:'#202035',
            color: '#fff',
            borderRadius: '5px',
            transform: 'translate3d(50%, 0, 0)'
          }}>
          hello<br/>
          world
        </div>
      </Html>
    </mesh>
  )
}


const Content = () => {
  const { scene } = useThree();
  const ref = useRef();

  useEffect(() => {
    const AxisHelper = new THREE.AxesHelper(5);
    scene.add(AxisHelper)
  }, [])
  
  useFrame(() => {
    ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.01 
  })
  return (
    <group ref={ref}>
      <Dodecahedron position={[-2, 0, 0]} />
      <Dodecahedron position={[0, -2, -3]} />
      <Dodecahedron position={[2, 0, 0]} />
    </group>
  )
}


function App() {


  return (
    <Canvas 
      dpr={[1,2]}
      camera={{ position: [0, 0, 7.5] }}
    >
      <pointLight color={'indianred'} />
      <pointLight position={[10, 10, -10]} color='orange' />
      <pointLight position={[-10, -10, 10]} color='lightblue' />
    
      <Content /> 
    
      {/* Helper ETC */}
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default App;
