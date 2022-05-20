import * as THREE from 'three';
import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Instances, Instance } from '@react-three/drei'
import { EffectComposer, SSAO } from '@react-three/postprocessing'

const particles = new Array(150).fill().map(() => ({
  factor: THREE.MathUtils.randInt(20, 100),
  speed: THREE.MathUtils.randFloat(0.01, 1),
  xFactor: THREE.MathUtils.randFloatSpread(80),
  yFactor: THREE.MathUtils.randFloatSpread(40),
  zFactor: THREE.MathUtils.randFloatSpread(40)
}))

const Bubble = ({ factor, speed, xFactor, yFactor, zFactor }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 2);
    ref.current.scale.setScalar(Math.max(1.5, Math.cos(t) * 5));
    ref.current.position.set(
      Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
    )
  })
  return (
    <Instance ref={ref} />
  )
}


const Bubbles = () => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, (-state.mouse.x * Math.PI) / 6, 2.8, delta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, (-state.mouse.y * Math.PI) / 6, 2.8, delta);

  })
  return(
    <Instances limit={particles.length} ref={ref} castShadow receiveShadow position={[0, 10, 0]}>
      <sphereBufferGeometry args={[1, 32, 32]} />
      <meshStandardMaterial roughness={0} color="#f0f0f0" />
      {particles.map((data, i) => (
        <Bubble key={i} {...data} />
      ))}
    </Instances>
  )
}

function App() {
  return (
    <Canvas
      shadows
      gl={{ antialias: false }}
      dpr={[1, 2]}
      camera={{ position:[0,0,60],fov: 75, near: 10, far:150 }}
    >
      <color attach={'background'} args={['#f0f0f0']} />
      <fog attach={'fog'} args={['#fff', 60, 110]} />
      <ambientLight intensity={1.5} />
      <pointLight position={[100, 10, -50]} intensity={20} castShadow />
      <pointLight position={[-100, -100, -100]} intensity={10} color='red' />

      <Bubbles />

      <ContactShadows position={[0, -30, 0]} opacity={0.6} scale={130} blur={1} far={40} />
      <EffectComposer multisampling={0}>
        <SSAO samples={31} radius={0.1} intensity={30} luminanceInfluence={0.1} color={'red'} />
      </EffectComposer>
      {/* Helper ETC */}
      <axesHelper args={[10]} />
      <OrbitControls makeDefault />
    </Canvas>
  );
}

export default App;

