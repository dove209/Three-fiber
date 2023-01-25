import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./pages/Header";

const FlyingDoughnut = lazy(() => import("./pages/Flying_Doughnut"));
const CameraPan = lazy(() => import("./pages/CameraPan"));
const Ballpit = lazy(() => import("./pages/Ballpit"));
const Confetti = lazy(() => import("./pages/Confetti"));
const DreiVideoTexture = lazy(() => import("./pages/DreiVideoTexture"));
const HorizontalTiles = lazy(() => import("./pages/HorizontalTiles"));
const HtmlAnnotation = lazy(() => import("./pages/HtmlAnnotation"));
const ImageGallery = lazy(() => import("./pages/ImageGallery"));
const InfiniteScroll = lazy(() => import("./pages/InfiniteScroll"));
const RedBallClump = lazy(() => import("./pages/RedBallClump"));
const SoftShadows = lazy(() => import("./pages/SoftShadows"));
const SpiralStair = lazy(() => import("./pages/SpiralStair"));
const TossInternship = lazy(() => import("./pages/TossInternship"));
const WobbleSphere = lazy(() => import("./pages/WobbleSphere"));
const EnvironmentBlur = lazy(() => import("./pages/EnvironmentBlur"));
const TypingEffect = lazy(() => import('./pages/TypingEffect'));
const Mosaic = lazy(() => import('./pages/Mosaic'));
const NoiseEffect = lazy(() => import('./pages/NoiseEffect'));
const WaveEffect = lazy(() => import('./pages/WaveEffect'));
const FadeMaterial = lazy(() => import('./pages/FadeMaterial'));

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<div>...로딩중</div>}>
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
          <Route path="/environment-blur-transition" element={<EnvironmentBlur />} />
          <Route path="/3d-typing-effect" element={<TypingEffect />} />
          <Route path="/mosaic" element={<Mosaic />} />
          <Route path="/noise-effect" element={<NoiseEffect />} />
          <Route path="/wave-effect" element={<WaveEffect />} />
          <Route path="/fade-material" element={<FadeMaterial />} />
        

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
