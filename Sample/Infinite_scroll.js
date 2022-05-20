import * as THREE from 'three';
import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Image as ImageImpl, ScrollControls, Scroll, useScroll } from '@react-three/drei'
import './infinite_scroll.css';

const Image = ({ ...props }) => {
  const ref = useRef();
  const group = useRef();
  const data = useScroll();
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)
    ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.max(0, 1 - data.delta * 1000), 4, delta)
  })

  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  )
}


const Page = ({ m = 0.4, urls, ...props }) => {
  const { width } = useThree((state) => state.viewport)
  const w = width < 10 ? 1.5 / 3 :  1 / 3;
  return(
    <group {...props}>
      <Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
      <Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
      <Image position={[width * w, 0, 1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
    </group>
  )
}

const Pages = () => {
  const { viewport: { width } } = useThree();
  return (
    <>
      <Page position={[width * 0, 0, 0]} urls={['/image/infinity_scroll/trip1.jpg', '/image/infinity_scroll/trip2.jpg', '/image/infinity_scroll/trip3.jpg']} />
      <Page position={[width * 1, 0, 0]} urls={['/image/infinity_scroll/img1.jpg', '/image/infinity_scroll/img2.jpg', '/image/infinity_scroll/img3.jpg']} />
      <Page position={[width * 2, 0, 0]} urls={['/image/infinity_scroll/img4.jpg', '/image/infinity_scroll/img5.jpg', '/image/infinity_scroll/img6.jpg']} />
      <Page position={[width * 3, 0, 0]} urls={['/image/infinity_scroll/trip1.jpg', '/image/infinity_scroll/trip2.jpg', '/image/infinity_scroll/trip3.jpg']} />
      <Page position={[width * 4, 0, 0]} urls={['/image/infinity_scroll/img1.jpg', '/image/infinity_scroll/img2.jpg', '/image/infinity_scroll/img3.jpg']} />
      <Page position={[width * 5, 0, 0]} urls={['/image/infinity_scroll/img4.jpg', '/image/infinity_scroll/img5.jpg', '/image/infinity_scroll/img6.jpg']} />
    </>
  )
}


function App() {
  return (
    <Canvas
      gl={{ antialias: false }}
      dpr={[1, 1.5]}

    >
      <Suspense fallback={null}>
        <ScrollControls infinite={true} horizontal damping={4} pages={6} distance={1}>
          <Scroll>
            <Pages />
          </Scroll>
          <Scroll html>
            <h1 style={{ position: 'absolute', top: '20vh', left: '0px' }}>Page1</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '100vw' }}>Page2</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '200vw' }}>Page3</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '300vw' }}>Page4</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '400vw' }}>Page5</h1>
            <h1 style={{ position: 'absolute', top: '20vh', left: '500vw' }}>Page6</h1>
          </Scroll>
        </ScrollControls>
        <Preload />
      </Suspense>
     

      {/* Helper ETC */}
      {/* <axesHelper args={[10]} /> */}
      {/* <OrbitControls makeDefault /> */}
    </Canvas>
  );
}

export default App;

