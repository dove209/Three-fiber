import React, { useState, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas , useFrame, extend, useLoader } from '@react-three/fiber';
import { shaderMaterial } from "@react-three/drei";

import glsl from "babel-plugin-glsl/macro";

const ImageFadeMaterial = shaderMaterial(
  //Uniform
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
    disp: undefined,
  },
  // Vertext Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  //Fragment Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;

    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;

    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r * effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r * effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);

      gl_FragColor = finalTexture;
    }
  `
);

extend({ ImageFadeMaterial })

const FadingImage = () => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);

  const [texture1, texture2, dispTexture] = useLoader(THREE.TextureLoader, ['/image/infinity_scroll/img3.jpg','/image/infinity_scroll/trip2.jpg','/image/displacement/13.jpg'])
  
  
  useFrame(() => {
    ref.current.dispFactor = THREE.MathUtils.lerp(ref.current.dispFactor, hovered ? 1 : 0, 0.075)
  })

  return (
    <mesh onPointerOver={() => setHover(true) } onPointerOut={() => setHover(false)}>
      <planeBufferGeometry />
      <imageFadeMaterial 
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        toneMapped={false}
      />
    </mesh>
  )
}


const App = () => {

  return (
    <Canvas
      camera={{ fov: 50, position:[0, 0, 2] }}
    >
      <Suspense fallback={null}>
        <FadingImage />
      </Suspense>
    </Canvas>
  )
}

export default App;