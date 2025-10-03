import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NasaEyesEmbed from "./NasaEyesEmbed";
import ScientificPhysics from "./pages/ScientificPhysics";
import LiveNASAData from "./pages/LiveNASAData";
import AIRiskAnalyzer from "./pages/AIRiskAnalyzer";
import ImpactAnalysis from "./pages/ImpactAnalysis";
import TimeLapseSimulation from "./pages/TimeLapseSimulation";
import AftermathVisualization from "./pages/AftermathVisualization";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nasa-eyes" element={<NasaEyesEmbed />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/scientific-physics" element={<ScientificPhysics />} />
        <Route path="/live-nasa-data" element={<LiveNasaData />} />
      </Routes>
    </Router>
  );
}
