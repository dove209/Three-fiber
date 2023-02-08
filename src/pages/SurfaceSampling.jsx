import React, { useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const count = 15000;
  
const Elephant = () => {
  const { scene } = useThree();
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, "/model/elephant.glb");
  const textrue = useTexture('/texture/dotTexture.png');
  const elephant = gltf.scene.children[0];
  
  const sampler = new MeshSurfaceSampler(elephant).build();

  const vertices = []; // 각각 파티클들의 좌표 저장
  const colors = [];   // 각각 파티클들의 색상 저장
  const tempPosition = new THREE.Vector3(); // sampler에서 랜덤으로 추출할 좌표 벡터
  const pointesGeometry = new THREE.BufferGeometry();
  

  // 매 프레임마다 점을 찍는다.
  const palette = [
    new THREE.Color('#FAAD80'),
    new THREE.Color('#FF6767'),
    new THREE.Color('#FF3D68'),
    new THREE.Color('#A73489')
  ]
  const addPoint = () => {
    /* Update the position attribute with the new coordinates */
    sampler.sample(tempPosition);
    vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
    pointesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    /* Update the color attribute with the new colors */
    const color = palette[Math.floor(Math.random() * palette.length)];
    colors.push(color.r, color.g, color.b);
    pointesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  };


// Animate a growing path
/**
 * 1. 라인의 정점들을 저장할 배열을 만든다
 * 2. surface에서 임의의 점을 선택하여 시작하고 배열에 추가한다.
 * 3. 다른 임의의 점은 선택하고 이전 점과의 거리를 확인한다.
 *  3-1. 만약 그 거리가 충분히 짧으면 4번 단계로 이동한다.
 *  3-2. 만약 그 거리가 너무 멀면, 충분히 가까운 지점을 찾을때까지 3번 단계를 반복한다.
 * 4. 새로운 점의 좌표를 배열에 추가한다.
 * 5. 라인 지오메트리를 Update 하고 render 한다.
 * 6. 3~5번 단계를 반복하여 매 프레임마다 라인이 grow하게 해준다.
 */

  let paths = []; // growing path 덩어리
  const materials = [
      new THREE.LineBasicMaterial({color: '#FAAD80', transparent: true, opacity: 0.5}),
      new THREE.LineBasicMaterial({color: '#FF6767', transparent: true, opacity: 0.5}),
      new THREE.LineBasicMaterial({color: '#FF3D68', transparent: true, opacity: 0.5}),
      new THREE.LineBasicMaterial({color: '#A73489', transparent: true, opacity: 0.5})
  ];
      
  class Path {
      constructor(index) {
          this.geometry = new THREE.BufferGeometry();
          this.material = materials[index];
          this.line = new THREE.Line(this.geometry, this.material);
          this.vertices = []; // 라인의 모든 정점들 

          // 라인의 첫번째 sample point
          sampler.sample(tempPosition);
          this.prevPoint = tempPosition.clone();
      }
      update() {
          let pointFound = false;
          while (!pointFound) {
              sampler.sample(tempPosition);
              if (tempPosition.distanceTo(this.prevPoint) < 30) {
                  this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
                  this.prevPoint = tempPosition.clone();
                  pointFound = true;
              }
          }
          this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
      }
  }

  
  const groupPathElephant = new THREE.Group();
  groupPathElephant.position.x = 120;
  for (let i = 0;i < materials.length; i++) {
    const path = new Path(i);
    paths.push(path);
    groupPathElephant.add(path.line);
  }

  scene.add(groupPathElephant);


  useFrame(() => {
    ref.current.rotation.y += 0.002;
    groupPathElephant.rotation.y -= 0.002;
    if (vertices.length < count) {
        addPoint();
        addPoint();
    }
    paths.forEach(path => {
        // 10,000 points 도달하면 멈춤
        if (path.vertices.length < 10000 * 3) {
            path.update()
        }
    })
  })


  return (
    <group ref={ref} position={[-120, 0, 0]}>
      <points args={[pointesGeometry]}>
        <pointsMaterial
            size={3}
            alphaTest={0.2}
            map={textrue}
            vertexColors={true}
        />
      </points>
    </group>
  );
};



const SurfaceSampling = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 100, 230],
      }}
    >
      <color attach="background" args={["#fdf5e6"]} />
      <Elephant />
      <OrbitControls />
    </Canvas>
  );
};

export default SurfaceSampling;