import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas , useFrame, extend, useLoader } from '@react-three/fiber';
import { shaderMaterial } from "@react-three/drei";

import glsl from "babel-plugin-glsl/macro";

const WaveShaderMaterial = shaderMaterial(
  //Uniform
  {
    u_color: new THREE.Color(0.0, 0.0, 0.0),
    u_time: 0,
    u_texture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    precision mediump float;
    varying vec2 vUv;
    varying float vWave;

    uniform float u_time;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d); 

    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noiseFreq = 1.5; // 주파수
      float noiseAmp = 0.25; // 진폭
      vec3 noisePos = vec3(pos.x * noiseFreq + u_time, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;
    

      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
  `,
  //Fragment Shader
  glsl`
    precision mediump float;
    uniform vec3 u_color;
    uniform float u_time;
    uniform sampler2D u_texture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * 0.1;
      // Split each texture color vector
      float r = texture2D(u_texture, vUv).r;
      float g = texture2D(u_texture, vUv).g;
      float b = texture2D(u_texture, vUv + wave).b;

      // Put them back together
      vec3 texture = vec3(r,g,b);

      //vec3 texture = texture2D(u_texture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

extend({ WaveShaderMaterial })

const Wave = () => {
  const ref = useRef();
  
  const [image] = useLoader(THREE.TextureLoader, ['/image/233.jpg'])
  
  
  useFrame(({ clock }) => {
    ref.current.u_time = clock.getElapsedTime()
  })



  return (
    <mesh>
      <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial ref={ref} u_color={'hotpink'} u_texture={image} />
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