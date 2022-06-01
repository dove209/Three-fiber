import * as THREE from 'three'
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  MeshDistortMaterial,
  ContactShadows,
} from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";

const AnimatedMaterial = a(MeshDistortMaterial);

const Scene = () => {
  const sphere = useRef();
  const light = useRef();
  const [mode, setMode] = useState(false);
  const [down, setDown] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    light.current.position.x = state.mouse.x * 20;
    light.current.position.y = state.mouse.y * 20;
    if(sphere.current) {
      sphere.current.position.x = THREE.MathUtils.lerp(sphere.current.position.x, hovered ? state.mouse.x / 2 : 0, 0.2)
      sphere.current.position.y = THREE.MathUtils.lerp(
        sphere.current.position.y,
        Math.sin(state.clock.elapsedTime / 1.5) / 6 + (hovered ? state.mouse.y / 2 : 0),
        0.2
      )
    }
  })



  const [{ wobble, coat, color, ambient, env }] = useSpring(
    {
      wobble: down ? 1.2 : hovered ? 1.05 : 1,
      coat: mode && !hovered ? 0.04 : 1,
      ambient: mode && !hovered ? 1.5 : 0.5,
      env: mode && !hovered ? 0.4 : 1,
      color: hovered ? '#E8B059' : mode ? '#202020' : 'white',
      config: (n) =>
        n === "wobble" && hovered && { mass: 2, tension: 1000, friction: 10 },
    },
    [mode, hovered, down]
  );
  return (
    <>
      <a.ambientLight intensity={ambient} />
      <a.pointLight
        ref={light}
        position-z={-15}
        intensity={env}
        color="#f8c069"
      />
      <Suspense>
        <a.mesh
          ref={sphere}
          scale={wobble}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setDown(true)}
          onPointerUp={() => {
            setDown(false);
            setMode(!mode)
          }}
        >
          <sphereBufferGeometry args={[1, 64, 64]} />
          <AnimatedMaterial color={color} envMapIntensity={env} clearcoat={coat} clearcoatRoughness={0} metalness={0.1} />
        </a.mesh>
        <Environment preset="warehouse" />
        <ContactShadows 
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -1.6, 0]}
          opacity={mode ? 0.8 : 0.4}
          width={8}  
          height={8}
          blur={1}
          far={1.6}
        />
      </Suspense>
    </>
  );
};

function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 75 }}>
      <Scene />
      <axesHelper args={[10]} />
      <OrbitControls makedefault />
    </Canvas>
  );
}

export default App;
