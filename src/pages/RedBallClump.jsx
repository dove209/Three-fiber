import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Physics, useSphere } from '@react-three/cannon';
import { OrbitControls, Sky, Environment, Effects as EffectComposer, useTexture } from '@react-three/drei';
import { SSAOPass } from 'three-stdlib';

extend({ SSAOPass })

const rfs = THREE.MathUtils.randFloatSpread;
const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 'red', roughness:0, envMapIntensity:0.2, emissive: '#370037'})

const Balls = ({ count = 40, mat = new THREE.Matrix4(), vec = new THREE.Vector3() }) => {
  const textrue = useTexture('/image/cross.jpg');
  const [ref, api] = useSphere(() => ({ 
    args: [1],
    mass:1,
    angularDamping:0.1,
    linearDamping:0.65,
    position:[rfs(20), rfs(20), rfs(20)]
  }));

  useFrame(() => {
    for(let i = 0; i < count; i++) {
      // Get current whereabouts of the instanced sphere;
      ref.current.getMatrixAt(i, mat);
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-50).toArray(), [0, 0, 0])
    }
  })
  return(
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[null, null, count]}
      geometry = {sphereGeometry}
      material = {material}
      material-map = {textrue}
    />
  )
}


const Mouse = () => {
  const { viewport: {width, height} } = useThree();
  const [_, api] = useSphere(() => ({
    args: [3],
    position: [0, 0, 0]
  }))
  useFrame((state) => {
    api.position.set(state.mouse.x * width / 2, state.mouse.y * height / 2, 0)
  })
  return null;
}


function App() {
  return (
    <Canvas
      shadows
      dpr={[1,2]}
      camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
    >
      <ambientLight intensity={0.25} />
      <spotLight
        intensity={1}
        angle={0.2}
        penumbra={1}
        position={[30, 30, 30]}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight intensity={5} position={[-10, -10, -10]} color='purple' />
      
      <Environment files={'/image/adamsbridge.hdr'} />
      <Sky />
      <Effects />

      <Physics gravity={[0, 2, 0]} iterations={10} >
        <Balls />
        <Mouse />
      </Physics>

      {/* <axesHelper />
      <OrbitControls makedefault /> */}
    </Canvas>
  );
}

const Effects = () => {
  const { scene, camera } = useThree();
  return(
    <EffectComposer>
      <sSAOPass args={[scene, camera, 100, 100]} kernelRadius={1.2} kernelSize={0} />
    </EffectComposer>
  )
}



export default App;
