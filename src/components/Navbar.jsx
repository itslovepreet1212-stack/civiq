import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/map", label: "Map" },
  { to: "/insights", label: "Insights" },
  { to: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className="mx-auto px-6 h-[58px] flex items-center justify-between"
        style={{
          background: "rgba(6,6,9,0.75)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.03)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 0 20px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <MapPin size={14} className="text-white" />
          </div>
          <span
            className="text-[18px] font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #e0e7ff, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Civiq
          </span>
        </Link>

        {/* Nav pill (Desktop) */}
        <div
          className="hidden md:flex gap-2 p-1.5 rounded-[14px]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
          }}
        >
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className="text-[12px] font-semibold px-5 py-[6px] rounded-[10px] transition-all duration-200"
                style={
                  active
                    ? {
                        background: "rgba(99,102,241,0.18)",
                        color: "#a5b4fc",
                        border: "0.5px solid rgba(99,102,241,0.28)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }
                    : { color: "rgba(255,255,255,0.4)" }
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-5">
          <Link to="/report" className="btn-nav flex items-center gap-1.5 hidden md:flex">
            <Plus size={13} />
            Report Issue
          </Link>
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-[58px] left-0 right-0 p-4"
            style={{
              background: "rgba(6,6,9,0.95)",
              backdropFilter: "blur(24px) saturate(180%)",
              borderBottom: "0.5px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex flex-col gap-2">
              {links.map((l) => {
                const active = pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[14px] font-semibold px-4 py-3 rounded-[12px] transition-all duration-200"
                    style={
                      active
                        ? {
                            background: "rgba(99,102,241,0.18)",
                            color: "#a5b4fc",
                            border: "0.5px solid rgba(99,102,241,0.28)",
                          }
                        : { color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.02)" }
                    }
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                to="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-[14px] font-semibold px-4 py-3 rounded-[12px] text-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#fff",
                }}
              >
                Report Issue
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}