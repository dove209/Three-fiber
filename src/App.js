import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './pages/Header';


import FlyingDoughnut from "./pages/Flying_Doughnut";
import CameraPan from './pages/CameraPan';
import Ballpit from './pages/Ballpit';
import Confetti from './pages/Confetti';
import DreiVideoTexture from './pages/DreiVideoTexture';
import HorizontalTiles from './pages/HorizontalTiles';
import HtmlAnnotation from './pages/HtmlAnnotation';
import ImageGallery from './pages/ImageGallery';
import InfiniteScroll from './pages/InfiniteScroll';
import RedBallClump from './pages/RedBallClump';
import SoftShadows from './pages/SoftShadows';
import SpiralStair from './pages/SpiralStair';
import TossInternship from './pages/TossInternship';
import WobbleSphere from './pages/WobbleSphere';
import EnvironmentBlur from "./pages/EnvironmentBlur";


const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<FlyingDoughnut />} />
        <Route path="/camera-pan" element={<CameraPan />} />
        <Route path="/ball-pit" element={<Ballpit />} />
        <Route path="/confetti" element={<Confetti />} />
        <Route path="/Drei-videoTexture" element={<DreiVideoTexture />} />
        <Route path="/horizontal-tiles" element={<HorizontalTiles />} />
        <Route path="/html-annotation" element={<HtmlAnnotation />} />
        <Route path="/image-gallery" element={<ImageGallery />} />
        <Route path="/infinite-scroll" element={<InfiniteScroll />} />
        <Route path="/red-ball-clump" element={<RedBallClump />} />
        <Route path="/soft-shadows" element={<SoftShadows />} />
        <Route path="/spiral-stair" element={<SpiralStair />} />
        <Route path="/toss-internship" element={<TossInternship />} />
        <Route path="/wobble-sphere" element={<WobbleSphere />} />
        <Route path='/environment-blur-transition' element={<EnvironmentBlur />} />
      </Routes>
    </BrowserRouter>

  )
};

export default App;