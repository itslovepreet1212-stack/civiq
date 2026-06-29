import { useState, useEffect } from "react";
import { Sparkles, Loader2, TrendingUp, MapPin, AlertTriangle, Lightbulb, Target, Brain } from "lucide-react";
import { generateCityInsights } from "../utils/gemini";
import { useIssues } from "../hooks/useIssues";
import toast from "react-hot-toast";

export default function Insights() {
  const { issues } = useIssues();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agentActive, setAgentActive] = useState(false);

  const generate = async () => {
    if (issues.length === 0) { toast.error("No issues to analyse yet."); return; }
    setLoading(true);
    setAgentActive(true);
    try {
      const data = await generateCityInsights(issues);
      setInsights(data);
      setTimeout(() => setAgentActive(false), 3000);
    } catch {
      toast.error("AI analysis failed. Try again.");
      setAgentActive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (issues.length > 0 && !insights && !loading) generate(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [issues.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const cards = insights ? [
    { icon: <MapPin size={16} />, label: "Most Urgent Area", value: insights.most_urgent_area, color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.18)" },
    { icon: <TrendingUp size={16} />, label: "Top Pattern", value: insights.top_pattern, color: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.18)" },
    { icon: <Target size={16} />, label: "Hotspot Category", value: insights.hotspot_category, color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.18)" },
    { icon: <Lightbulb size={16} />, label: "Recommendation", value: insights.recommendation, color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.18)" },
    { icon: <AlertTriangle size={16} />, label: "Prediction", value: insights.prediction, color: "#22d3ee", bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.18)" },
  ] : [];

  return (
    <div className="min-h-screen pt-[58px] relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-12">
          <p className="eyebrow mb-2">AI Analysis</p>
          <h1 className="text-[36px] font-black tracking-tightest mb-4">City Pulse</h1>
          <p className="text-[14px] text-white/38 leading-relaxed">
            Gemini analyses all reported issues and surfaces patterns, predictions, and actionable recommendations for authorities.
          </p>
        </div>

        {agentActive && (
          <div
            className="glass rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.2)" }}
          >
            <Brain size={16} className="text-violet-light shrink-0" />
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-violet-light">AI Agent Active</p>
              <p className="text-[11px] text-white/40">
                {loading ? "Running city-wide pattern analysis..." : "Monitoring live reports for emerging trends"}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-violet-light animate-pulse" />
          </div>
        )}

        <div className="glass rounded-2xl p-8 text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 0 40px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-[18px] font-black tracking-tight mb-2">
            {insights ? "Regenerate Insights" : "Generate City Insights"}
          </h2>
          <p className="text-[13px] text-white/35 mb-6 max-w-sm mx-auto">
            Analyses {issues.length} reported issue{issues.length !== 1 ? "s" : ""} and surfaces patterns across your city.
          </p>
          <button onClick={generate} disabled={loading} className="btn-primary mx-auto">
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Analysing…</>
            ) : (
              <><Sparkles size={15} /> Analyse Now</>
            )}
          </button>
        </div>

        {insights && (
          <div className="flex flex-col gap-4">
            {cards.map((c) => (
              <div
                key={c.label}
                className="glass glass-hover rounded-2xl p-6 flex items-start gap-4"
                style={{ borderColor: c.border, background: c.bg }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${c.bg}`, border: `0.5px solid ${c.border}` }}
                >
                  <span style={{ color: c.color }}>{c.icon}</span>
                </div>
                <div className="relative z-10">
                  <p className="text-[11px] font-semibold mb-1" style={{ color: c.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {c.label}
                  </p>
                  <p className="text-[14px] text-white/80 leading-relaxed">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
