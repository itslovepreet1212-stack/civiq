import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ThumbsUp, MapPin, Mail, X, Copy, Check, Loader2, CheckCircle2 } from "lucide-react";
import { useIssues } from "../hooks/useIssues";
import { cn } from "../lib/utils";
import toast from "react-hot-toast";

// We use the existing utility to fetch from Gemini
import { generateComplaintLetter } from "../utils/gemini";
import ResolveModal from "./ResolveModal";

const EMOJI = {
  Pothole: "🕳️",
  Garbage: "🗑️",
  "Broken Streetlight": "💡",
  "Water Leakage": "💧",
  "Open Drain": "🚧",
  "Damaged Road": "🛣️",
  Other: "⚠️",
};

const STATUS = {
  Reported: { cls: "pill-yellow", dot: "#fbbf24" },
  Verified: { cls: "pill-violet", dot: "#818cf8" },
  "In Progress": { cls: "pill-blue", dot: "#22d3ee" },
  Resolved: { cls: "pill-green", dot: "#4ade80" },
};

function sevClass(s) {
  if (s >= 7) return "sev-high";
  if (s >= 4) return "sev-mid";
  return "sev-low";
}

function sevLabel(s) {
  if (s >= 8) return "Critical";
  if (s >= 6) return "High";
  if (s >= 4) return "Moderate";
  if (s >= 2) return "Low";
  return "Minimal";
}

const EMAIL_MAPPING = {
  "Pothole": "pwd.complaints@gov.in",
  "Damaged Road": "pwd.complaints@gov.in",
  "Garbage": "swachh.bharat@municipal.gov.in",
  "Broken Streetlight": "electricity.board@gov.in",
  "Water Leakage": "waterboard.complaints@gov.in",
  "Open Drain": "municipal.drainage@gov.in",
  "Other": "grievance@municipal.gov.in"
};

export default function IssueCard({ issue, compact = false }) {
  const { upvoteIssue } = useIssues();
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const status = STATUS[issue.status] || STATUS["Reported"];
  const emoji = EMOJI[issue.category] || "⚠️";

  useEffect(() => {
    if (showModal && !letter) {
      const fetchLetter = async () => {
        setLoading(true);
        try {
          const result = await generateComplaintLetter(issue);
          setLetter(result);
          // Automatically trigger mailto after generation (optional based on your prompt, but here we show the modal first so user can review)
        } catch {
          toast.error("Failed to generate letter. Try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchLetter();
    }
  }, [showModal, issue, letter]);

  const handleOpenEmail = () => {
    const authorityEmail = EMAIL_MAPPING[issue.category] || EMAIL_MAPPING["Other"];
    const subject = `Formal Complaint: ${issue.title} at ${issue.location}`;
    window.location.href = `mailto:${authorityEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(letter)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      toast.success("Letter copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      <div
        className="glass glass-hover rounded-2xl p-5 flex flex-col gap-3 cursor-default"
        style={{ borderRadius: "16px" }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">{emoji}</span>
            <div>
              <p className="text-[13px] font-bold leading-snug text-white/90 line-clamp-2">
                {issue.title}
              </p>
              <p className="text-[11px] text-white/35 mt-1 flex items-center gap-1">
                <MapPin size={9} />
                {issue.location}
              </p>
            </div>
          </div>
          <span className={cn("pill shrink-0", status.cls)}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: status.dot }}
            />
            {issue.status}
          </span>
        </div>

        {/* Description — only on full card */}
        {!compact && issue.description && (
          <p className="text-[12px] text-white/35 leading-relaxed line-clamp-2 relative z-10">
            {issue.description}
          </p>
        )}

        {/* Image */}
        {issue.image_url && (
          <img
            src={issue.image_url}
            alt="Issue"
            className="w-full h-32 object-cover rounded-xl relative z-10"
            style={{ border: "0.5px solid rgba(255,255,255,0.06)" }}
          />
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3 relative z-10"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <span className={cn("sev font-mono", sevClass(issue.severity))}>
              S{issue.severity}
            </span>
            <span className="text-[11px] text-white/28 font-mono">
              {sevLabel(issue.severity)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => upvoteIssue(issue.id)}
              className="flex items-center gap-1.5 text-[11px] text-white/28 hover:text-violet-light transition-colors px-2 py-1 rounded-lg hover:bg-violet-dim"
            >
              <ThumbsUp size={11} />
              <span className="font-mono font-semibold">{issue.upvotes || 0}</span>
              <span>confirms</span>
            </button>
            {!compact && issue.status !== "Resolved" && (
              <button
                onClick={() => setShowResolveModal(true)}
                className="flex items-center gap-1.5 transition-all"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "0.5px solid rgba(16,185,129,0.25)",
                  color: "#34d399",
                  borderRadius: "10px",
                  fontSize: "12px",
                  padding: "6px 14px"
                }}
                aria-label="Mark Resolved"
              >
                <CheckCircle2 size={12} />
                <span className="font-semibold">Mark Resolved</span>
              </button>
            )}
            {!compact && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 transition-all"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "0.5px solid rgba(99,102,241,0.25)",
                  color: "#818cf8",
                  borderRadius: "10px",
                  fontSize: "12px",
                  padding: "6px 14px"
                }}
                aria-label="Send to Authority"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                <span className="font-semibold">{loading ? "Preparing letter..." : "Send to Authority"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* React Portal for Resolve Modal */}
      <ResolveModal 
        issue={issue} 
        isOpen={showResolveModal} 
        onClose={() => setShowResolveModal(false)} 
      />

      {/* React Portal for Letter Modal */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Overlay Style */}
          <div
            className="absolute inset-0 z-[-1]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            aria-hidden="true"
          />
          {/* Modal Content Box */}
          <div
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            style={{
              background: "rgba(6,6,9,0.95)",
              backdropFilter: "blur(24px)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              maxWidth: "560px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 32px rgba(99,102,241,0.4)" }}
                >
                  <Mail size={16} className="text-white" />
                </div>
                <div>
                  <h2 id="modal-title" className="text-[15px] font-black text-white">Review Complaint Letter</h2>
                  <p className="text-[11px] text-white/35">AI-generated dispatch to {EMAIL_MAPPING[issue.category] || EMAIL_MAPPING["Other"]}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="p-5 rounded-xl font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-white/85"
                   style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-white/40">
                    <Loader2 size={24} className="text-violet-light animate-spin" />
                    <span>Gemini is preparing your formal letter...</span>
                  </div>
                ) : letter ? (
                  letter
                ) : (
                  <p className="text-white/30 text-center py-8">No letter generated yet.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setShowModal(false)}
                className="text-[13px] px-4 py-2 rounded-[10px] text-white/40 hover:bg-white/5 hover:text-white transition-all"
              >
                Close
              </button>
              <button
                onClick={copyToClipboard}
                disabled={loading || !letter}
                className={cn(
                  "text-[13px] px-4 py-2 rounded-[10px] flex items-center gap-2 transition-all",
                  copied ? "text-green-400 bg-green-500/10 border border-green-500/30" : "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10"
                )}
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Letter</>}
              </button>
              <button
                onClick={handleOpenEmail}
                disabled={loading || !letter}
                className="text-[13px] flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-white font-semibold transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.4)"
                }}
              >
                <Mail size={14} />
                Open Email App
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}