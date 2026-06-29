import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import MeshBackground from "./components/MeshBackground";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import MapView from "./pages/MapView";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SmoothScroll>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#13131a",
                color: "#fff",
                border: "0.5px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "13px",
                fontFamily: "Satoshi, sans-serif",
                fontWeight: 500,
              },
            }}
          />
          <MeshBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </SmoothScroll>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
