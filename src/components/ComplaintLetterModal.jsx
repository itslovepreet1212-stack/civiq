import { useEffect, useState } from "react";
import { X, Copy, Check, FileText, Loader2, Mail } from "lucide-react";
import { generateComplaintLetter } from "../utils/gemini";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

export default function ComplaintLetterModal({ issue, isOpen, onClose }) {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const EMAIL_MAPPING = {
    "Pothole": "pwd.complaints@gov.in",
    "Damaged Road": "pwd.complaints@gov.in",
    "Garbage": "swachh.bharat@municipal.gov.in",
    "Broken Streetlight": "electricity.board@gov.in",
    "Water Leakage": "waterboard.complaints@gov.in",
    "Open Drain": "municipal.drainage@gov.in",
    "Other": "grievance@municipal.gov.in"
  };

  const handleOpenEmail = () => {
    const email = EMAIL_MAPPING[issue.category] || EMAIL_MAPPING["Other"];
    const subject = `Formal Complaint: ${issue.title} at ${issue.location}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(letter)}`;
  };

  const fetchLetter = async () => {
    setLoading(true);
    try {
      const result = await generateComplaintLetter(issue);
      setLetter(result);
    } catch {
      toast.error("Failed to generate letter. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !letter) fetchLetter(); // eslint-disable-line react-hooks/set-state-in-effect
    if (!isOpen) {
      setLetter("");
      setCopied(false);
    }
  }, [isOpen, issue]); // eslint-disable-line react-hooks/exhaustive-deps

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 z-[-1]"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        style={{ 
          background: "rgba(6,6,9,0.95)",
          backdropFilter: "blur(24px)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <FileText size={16} className="text-white" />
            </div>
            <div>
              <h2 id="modal-title" className="text-[15px] font-black text-white">Complaint Letter</h2>
              <p className="text-[11px] text-white/35">AI-generated formal letter for municipal authorities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Issue context */}
          <div className="glass p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-2 text-[11px] text-white/35 mb-3">
              <span className="font-medium text-white/50">Issue:</span>
              <span className="font-semibold text-white">{issue.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/35">
              <span className="font-medium text-white/50">Location:</span>
              <span className="text-white/70">{issue.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/35 mt-1">
              <span className="font-medium text-white/50">Department:</span>
              <span className="text-violet-light font-medium">{issue.department || "Municipal Corporation"}</span>
            </div>
          </div>

          {/* Letter content */}
          <div className="glass p-5 rounded-xl font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-white/85 max-h-[50vh] overflow-y-auto"
               style={{ background: "rgba(255,255,255,0.02)", fontFamily: "'Geist Mono', monospace" }}>
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-8 text-white/40">
                <Loader2 size={20} className="text-violet-light animate-spin" />
                <span>Generating complaint letter with Gemini...</span>
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
            onClick={onClose}
            className="btn-ghost text-[13px]"
          >
            Close
          </button>
          <button
            onClick={copyToClipboard}
            disabled={loading || !letter}
            className={cn(
              "btn-ghost text-[13px] flex items-center gap-2",
              copied && "text-green-400 border-green-500/30"
            )}
          >
            {copied ? (
              <><Check size={14} /> Copied!</>
            ) : (
              <><Copy size={14} /> Copy Letter</>
            )}
          </button>
          <button
            onClick={handleOpenEmail}
            disabled={loading || !letter}
            className="btn-primary text-[13px] flex items-center gap-2"
          >
            <Mail size={14} />
            Open Email App
          </button>
        </div>
      </div>
    </div>
  );
}