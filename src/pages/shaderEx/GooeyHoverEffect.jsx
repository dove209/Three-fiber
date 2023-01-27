/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
  Canvas,
  useFrame,
  extend,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";


const GooeyShaderMaterial = shaderMaterial(
  // Uniform
  {
    uImage: new THREE.Texture(),
    uImageHover: new THREE.Texture(),
    uMouse: new THREE.Vector2(),
    uTime: 0.0,
    uResolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    uPR: window.devicePixelRatio.toFixed(1),
  },
  // Vertex Shader
  glsl`
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  // Fragment Shader
  glsl`
        precision mediump float;
        
        varying vec2 vUv;

        uniform vec2 uMouse;
        uniform vec2 uResolution;
        uniform float uPR;
        uniform float uTime;
        uniform sampler2D uImage;
        uniform sampler2D uImageHover;

        #pragma glslify: snoise3 = require(glsl-noise/simplex/3d); 
    
        float circle(in vec2 _st, in float _radius, in float blurriness){
            vec2 dist = _st;
            return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
        }


        void main() {
            vec2 uv = vUv;
            vec2 res = uResolution * uPR;
            vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
        
            st.y *= uResolution.y / uResolution.x;

            vec2 mouse = uMouse * -0.5;

            vec2 circlePos = st + mouse;
            float c = circle(circlePos, .3, 2.) * 2.5;

            float offx = uv.x + sin(uv.y + uTime * .1);
            float offy = uv.y - uTime * 0.1 - cos(uTime * .001) * .01;

            float n = snoise3(vec3(offx, offy, uTime * .1) * 8.) - 1.;

            float finalMask = smoothstep(0.4, 0.5, n + pow(c, 2.));

            vec4 image = texture2D(uImage, uv);
            vec4 hover = texture2D(uImageHover, uv);

            vec4 finalImage = mix(image, hover, finalMask);

            gl_FragColor = finalImage;
        }
    `
);

extend({ GooeyShaderMaterial });

const Plane = () => {
  const ref = useRef(null);
  const shaderRef = useRef();

  const { mouse } = useThree();

  const [image, hoverImage] = useLoader(THREE.TextureLoader, [
    '/image/infinity_scroll/img1.jpg',
    '/image/infinity_scroll/img6.jpg',
  ]);

  const onMouseMove = () => {
    gsap.to(ref.current.rotation, 1, {
      x: -mouse.y * 0.3,
      y: mouse.x * (Math.PI / 6),
    });

    // shaderRef.current.uMouse = mouse;
    gsap.to(shaderRef.current.uMouse, 0.5, {
      x: mouse.x,
      y: mouse.y,
    });
  };

  useFrame(({ clock }) => {
    shaderRef.current.uTime = clock.getElapsedTime();
  });

  useEffect(() => {
    document.body.addEventListener("mousemove", onMouseMove);
    return () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[1, 1.5, 1, 1]} />
      <gooeyShaderMaterial
        ref={shaderRef}
        uImage={image}
        uImageHover={hoverImage}
      />
    </mesh>
  );
};

const App = () => {
  return (
      <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [0, 0, 2] }}>
        <ambientLight color={"#fff"} intensity={2} />

        <Plane />
      </Canvas>
  );
};

export default App;
