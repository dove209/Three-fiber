import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useCursor, Image, Text, Environment, MeshReflectorMaterial } from '@react-three/drei'
import getUuid from 'uuid-by-string';
import { useRoute, useLocation } from 'wouter';

const GOLD_ENRATIO = 1.6183398875
// const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const pexel = (id) => `${window.location.href}Three-fiber/image/choriruring/${id}`

const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url:pexel('Spirit_ring.jpg'), descript: `Spirit_Ring-silver925-strass_galss-silver-$46` },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel('fw_pearl_nacklace.jpg'), descript: `FW_pearl_necklace-silver-30.7g-40cm(+5cm)-$100` },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel('mono_p_nacklace.jpg'), descript: `Mono_P_nacklace-silver-3.7g-40cm-$53` },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel('Spirit_ring_2.jpg'), descript: `Spirit_ring-silver925-strass_galss-silver-$46` },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel('topia_ring.jpg'), descript: `Topia_ring-silver-1.7g-13size-$53` },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: pexel('daymoon_ring.jpg'), descript: `Daymoon_ring-silver-7.9g-5~30size-$91` },
  // Right
  { position: [1.75, 0, 0.1], rotation: [0, -Math.PI / 2.5, 0], url: pexel('lotus_insence_holder.jpg'), descript: `lotus/insence_holder-Brass-124.23g-width_7.5cm/height_8.2cm-$65` },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel('fabric_poster.jpg'), descript: `Fabric_Poster-polyester100%-50d_satin/dty-width_75cm/height_45cm-$17` },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel('Very_Peri_love_Key_ring.jpg'), descript: `Very_Peri_love_Key_ring-brass/beads-pink_pearl-white_pearl-pink_beads-$14.7` }
]

const Frame = ({ url, descript, c = new THREE.Color(), ...props }) => {
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const image = useRef();
  const frame = useRef();
  const name = getUuid(url);
  useCursor(hovered);
  useFrame((state) => {
    image.current.material.zoom = 2 + Math.sin(rnd * 1000 + state.clock.elapsedTime / 3) / 2;
    image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.85 * (hovered ? 0.85 : 1), 0.1);
    image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.9 * (hovered ? 0.905 : 1), 0.1);
    frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white'), 0.1)
  })
  return (
    <group {...props}>
      <mesh
        name={name}
        scale={[1, GOLD_ENRATIO, 0.05]}
        position={[0, GOLD_ENRATIO / 2, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(true)
        }}
        onPointerOut={(e) => {
          hover(false)
        }}
      >
        <boxBufferGeometry />
        <meshStandardMaterial color={'#151515'} metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxBufferGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image ref={image} position={[0,0,0.7]} url={url} />
      </mesh>
      <Text maxWidth={0.1} anchorX='left' anchorY={'top'} position={[0.55, GOLD_ENRATIO, 0]} fontSize={0.025}>
        {descript?.split('-').join(' ')}
      </Text>
    </group>
  )
}


const Frames = ({ q = new THREE.Quaternion(), p = new THREE.Vector3() }) => {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLD_ENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    state.camera.position.lerp(p, 0.025)    // 카메라 이동
    state.camera.quaternion.slerp(q, 0.025) // 카메라 회전
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name)
      }}
      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function App() {
  return (
    <Canvas
      gl={{ alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 2, 15], fov: 70 }}
    >
      <color attach={'background'} args={['#191920']} />
      <fog attach={'fog'} args={['#191920', 0, 15]} />
      <Environment preset='city' />
      <group position={[0, -0.5, 0]}>
        <Frames />
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeBufferGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.5}
          />
        </mesh>
      </group>


      {/* Helper ETC */}
      {/* <axesHelper args={[10]} /> */}
      {/* <OrbitControls makeDefault /> */}
    </Canvas>
  );
}

export default App;
