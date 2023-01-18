import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const InfiniteTube = () => {
    const ref = useRef()
    const curveRef = useRef()
  // Create a curve based on the points
  const [curve] = useState(() => {
    // Create an empty array to stores the points
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 5; i++) {
      points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
    }
    points[0].y = -0.06
    return new THREE.CatmullRomCurve3(points);
  });

  const [colorMap, bumpMap ] = useLoader(THREE.TextureLoader, [
    "/texture/stonePattern.jpg",
    "/texture/stonePatternBump.jpg",
  ]);
  colorMap.wrapS = bumpMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = bumpMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(30, 6);
  bumpMap.repeat.set(30, 6);


  useFrame((state) => {
    ref.current.map.offset.x -= 0.005;
  });


  return (
    <mesh ref={curveRef} >
      <tubeGeometry args={[curve, 70, 0.02, 50, false]} />
      <meshStandardMaterial 
        ref={ref}
        side={THREE.BackSide} 
        map={colorMap} 
        bumpMap={bumpMap}
        bumpScale={0.0003}
      />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas
        camera={{
            position: [0,0,2.5],
            near: 0.001,
        }}
    >
      <ambientLight />
      <InfiniteTube />
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default App;
