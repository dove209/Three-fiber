/* eslint-disable no-unused-vars */
import React, { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Loader,
  Environment,
  useCursor,
  useGLTF,
  Text,
  OrbitControls,
  Merged,
} from "@react-three/drei";
import gsap from "gsap";
import { Stats } from './Stats';

const { innerWidth: width, innerHeight: height } = window;
let gutter = { 
  size: width > 500 ? 1.2 : 0.8
};
let grid = { 
  cols: Math.min(Math.ceil(width / 200) + (width < 500 ? 1 : 0), 10),
  rows: Math.min(Math.round(height / 200) + (width < 500 ? 1 : 0), 5)
};
// let grid = { cols: 1, rows: 1 };


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

// const Floor = () => {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]}>
//       <planeBufferGeometry args={[100, 100]} />
//       <meshStandardMaterial color={"#222"} envMapIntensity={0.5} />
//     </mesh>
//   );
// };


const Doughnut = ({ models, ...props }) => {
  const meshes = Object.keys(models).map(key => models[key]);
  const [active, setActive] = useState(false);
  useCursor(active);

  const ref = useRef(null);
  const {
    viewport: { width, height },
  } = useThree();

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
      {meshes.map((Mesh, index) => {
        return (
          <Mesh key={index} />
        )
      })}
    </group>
  );

};

useGLTF.preload("/model/doughnut.glb");
useGLTF.preload("/model/choco_doughnut.glb");
useGLTF.preload("/model/origin_doughnut.glb");
const Doughnuts = () => {
  const doughnut = useGLTF("/model/doughnut.glb");
  const choco_douhnut = useGLTF('/model/choco_doughnut.glb');
  const origin_doughnut = useGLTF("/model/origin_doughnut.glb");

  let doughnut_meshes = {}
  let choco_doughnut_meshes = {};
  let origin_doughnut_meshes = {};


  Object.keys(doughnut.nodes).forEach(key=> {
    const { type } = doughnut.nodes[key];
    if (type === 'Mesh') {
      doughnut_meshes = {
        ...doughnut_meshes,
        [key]: doughnut.nodes[key]
      }
    }
  })


  Object.keys(choco_douhnut.nodes).forEach(key=> {
    const { type } = choco_douhnut.nodes[key];
    if (type === 'Mesh') {
      choco_doughnut_meshes = {
        ...choco_doughnut_meshes,
        [key]: choco_douhnut.nodes[key]
      }
    }
  })

  Object.keys(origin_doughnut.nodes).forEach(key=> {
    const { type } = origin_doughnut.nodes[key];
    if (type === 'Mesh') {
      origin_doughnut_meshes = {
        ...origin_doughnut_meshes,
        [key]: origin_doughnut.nodes[key]
      }
    }
  })

  let propsArr = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const position = [col + col * gutter.size, 0, row + row * gutter.size];
      propsArr.push({
        position,
      });
    }
  }


  let originPosition = [];
  let berryPosition = [];
  let chocoPosition = [];
  for(let i = 0; i < propsArr.length; i += 3){
    originPosition.push(propsArr[i]);
    berryPosition.push(propsArr[i + 1]);
    chocoPosition.push(propsArr[i + 2]);
  }

  return (
    <>
      {/* 일반 도넛 */}
      <Merged meshes={origin_doughnut_meshes}>
        {(models) => (
          <group position={[-centerX, 0, -centerZ]}>
              {
                originPosition.map((props, index) => <Doughnut key={index} {...props} models={models} />)
              }
          </group>
        )}
      </Merged>
      {/* 딸기 도넛 */}
      <Merged meshes={doughnut_meshes}>
        {(models) => (
          <group position={[-centerX, 0, -centerZ]}>
              {
                berryPosition.map((props, index) => <Doughnut key={index} {...props} models={models} />)
              }
          </group>
        )}
      </Merged>

      {/* 초코 도넛 */}
      <Merged meshes={choco_doughnut_meshes}>
        {(models) => (
          <group position={[-centerX, 0, -centerZ]}>
              {
                chocoPosition.map((props, index) => <Doughnut key={index} {...props} models={models} />)
              }
          </group>
        )}
      </Merged>
  </>
  )
};


const Texts = () => {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 9, 0]}>
      <Text fontSize={width < 500 ? 1 : 2} font='/fonts/Oduda-Bold.otf' position={[0, width < 500 ? 0.5 : 1, 0]} color={'red'}>
          DUNKIN
      </Text>
      <Text fontSize={width < 500 ? 1 : 2} font='/fonts/Oduda-Bold.otf' position={[0, width < 500 ? -0.5 : -1, 0]} color={'hotpink'}>
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
          <Doughnuts />
        </Suspense>

        {/* <axesHelper args={[20]} /> */}
        {/* <gridHelper args={[100, 100]} /> */}

        <Texts />

        {/* <OrbitControls /> */}
        <Stats />
        <Environment preset="city" />
      </Canvas>
      <Loader />
    </>
  );
}

export default App;
