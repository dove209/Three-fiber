import * as THREE from 'three';
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, MeshReflectorMaterial, OrbitControls, Text } from '@react-three/drei'


const VideoText = ({ ready, ...props }) => {
  const [video] = useState(() => Object.assign(document.createElement('video'), 
    { src: '/video/drei.mp4', crossOrgin: 'Annoymous', loop: true, muted: 'muted' }
    ))

  useEffect(() => {
    ready && video.play()

  },[video, ready])
  return (
    <Text font='/fonts/Inter-Bold.woff' fontSize={3} letterSpacing={-0.06} {...props}>
      LOVE!!
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach={'map'} args={[video]} encoding={THREE.sRGBEncoding} />
      </meshBasicMaterial>
    </Text>
  )
}

const Ground = () => {
  const [floor, normal] = useTexture([
    '/image/SurfaceImperfections003_1K_var1.jpg',
    '/image/SurfaceImperfections003_1K_Normal.jpg',
  ])
  return (
    <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      <planeBufferGeometry args={[10, 10]} />
      <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={512}
            mixBlur={6}
            mixStrength={1.5}
            color="#555"
            mirror={0.5}
            metalness={0.4}
            roughnessMap={floor}
            normalMap={normal}
            normalScale={[2,2]}
          />
    </mesh>
  )
}

function App() {
  const [ready, setReady] = useState(false);

  return (
    <Canvas 
      gl={{ alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 10], fov: 15 }}
    >
      <color attach={'background'} args={['black']} />
      <fog attach={'fog'} args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        <directionalLight position={[-20, 0, -10]} intensity={0.7} />

        <group position={[0, -1, 0]}>
          <VideoText ready={ready} position={[0, 1.3, -2]} />
          <Ground />
        </group>
        {/* <OrbitControls makeDefault /> */}
        <Into ready={ready} setReady={setReady} />
      </Suspense>
    </Canvas>
  );
}


const Into = ({ready, setReady}) => {
  useEffect(() => {
    setTimeout(() => setReady(true), 500)
  }, [])
  useFrame((state) => {
    if(ready) {
      state.camera.position.lerp(new THREE.Vector3(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)
      state.camera.lookAt(0,0,0)
    }
  })
  return null
}

export default App;
