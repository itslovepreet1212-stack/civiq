import { useMemo } from "react";
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react";

const COST_PER_SEVERITY = { 1: 500, 2: 800, 3: 1200, 4: 2000, 5: 3500, 6: 5000, 7: 8000, 8: 12000, 9: 20000, 10: 35000 };
const HOURS_PER_SEVERITY = { 1: 1, 2: 2, 3: 3, 4: 5, 5: 8, 6: 12, 7: 18, 8: 24, 9: 36, 10: 48 };

export default function ImpactMetrics({ issues }) {
  const metrics = useMemo(() => {
    const resolved = issues.filter((i) => i.status === "Resolved");
    const totalCost = resolved.reduce((sum, i) => sum + (COST_PER_SEVERITY[i.severity] || 0), 0);
    const totalHours = resolved.reduce((sum, i) => sum + (HOURS_PER_SEVERITY[i.severity] || 0), 0);
    const co2Kg = Math.round(totalHours * 2.3);
    const communityScore = issues.length * 10 + resolved.length * 25;

    return { resolvedCount: resolved.length, totalCost, totalHours, co2Kg, communityScore };
  }, [issues]);

  if (issues.length === 0) return null;

  const cards = [
    {
      icon: <DollarSign size={16} />,
      label: "Estimated Cost Saved",
      value: `₹${(metrics.totalCost / 1000).toFixed(1)}K`,
      sub: `${metrics.resolvedCount} issues resolved`,
      color: "#4ade80",
      bg: "rgba(74,222,128,0.08)",
      border: "rgba(74,222,128,0.18)",
    },
    {
      icon: <Clock size={16} />,
      label: "Community Hours Saved",
      value: `${metrics.totalHours}h`,
      sub: "Cumulative repair time",
      color: "#818cf8",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.18)",
    },
    {
      icon: <TrendingUp size={16} />,
      label: "CO₂ Impact Prevented",
      value: `${metrics.co2Kg} kg`,
      sub: "Estimated emissions avoided",
      color: "#22d3ee",
      bg: "rgba(34,211,238,0.08)",
      border: "rgba(34,211,238,0.18)",
    },
    {
      icon: <Users size={16} />,
      label: "Community Impact Score",
      value: metrics.communityScore.toLocaleString(),
      sub: `${issues.length} total contributions`,
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.18)",
    },
  ];

  return (
    <div className="glass rounded-2xl p-5 mb-6">
      <p className="text-[11px] font-semibold text-white/30 tracking-wide uppercase mb-4">
        Real-World Impact
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl p-4"
            style={{ background: c.bg, border: `0.5px solid ${c.border}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: c.color }}>{c.icon}</span>
              <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: c.color }}>
                {c.label}
              </span>
            </div>
            <p className="text-[20px] font-black tracking-tight" style={{ color: c.color }}>
              {c.value}
            </p>
            <p className="text-[10px] text-white/30 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
