import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import NasaEyesEmbed from "./NasaEyesEmbed";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nasa-eyes" element={<NasaEyesEmbed />} />
      </Routes>
    </Router>
  );
}
