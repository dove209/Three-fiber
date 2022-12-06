import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, usePlane, useSphere } from '@react-three/cannon';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import { OrbitControls, useHelper } from '@react-three/drei';

const InstancedSpheres = ({ count = 200 }) => {
  const { viewport: { height } } = useThree();
  const [ref] = useSphere(() => ({
    mass: 100,
    position: [4 - Math.random() * 8, height, 0],
    args: [1.2]
  }))
  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, count]}>
      <sphereBufferGeometry args={[1.2, 32, 32]} />
      <meshLambertMaterial color={'#ff7b00'} />
    </instancedMesh>
  )
}


const Borders = () => {
  const { viewport: { width, height} } = useThree();
  return (
    <>
      {/* 바닥 */}
      <Plane position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}  />   
      {/* 왼쪽 */}
      <Plane position={[-width / 2 - 1, 0, 0]} rotation={[0, Math.PI / 2, 0]}  /> 
      {/* 오른쪽 */}
      <Plane position={[width / 2 + 1, 0, 0]} rotation={[0, -Math.PI / 2, 0]}  /> 
      {/* 뒷면 */}
      <Plane position={[0, 0, -1]} rotation={[0, 0, 0]} /> 
      {/* 앞면 */}
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} /> 
    </>
  )
}


const Plane = (props) => {
  const [ref] = usePlane(() => ({ mass:0, ...props }));
  const { viewport: {width, height} } = useThree();

  return (
    <mesh ref={ref}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={'#feef8a'} transparent opacity={0} />
    </mesh>
  )
}


const Light = () => {
  const directionalLightRef = useRef(null);
  // useHelper(directionalLightRef, THREE.DirectionalLightHelper)
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <directionalLight 
        ref={directionalLightRef}
        castShadow
        intensity={4}
        position={[50, 50, 25]}
        shadow-mapSize={[256, 256]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  )
}



function Ballpit() {
  return (
    <Canvas shadows gl={{ stencil: false, antialias: false }} camera={{ position: [0, 0, 20], fov: 50, near: 0.1, far: 400 }}>
      <fog attach="fog" args={["red", 25, 35]} />
      <color attach="background" args={["#feef8a"]} />
      <Light />

      <Physics gravity={[0, -50, 0]} defaultContactMaterial={{ restitution: 0.5 }}>
        <group position={[0, 0, -10]}>
          <Borders />
          <InstancedSpheres />
          <Mouse />
        </group>
      </Physics>
      
      
      <EffectComposer>
        {/* <SSAO radius={0.4} intensity={50} luminanceInfluence={0.4} color="red" /> */}
        {/* <Bloom intensity={1.25} kernelSize={3} luminanceThreshold={0.5} luminanceSmoothing={0.0} /> */}
      </EffectComposer>
      
      
      {/* <axesHelper /> */}
      {/* <OrbitControls /> */}
    </Canvas>
  );
}

const Mouse = () => {
  const { viewport: {width, height} } = useThree();
  const [ref, api] = useSphere(() => ({ args: [6] }));
  useFrame((state) => api.position.set(state.mouse.x * width / 2, state.mouse.y * height / 2, 7 ))
  return null;
  // return (
  //   <mesh ref={ref}>
  //     <sphereBufferGeometry args={[6, 8, 8]} />
  //     <meshStandardMaterial wireframe />
  //   </mesh>
  // )
}





export default Ballpit;
