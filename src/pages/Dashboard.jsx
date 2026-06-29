import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, Plus, LayoutDashboard, FileText, Download } from "lucide-react";
import { useIssues } from "../hooks/useIssues";
import IssueCard from "../components/IssueCard";
import SmartMonitor from "../components/SmartMonitor";
import ImpactMetrics from "../components/ImpactMetrics";
import ButterflyTimeline from "../components/ButterflyTimeline";
import DispatchAgent from "../components/DispatchAgent";
import { generatePDFReport } from "../utils/pdfReport";

const STATUSES = ["All","Reported","Verified","In Progress","Resolved"];
const CATS = ["All","Pothole","Garbage","Broken Streetlight","Water Leakage","Open Drain","Damaged Road","Other"];

export default function Dashboard() {
  const { issues, loading, refetch } = useIssues();
  const [status, setStatus] = useState("All");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener("nagarai-issue-updated", handler);
    return () => window.removeEventListener("nagarai-issue-updated", handler);
  }, [refetch]);

  const filtered = issues.filter((i) => {
    return (status === "All" || i.status === status) && (cat === "All" || i.category === cat);
  });

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "Reported").length,
    verified: issues.filter((i) => i.status === "Verified").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen pt-[58px] relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-12 flex-wrap gap-8">
          <div>
            <p className="eyebrow mb-2">Community Overview</p>
            <h1 className="text-[30px] font-black tracking-tight">Issues Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => generatePDFReport(issues)}
              disabled={issues.length === 0}
              className="btn-ghost text-[13px] flex items-center gap-2"
            >
              <FileText size={14} />
              <Download size={14} />
              Export PDF
            </button>
            <Link to="/report" className="btn-primary text-[13px]">
              <Plus size={14} /> Report Issue
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {[
            { label: "Total Issues", val: stats.total, color: "text-white" },
            { label: "Pending",       val: stats.pending,  color: "text-amber" },
            { label: "Verified",      val: stats.verified, color: "text-violet-light" },
            { label: "Resolved",      val: stats.resolved, color: "text-green" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className={`stat-num ${s.color} relative z-10`}>{s.val}</div>
              <div className="eyebrow mt-1 relative z-10">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Impact Metrics */}
        <ImpactMetrics issues={issues} />

        {/* Smart Monitor */}
        <SmartMonitor issues={issues} />

        {/* Agent Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <DispatchAgent issues={issues} />
          <ButterflyTimeline issues={issues} />
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-center">
          <Filter size={13} className="text-white/28 shrink-0" />
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
                style={
                  status === s
                    ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }
                }
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ width: "0.5px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
                style={
                  cat === c
                    ? { background: "rgba(168,85,247,0.2)", color: "#c084fc", border: "0.5px solid rgba(168,85,247,0.3)" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.28)" }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="glass rounded-2xl h-44" style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-16 text-center">
            <LayoutDashboard size={28} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/25 text-[14px]">No issues match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
