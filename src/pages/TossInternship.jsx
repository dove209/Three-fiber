import * as THREE from 'three';
import { useRef } from 'react';
import { Canvas,  useFrame, useThree } from '@react-three/fiber';
import { Instances, Instance} from '@react-three/drei';


// 파란색 버블
const particles = new Array(30).fill().map(() => ({
  factor: THREE.MathUtils.randInt(20, 100),
  speed: THREE.MathUtils.randFloat(0.01, 1),
  xFactor: THREE.MathUtils.randFloatSpread(20),
  yFactor: THREE.MathUtils.randFloatSpread(20),
  zFactor: THREE.MathUtils.randFloatSpread(4)
}))

// 투명 버블
const glass_bubbles = new Array(10).fill().map(() => ({
  factor: THREE.MathUtils.randInt(20, 100),
  speed: THREE.MathUtils.randFloat(0.01, 1),
  xFactor: THREE.MathUtils.randFloatSpread(20),
  yFactor: THREE.MathUtils.randFloatSpread(20),
  zFactor: THREE.MathUtils.randFloatSpread(10)
}))

const Bubble = ({ factor, speed, xFactor, yFactor, zFactor }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 2);
    ref.current.scale.setScalar(Math.max(1.5, Math.cos(t) * 2.5));
    ref.current.position.set(
      Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
    )
  })
  return (
    <Instance position={[xFactor, yFactor, zFactor ]} ref={ref} />
  )
}


const Bubbles = () => {
  return (
    <Instances limit={particles.length} position={[0, 0, -10]}>
      <sphereBufferGeometry args={[THREE.MathUtils.randFloat(0.8, 1.5), 32, 32]} />
      <meshStandardMaterial roughness={0.5} metalness={0} color={'blue'} />
      {particles.map((data, i) => (
        <Bubble key={i} {...data} />
      ))}
    </Instances>
  )
}

const GlassBubbles = () => {
  return (
    <Instances limit={glass_bubbles.length} position={[0, 0, -10]}>
      <sphereBufferGeometry args={[THREE.MathUtils.randFloat(0.5, 0.9), 32, 32]} />
      <meshPhysicalMaterial roughness={0} metalness={0} transmission={1} thickness={2.3} />
      {glass_bubbles.map((data, i) => (
        <Bubble key={i} {...data} />
      ))}
    </Instances>
  )
}



function App() {
  return (
    <Canvas
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2  }}
      dpr={[1,2]}
      camera={{ position: [0, 0, 8], fov: 45, near: 1, far: 100 }}
    >
      <color attach={'background'} args={['#000']} />
      <ambientLight intensity={1} />
      <spotLight
        intensity={3}
        angle={0.2}
        penumbra={1}
        position={[100, 100, 100]}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight intensity={3} position={[100, 100, 100]} color='purple' />
      <Bubbles />
      <GlassBubbles />
      <Mouse />
      {/* <axesHelper args={[10]}/> */}
      {/* <OrbitControls makedefault /> */}
    </Canvas>
  );
}

const Mouse = () => {
  const ref = useRef();
  const {viewport: { width, height }} = useThree();
  useFrame((state) => {
    ref.current.position.set(state.mouse.x * width / 2, state.mouse.y * height / 2, 0)
  })
  return(
    <mesh ref={ref}>
      <sphereBufferGeometry args={[2, 32, 32]} />
      <meshPhysicalMaterial roughness={0} metalness={0} transmission={1} thickness={2.3} />
    </mesh>
  )
}


export default App;
