import { useMemo } from "react";
import { Brain, AlertTriangle, TrendingUp, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const NOW = Date.now();
const DAY_MS = 86400000;

export default function SmartMonitor({ issues }) {
  const alerts = useMemo(() => {
    if (issues.length === 0) return [];

    const critical = issues.filter((i) => i.severity >= 8);
    const categoryCount = {};
    issues.forEach((i) => {
      categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
    });
    const topEntry = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
    const recentHigh = issues.filter(
      (i) => i.severity >= 7 && new Date(i.created_at) > new Date(NOW - DAY_MS)
    );

    const result = [];
    if (critical.length >= 3) {
      result.push({
        type: "critical_mass",
        icon: <AlertTriangle size={14} />,
        color: "#f87171",
        bg: "rgba(248,113,113,0.08)",
        border: "rgba(248,113,113,0.2)",
        title: "Critical Mass Alert",
        message: `${critical.length} severe issues detected — immediate intervention required.`,
      });
    }
    if (recentHigh.length >= 2) {
      result.push({
        type: "rapid_deterioration",
        icon: <TrendingUp size={14} />,
        color: "#fbbf24",
        bg: "rgba(251,191,36,0.08)",
        border: "rgba(251,191,36,0.2)",
        title: "Rapid Deterioration",
        message: `${recentHigh.length} high-severity issues reported in the last 24 hours.`,
      });
    }
    if (topEntry && topEntry[1] >= 3) {
      result.push({
        type: "hotspot",
        icon: <MapPin size={14} />,
        color: "#818cf8",
        bg: "rgba(99,102,241,0.08)",
        border: "rgba(99,102,241,0.2)",
        title: "Category Hotspot",
        message: `${topEntry[0]} is the most reported category (${topEntry[1]} issues).`,
      });
    }
    if (issues.length >= 5 && critical.length === 0) {
      result.push({
        type: "stable",
        icon: <Shield size={14} />,
        color: "#4ade80",
        bg: "rgba(74,222,128,0.08)",
        border: "rgba(74,222,128,0.2)",
        title: "City Stable",
        message: "No critical issues detected. Community vigilance is working.",
      });
    }
    return result.slice(0, 3);
  }, [issues]);

  if (alerts.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={14} className="text-violet-light" />
        <span className="text-[11px] font-semibold text-violet-light tracking-wide uppercase">AI Smart Monitor</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-light animate-pulse" />
          <span className="text-[10px] text-white/30 font-mono">Active</span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.type}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{ background: alert.bg, border: `0.5px solid ${alert.border}` }}
          >
            <span className="shrink-0 mt-0.5" style={{ color: alert.color }}>{alert.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold" style={{ color: alert.color }}>{alert.title}</p>
              <p className="text-[11px] text-white/50 leading-relaxed">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/insights"
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-light hover:text-violet-light/80 transition-colors"
      >
        <Brain size={12} />
        View full AI analysis
      </Link>
    </div>
  );
}
