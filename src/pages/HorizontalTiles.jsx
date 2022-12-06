import * as THREE from 'three';
import React, { useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  clicked: null,
  urls: [1, 2, 3, 4, 5, 6, 7, 8, 4, 3, 6, 1, 3, 5, 7, 8, 2, 4, 8, 6].map((u) => `${u}.jpg`)
})

const Minimap = () => {
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)])
  const material = new THREE.LineBasicMaterial({ color: 'white' })
  const ref = useRef()
  const { urls } = useSnapshot(state);
  const { viewport: {height} } = useThree();
  const scroll = useScroll();
  useFrame((state, delta) => {
    ref.current.children.forEach((child, index) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length)
      child.scale.y = THREE.MathUtils.damp(child.scale.y, 0.1 + y / 6, 8, delta)
    })
  })
  return(
    <group ref={ref}>
      {urls.map((_, i) => (
        <line key={i} geometry={geometry} material={material} position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]} />
      ))}
    </group>
  )
}


const Item = ({ index, position, scale, c = new THREE.Color(), url}) => {
  const ref = useRef();
  const scroll = useScroll();
  const { clicked, urls } = useSnapshot(state);
  const [hovered, setHovered] = useState(false);
  const click = () => {
    state.clicked = index === clicked ? null : index;
  };
  const over = () => setHovered(true);
  const out = () => setHovered(false);

  useFrame((state, delta) => {
    const y = scroll.curve(index / urls.length - 1.5 / urls.length, 4 / urls.length);
    ref.current.material.scale[1] = ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, clicked === index ? 5 : 4 + y, 8, delta)
    ref.current.material.scale[0] = ref.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, clicked === index ? 4.7 : scale[0], 6, delta)
    
    if (clicked !== null && index < clicked) ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, position[0] - 2, 6, delta)
    if (clicked !== null && index > clicked) ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, position[0] + 2, 6, delta)
    if (clicked === null || clicked === index) ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, position[0], 6, delta)

    ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, hovered || clicked === index ? 0 : Math.max(0, 1 - y), 6, delta)
    ref.current.material.color.lerp(c.set(hovered || clicked === index ? 'white' : '#aaa'), hovered ? 0.3 : 0.1)
  })    

  return(
    <Image 
      ref={ref}
      url={`/image/infinity_scroll/img${url}`} 
      position={position}
      scale={scale}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  )
}

const Items = ({ w = 0.7, gap = 0.15 }) => {
    const { urls } = useSnapshot(state);
    const { viewport: { width } } = useThree();
    const xW = w + gap;
    return (
      <ScrollControls horizontal damping={10} pages={(width - xW + urls.length * xW) / width}>
        <Minimap />
        <Scroll>
          {urls.map((url, i) => <Item key={i} index={i} position={[i *xW, 0, 0]} scale={[w, 4, 1]} url={url} />)}
        </Scroll>
      </ScrollControls>
    )
}




function App() {
  return (
    <Canvas
      gl={{ antialias: false }}
      dpr={[1, 1.5]}
      onPointerMissed={() => state.clicked = null}
    >
      <color attach={'background'} args={['#151515']} />
      <Items />
    </Canvas>
  );
}







export default App;
