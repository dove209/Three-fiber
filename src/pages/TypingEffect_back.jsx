/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-concat */
import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Instances, Instance } from "@react-three/drei";
import { useLayoutEffect } from "react";

// Settings
const fontName = "Verdana";
const textureFontSize = 25;
const fontScaleFactor = 0.2;

// String to show
let textureCoordinates = []; // Coordinates data per 2D canvas and 3D scene

// Parameters of whole string per 2D canvas and 3D scene
let stringBox = {
  wTexture: 0,
  hTexture: 0,
  wScene: 0,
  hScene: 0,
  wCaret: 0, // 커서의 X 위치
};


const TextInput = styled.textarea`
  position: fixed;
  top:0;
  left: 0;
  height: 100px;
  z-index: 999999;
  border: none;
  /* font: 100 25px Verdana; */
  &:focus {
    outline: none;
  }
`

const TextCanvas = ({ string }) => {
  const ref = useRef();
  // const { camera } = useThree();
  
  useEffect(() => {
    const textCanvas = ref.current;
    const textCtx = textCanvas.getContext('2d');

    // Parse Text 
    const lines = string.split('\n');
    const linesMaxLength = [...lines].sort((a,b) => b.length - a.length)[0].length;
    stringBox.wTexture = textureFontSize * linesMaxLength ;
    stringBox.hTexture = lines.length * textureFontSize * 1.2;   
    stringBox.wScene = stringBox.wTexture * fontScaleFactor;
    stringBox.hScene = stringBox.hTexture * fontScaleFactor;

    // Draw Text (TextCanvas에 Text 그리기)
    const linesNumber = lines.length;
    textCanvas.width = stringBox.wTexture;
    textCanvas.height = stringBox.hTexture;
    textCtx.font = `100 ${textureFontSize}px ${fontName}`;
    textCtx.fillStyle = '#2a9d8f';
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (let i = 0; i < linesNumber; i++) {
      // if (i === linesNumber-1) {
      //   lines[i] = lines[i].replace('|','');
      // }
      textCtx.fillText(
        lines[i],
        0,
        ((i + 0.8) * stringBox.hTexture) / linesNumber
      );
    }


    // Sample coordinate(TextCanvas의 Text들의 좌표 추출)
    textureCoordinates = [];
    if (stringBox.wTexture > 0) {
      const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
      for (let i = 0; i < textCanvas.height; i++) {
        for (let j = 0; j < textCanvas.width; j++) {
          // R채널이 0인지 체킹한다. 왜냐하면 배경 RGBA(0,0,0,0) 이니까.
          if (imageData.data[(j + i * textCanvas.width) * 4] > 0) {
            textureCoordinates.push({
              x: j,
              y: i
            })
          }
        }
      }
    }

    // Scaling factor
    textureCoordinates = textureCoordinates.map(c => {
      return {
        x: c.x * fontScaleFactor,
        y: c.y * fontScaleFactor
      }
    })

    // 커서의 위치는 w: 마지막줄 텍스트 길이 h: hScene과 같음
    if (lines[lines.length - 1].length > 0) {

    } else {
    }

    stringBox.wCaret = lines[lines.length - 1].length * textureFontSize * fontScaleFactor;
  },[string])


  return (
    <canvas
      ref={ref}  
      style={{display:'none'}}
    />
  )
}


const Particles = () => {
  const { scene } = useThree();


  return (
    // 가운데로 Position 이동
    <Instances name={'test'} limit={10000} position={[-0.5 * stringBox.wScene, -0.5 * stringBox.hScene, 0]}>
      <torusGeometry args={[0.1, 0.05, 16, 50 ]} />
      <meshNormalMaterial/>
      {textureCoordinates.map((data, idx) => (
        <Particle key={idx} {...data} />
      ))}
    </Instances>
  )
}


const Particle = ({ x, y }) => {
  return (
    <Instance 
      position={[x, stringBox.hScene - y, 0]} 
      rotation={[2 * Math.random(), 2 * Math.random(), 2 * Math.random()]}
    />
  )
}

const Caret = () => {
  console.log(stringBox)
  console.log(stringBox.wCaret - (stringBox.wScene / 2) )

  return (
    <mesh 
      position={[stringBox.wCaret - (stringBox.wScene / 2) , stringBox.hScene * -0.5 + 2.5, 0]}>
      <boxBufferGeometry args={[0.3, 4.5, 0.03]}/>
      <meshNormalMaterial />
    </mesh>
  )
}


const MakeTextFitScreen = ({ string }) => {
  const { camera } = useThree();
  useEffect(() => {
    const fov = camera.fov * (Math.PI / 180);
    const fovH = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const dx = Math.abs((0.55 * stringBox.wScene) / Math.tan(0.5 * fovH));
    const dy = Math.abs((0.55 * stringBox.hScene) / Math.tan(0.5 * fov));
    const factor = Math.max(dx, dy) / camera.position.length();
    if (factor > 1) {
      camera.position.x *= factor;
      camera.position.y *= factor;
      camera.position.z *= factor;
    }
  },[string])
  return
}

const App = () => {
  const [ string, setString ] = useState("안녕\n도넛");
  const handleString = (e) => {
    e.preventDefault()
    setString(e.target.value)
  }

  return (
    <>
      <TextInput
        value={string}
        onChange={handleString}
      />
      <TextCanvas string={string} />
      <Canvas
        dpr={[1,2]}
        gl={{ alpha: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position:[0, 0, 18]
        }}
      > 
          <color attach={'background'} args={['#eee']} />
          <Particles />
          <Caret />
          <MakeTextFitScreen string={string} />
        <OrbitControls />
        <axesHelper />
      </Canvas>
    </>
  );
};

export default App;
