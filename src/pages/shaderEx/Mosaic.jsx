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

  void main() {
    vec2 st = vUv; // 0. ~ 1.
    float pixels = 50.;
    vec4 mosaicCol = texture2D(u_channel0, floor(st * pixels) / pixels);
    
    st *= pixels;
    st = fract(st);
    float dist = distance(st, vec2(0.5));
    dist = step(dist, 0.5);

    gl_FragColor = vec4(vec3(1.0), dist) * mosaicCol;
  }
`;


const ImagePlane = () => {
  const materialRef = useRef(null);
  const [texture] = useTexture(['image/233.jpg']);


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