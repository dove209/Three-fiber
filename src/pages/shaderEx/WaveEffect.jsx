import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas , useFrame, extend, useLoader } from '@react-three/fiber';
import { shaderMaterial } from "@react-three/drei";

import glsl from "babel-plugin-glsl/macro";

const WaveShaderMaterial = shaderMaterial(
  //Uniform
  {
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTime: 0,
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    precision mediump float;
    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d); 

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noiseFreq = 1.5;
      float noiseAmp = 0.25;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;
    

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.0 );
    }
  `,
  //Fragment Shader
  glsl`
    precision mediump float;
    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

extend({ WaveShaderMaterial })

const Wave = () => {
  const ref = useRef();
  
  const [image] = useLoader(THREE.TextureLoader, ['/image/233.jpg'])
  
  
  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime()
  })



  return (
    <mesh>
      <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial ref={ref} uColor={'hotpink'} uTexture={image} />
    </mesh>
  )
}


const App = () => {

  return (
    <Canvas
      camera={{ fov: 10, position:[0, 0, 5] }}
    >
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
    </Canvas>
  )
}

export default App;