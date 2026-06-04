import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HelpFunnel from './pages/HelpFunnel';
import Chiropractor from './pages/Chiropractor';
import Towing from './pages/Towing';
import BodyShop from './pages/BodyShop';
import HeatMap from './pages/HeatMap';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<HelpFunnel />} />
        <Route path="/chiropractor" element={<Chiropractor />} />
        <Route path="/towing" element={<Towing />} />
        <Route path="/body-shop" element={<BodyShop />} />
        <Route path="/bodyshop" element={<BodyShop />} />
        <Route path="/heatmap" element={<HeatMap />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
