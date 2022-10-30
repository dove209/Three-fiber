import * as THREE from "three";
import React, { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  useCursor,
  OrbitControls,
  useGLTF,
  Text
} from "@react-three/drei";
import gsap from "gsap";


let gutter = { size: 1 };
let grid = { cols: 12, rows: 6 };

const centerX = (grid.cols - 1 + (grid.cols - 1) * gutter.size) * 0.5;
const centerZ = (grid.rows - 1 + (grid.rows - 1) * gutter.size) * 0.5;

const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

const map = (value, start1, stop1, start2, stop2) => {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

const Light = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
    </>
  );
};

const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry args={[100, 100]} />
      {/* <meshPhongMaterial color={"#a2b9e7"} /> */}
      <meshStandardMaterial color={"#222"} envMapIntensity={0.5} />
    </mesh>
  );
};

const Box = ({ ...props }) => {
  const [active, setActive] = useState(false);
  useCursor(active);

  const ref = useRef(null);
  const {
    viewport: { width, height },
  } = useThree();
  const { nodes, materials } = useGLTF("/model/Doughnut.glb");

  const maxPositioY = 10;
  const minPositionY = 0;
  const startDistance = 5;
  const endDistance = 0;

  useFrame((state) => {
    const mouseX = (state.mouse.x * width) / 2 || 100;
    const mouseZ = (-state.mouse.y * height) / 2 || 100;
    const mouseDistance = distance(
      mouseX,
      mouseZ,
      ref.current.position.x - centerX,
      ref.current.position.z - centerZ
    );

    const y = map(
      mouseDistance,
      startDistance,
      endDistance,
      minPositionY,
      maxPositioY
    );
    gsap.to(ref.current.position, 0.4, { y: y < 1 ? 1 : y });

    const scaleFactor = ref.current.position.y / 2.5;
    const scale = scaleFactor < 1 ? 1 : scaleFactor;

    gsap.to(ref.current.scale, 0.4, {
      ease: "back.out(1.7)",
      x: scale,
      y: scale,
      z: scale,
    });

    gsap.to(ref.current.rotation, 2, {
      ease: "back.out(1.7)",
      x: map(ref.current.position.y, -1, 1, Math.PI / 4, 0),
      y: map(ref.current.position.y, -1, 1, Math.PI / 2, 0),
      z: map(ref.current.position.y, -1, 1, Math.PI / 3, 0),
    });
  });

  return (
    <group
      ref={ref}
      {...props}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <mesh
        geometry={nodes.doughnut.geometry}
        material={materials["Material.003"]}
      />
      <mesh
        geometry={nodes.sugar.geometry}
        material={materials["Material.002"]}
      />
      <mesh
        geometry={nodes.paticle.geometry}
        material={materials["Material.001"]}
      />
    </group>
  );
};

const Boxes = () => {
  let boxList = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const position = [col + col * gutter.size, 0, row + row * gutter.size];
      boxList.push({
        position,
      });
    }
  }
  return boxList.map((props, index) => <Box key={index} {...props} />);
};

const Texts = () => {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 9, 0]}>
      <Text fontSize={2} font='/fonts/Oduda-Bold.otf' position={[0, 1, 0]} color={'red'}>
          DUNKIN
      </Text>
      <Text fontSize={2} font='/fonts/Oduda-Bold.otf' position={[0, -1, 0]} color={'hotpink'}>
          DONUTS
      </Text>
    </group>
  )
}

function App() {
  return (
    <>
      <Canvas
        dpr={1.5}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        camera={{
          position: [0, 45, 0],
          fov: 15,
        }}
      >
        <Light />
        <color attach={"background"} args={["#edccbe"]} />

        <Suspense fallback={null}>
          {/* <Floor /> */}
          <group position={[-centerX, 0, -centerZ]}>
            <Boxes />
          </group>
        </Suspense>

        {/* <axesHelper args={[10]} /> */}
        {/* <gridHelper args={[10, 10]} /> */}

        <Texts />

        {/* <OrbitControls /> */}

        <Environment preset="city" />

      </Canvas>
    </>
  );
}

export default App;
