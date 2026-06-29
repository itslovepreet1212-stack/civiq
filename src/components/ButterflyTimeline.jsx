import { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";

const STAGES = [
  { day: 0, label: "Issue Reported", severity: "Minor", color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
  { day: 7, label: "Community Verified", severity: "Moderate", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
  { day: 14, label: "Infrastructure Weakens", severity: "Noticeable", color: "#f97316", bg: "rgba(249,115,22,0.08)" },
  { day: 30, label: "Public Hazard Develops", severity: "High", color: "#f87171", bg: "rgba(248,113,113,0.08)" },
  { day: 60, label: "Cascading Failure", severity: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  { day: 90, label: "Systemic Urban Decay", severity: "Emergency", color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
];

export default function ButterflyTimeline({ issues }) {
  const [expanded, setExpanded] = useState(false);

  const criticalIssues = useMemo(
    () => issues.filter((i) => i.severity >= 7).slice(0, 3),
    [issues]
  );

  if (criticalIssues.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber" />
          <span className="text-[11px] font-semibold text-amber tracking-wide uppercase">
            Butterfly Effect Timeline
          </span>
          <span className="text-[10px] text-white/30 font-mono">
            {criticalIssues.length} issues at risk
          </span>
        </div>
        <ChevronRight
          size={14}
          className="text-white/30 transition-transform"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="mt-5 space-y-5">
          {criticalIssues.map((issue) => (
            <div key={issue.id}>
              <p className="text-[12px] font-bold text-white/80 mb-3">{issue.title}</p>
              <div className="relative">
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-0.5"
                  style={{ background: "linear-gradient(180deg, #4ade80, #dc2626)" }}
                />
                <div className="flex flex-col gap-3">
                  {STAGES.map((stage, i) => (
                    <div key={stage.day} className="flex items-start gap-3 relative">
                      <div
                        className="w-[23px] h-[23px] rounded-full flex items-center justify-center shrink-0 z-10"
                        style={{
                          background: i === 0 ? stage.bg : STAGES[i - 1].bg,
                          border: `1.5px solid ${stage.color}`,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: stage.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold" style={{ color: stage.color }}>
                            {stage.label}
                          </span>
                          <span className="text-[9px] font-mono text-white/25">
                            Day {stage.day}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30">
                          Severity: {stage.severity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {issue._aiInsights?.butterfly && (
                <div
                  className="mt-3 p-3 rounded-xl text-[11px] italic leading-relaxed"
                  style={{
                    background: "rgba(251,191,36,0.06)",
                    border: "0.5px solid rgba(251,191,36,0.15)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  "{issue._aiInsights.butterfly}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
