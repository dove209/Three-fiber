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
const SurfaceSampling = lazy(() => import('./pages/SurfaceSampling'));
const SpiritOfRhythm = lazy(() => import('./pages/SpiritOfRhythm'));

// GLSL Ex
const Mosaic = lazy(() => import('./pages/shaderEx/Mosaic'));
const NoiseEffect = lazy(() => import('./pages/shaderEx/NoiseEffect'));
const WaveEffect = lazy(() => import('./pages/shaderEx/WaveEffect'));
const FadeMaterial = lazy(() => import('./pages/shaderEx/FadeMaterial'));
const GooeyHoverEffect = lazy(() => import('./pages/shaderEx/GooeyHoverEffect'));

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<div className="loading">이동중...</div>}>
        <Routes>
          <Route path="/" element={<EnvironmentBlur />} />
          <Route path="/flying-doughnut" element={<FlyingDoughnut />} />
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
          <Route path="/surface-sampling" element={<SurfaceSampling />} />
          <Route path="/spirit-of-rhythm" element={<SpiritOfRhythm />} />


          {/* GLSL Ex */}
          <Route path="/mosaic" element={<Mosaic />} />
          <Route path="/noise-effect" element={<NoiseEffect />} />
          <Route path="/wave-effect" element={<WaveEffect />} />
          <Route path="/fade-material" element={<FadeMaterial />} />
          <Route path="/gooey-hover" element={<GooeyHoverEffect />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
