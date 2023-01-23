import React, { useRef } from 'react';
import { Canvas , useFrame } from '@react-three/fiber';
import { useTexture } from "@react-three/drei"


const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;

  uniform float u_time;
  uniform sampler2D u_channel0;
  uniform sampler2D u_channel1;

  void main() {
    vec2 st = vUv;

    vec4 noiseCol = texture2D(u_channel1, st);

    float smoothness = 0.3;
    float progress = fract(u_time);
    progress += progress * smoothness;
    float alpha = smoothstep(noiseCol.x - smoothness, noiseCol.x, progress);

    vec4 finalCol = texture2D(u_channel0, st);
    finalCol.a *= alpha;

    gl_FragColor = finalCol;
  }
`;


const ImagePlane = () => {
  const materialRef = useRef(null);
  const [texture, noiseTexture] = useTexture(['image/233.jpg', 'image/noise.png']);


  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
  })


  return (
    <mesh scale={[500, 500, 1]}>
    <planeBufferGeometry />
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={{ 
        u_time: { value: 0 }, 
        u_channel0: { value: texture },
        u_channel1: { value: noiseTexture }
      }}
    />
  </mesh>
  )
}


const App = () => {

  return (
    <Canvas orthographic>
      <ImagePlane />
    </Canvas>
  )
}

export default App;