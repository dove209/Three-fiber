/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const count = 10000;


// https://dsp.stackexchange.com/questions/35211/generating-smoothed-versions-of-square-wave-triangular-etc/56529#56529
// https://www.desmos.com/calculator/agt7tb1dky?lang=ko
const roundedSquareWave = (t, delta, a, f) => {
  // t = 시간, delta = 둥근 정도, a = 강도, f = 빈도
  return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)
}

const Dots = () => {
  const ref = React.useRef();

  const { vec, transform, positions, distances } = useMemo(() => {
    const vec = new THREE.Vector3();
    const transform = new THREE.Matrix4();
    const positions = [...Array(count)].map((_, i) => {
      const position = new THREE.Vector3();
      // Place in a grid
      position.x = (i % 100) - 50 // -50 ~ 50
      position.y = Math.floor(i / 100) - 50
      // Offset every other column (hexagonal pattern)
      position.y += (i % 2) * 0.5
      // Add some noise
      position.x += Math.random() * 0.3
      position.y += Math.random() * 0.3
      return position;
    })
    
    // Precompute initial distances with octagonal offset
    const right = new THREE.Vector3(1,0,0);
    
    //.length 현재 좌표과 중점(0,0,0)과 거리, 
    const distances = positions.map((pos) => {
      // https://www.desmos.com/calculator/4eiqbvjdzm?lang=ko
      return pos.length() + Math.cos(pos.angleTo(right) * 8) * 0.5
    })

    console.log(distances)
    return { vec, transform, positions, distances }
  },[])


  useFrame(({ clock }) => {
    for (let i = 0; i < count; i++) {
      const dist = distances[i]

      // Distance affects the wave phase
      const t = clock.elapsedTime - dist / 25;

      // Oscillates between -0.4 and +0.4
      const wave = roundedSquareWave(t, 0.15 + (0.2 * dist) / 72, 0.4, 1 / 3.8)
      
      // Scale initial position by our oscillator
      vec.copy(positions[i]).multiplyScalar(wave + 1.3)

      transform.setPosition(vec);      // Apply the Vector3 to a Matrix4

      ref.current.setMatrixAt(i, transform);       // Update Matrix4 for this instance
    }

    ref.current.instanceMatrix.needsUpdate = true;
  })


  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <circleBufferGeometry args={[0.15]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
};

const App = () => {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 20 }}
      gl={{ toneMapping: THREE.sRGBEncoding }}
    >
      <color attach={"background"} args={["black"]} />
      <Suspense fallback={null}>
        <Dots />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default App;
