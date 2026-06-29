import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, FileText, TrendingUp, MapPin, ChevronRight } from "lucide-react";
import { useIssues } from "../hooks/useIssues";
import IssueCard from "../components/IssueCard";

const TICKER_ITEMS = [
  "Gemini Vision Analysis", "Community Verification", "Auto Complaint Letters",
  "Predictive City Insights", "Real-time Tracking", "Gamified Civic Action",
  "Impact Dashboard", "AI Issue Routing", "Severity Scoring",
];

const STATS = [
  { num: "1,240+", label: "Issues Reported", color: "#a5b4fc", accent: "linear-gradient(90deg,#6366f1,#8b5cf6)" },
  { num: "847",    label: "Resolved",          color: "#4ade80", accent: "linear-gradient(90deg,#22c55e,#10b981)" },
  { num: "32",     label: "Active Cities",     color: "#22d3ee", accent: "linear-gradient(90deg,#06b6d4,#6366f1)" },
  { num: "5.6K+",  label: "Community Heroes",  color: "#d8b4fe", accent: "linear-gradient(90deg,#a855f7,#ec4899)" },
];

const FEATURES = [
  {
    icon: <Zap size={18} />,
    iconBg: "rgba(99,102,241,0.15)",
    iconColor: "#818cf8",
    iconGlow: "rgba(99,102,241,0.25)",
    title: "Gemini Vision",
    desc: "Upload a photo — AI instantly identifies issue type, severity score, and routes to the right department.",
    accent: "rgba(99,102,241,0.18)",
    featured: true,
  },
  {
    icon: <Users size={18} />,
    iconBg: "rgba(74,222,128,0.12)",
    iconColor: "#4ade80",
    iconGlow: "rgba(74,222,128,0.2)",
    title: "Community Proof",
    desc: "Neighbours confirm issues. 5+ confirmations auto-escalate to Verified status.",
  },
  {
    icon: <FileText size={18} />,
    iconBg: "rgba(168,85,247,0.15)",
    iconColor: "#c084fc",
    iconGlow: "rgba(168,85,247,0.25)",
    title: "Auto Letter",
    desc: "One tap. Gemini drafts a formal complaint to the right municipal authority.",
  },
  {
    icon: <TrendingUp size={18} />,
    iconBg: "rgba(34,211,238,0.12)",
    iconColor: "#22d3ee",
    iconGlow: "rgba(34,211,238,0.2)",
    title: "City Pulse",
    desc: "AI detects deteriorating zones and predicts the next urban hotspot before it worsens.",
  },
];

function CountUp({ target, duration = 1200 }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const num = parseFloat(target.replace(/[^0-9.]/g, ""));
      const suffix = target.replace(/[0-9.,]/g, "");
      const steps = 40;
      let i = 0;
      const interval = setInterval(() => {
        i++;
        const val = Math.round((num / steps) * i);
        setDisplay(val.toLocaleString() + suffix);
        if (i >= steps) { clearInterval(interval); setDisplay(target); }
      }, duration / steps);
      observer.disconnect();
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{display}</span>;
}

export default function Home() {
  const { issues, loading, refetch } = useIssues();
  const recent = issues.slice(0, 3);

  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener("nagarai-issue-updated", handler);
    return () => window.removeEventListener("nagarai-issue-updated", handler);
  }, [refetch]);

  return (
    <div className="min-h-screen pt-[58px] relative">
      {/* ── HERO ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "0.5px solid rgba(99,102,241,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 10px rgba(99,102,241,0.6)" }}
          >
            <Zap size={10} className="text-white" />
          </span>
          <span className="text-[11px] font-semibold text-violet-light tracking-wide">
            Civic Intelligence &middot; Powered by Gemini
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-black leading-[1.05] tracking-tightest mb-5"
          style={{ fontSize: "clamp(36px, 7vw, 64px)" }}
        >
          <span className="block text-white/90">Your city breaks.</span>
          <span className="block text-grad">Civiq fixes it.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[15px] md:text-[16px] text-white/40 leading-[1.75] max-w-[480px] mx-auto mb-12 font-light px-4 md:px-0"
        >
          Report broken infrastructure with a photo. AI analyses it, your community confirms it, authorities resolve it &mdash; every step tracked, nothing lost.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16 px-6 sm:px-0"
        >
          <Link to="/report" className="btn-primary text-[14px] w-full sm:w-auto justify-center">
            <MapPin size={15} />
            Report an Issue
            <ArrowRight size={14} />
          </Link>
          <Link to="/dashboard" className="btn-ghost text-[14px] w-full sm:w-auto justify-center">
            View Dashboard
            <ChevronRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div
        className="relative z-10 overflow-hidden"
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
          borderBottom: "0.5px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(8px)",
          padding: "10px 0",
        }}
      >
        <div
          className="flex gap-0 w-max"
          style={{ animation: "ticker 22s linear infinite" }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-8">
              <span
                className="w-1 h-1 rounded-full animate-pulse-dot"
                style={{ background: "#6366f1" }}
              />
              <span className="text-[11px] font-medium text-white/25 whitespace-nowrap tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
        <style>{`@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
      </div>

      {/* ── STATS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass glass-hover rounded-2xl p-5 accent-bar"
              style={{ "--accent": s.accent }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1.5px] rounded-t-2xl"
                style={{ background: s.accent }}
              />
              <div
                className="stat-num mb-1 relative z-10 text-[24px] md:text-[32px]"
                style={{ color: s.color }}
              >
                <CountUp target={s.num} />
              </div>
              <div className="eyebrow relative z-10">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow mb-2">How it works</p>
          <h2 className="text-[24px] md:text-[32px] font-black tracking-tight mb-8 leading-tight">
            Built for action, <br className="md:hidden"/> not just reporting
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={f.title}
              className="glass glass-hover rounded-2xl p-6 relative"
              style={
                f.featured
                  ? { borderColor: "rgba(99,102,241,0.22)", background: "rgba(99,102,241,0.04)" }
                  : {}
              }
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative z-10"
                style={{
                  background: f.iconBg,
                  boxShadow: `0 0 20px ${f.iconGlow}`,
                }}
              >
                <span style={{ color: f.iconColor }}>{f.icon}</span>
              </div>
              <p className="text-[15px] font-bold mb-2 text-white/90 relative z-10">{f.title}</p>
              <p className="text-[13px] text-white/40 leading-relaxed relative z-10">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── RECENT ISSUES ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="eyebrow mb-1">Live Feed</p>
            <h2 className="text-[20px] md:text-[22px] font-black tracking-tight">Recent Reports</h2>
          </div>
          <Link
            to="/dashboard"
            className="text-[11px] md:text-[13px] font-semibold text-violet-light px-3 py-2 rounded-lg transition-colors"
            style={{
              border: "0.5px solid rgba(99,102,241,0.2)",
              background: "rgba(99,102,241,0.06)",
            }}
          >
            View All &rarr;
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass rounded-2xl h-44"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : recent.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recent.map((issue) => (
              <IssueCard key={issue.id} issue={issue} compact />
            ))}
          </motion.div>
        ) : (
          <div className="glass rounded-2xl p-14 text-center">
            <MapPin size={28} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-[14px] mb-4">No reports yet. Be the first.</p>
            <Link to="/report" className="btn-primary text-[13px] inline-flex">
              Report an Issue
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
