import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertTriangle, Loader2, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useIssues } from "../hooks/useIssues";
import { verifyResolution } from "../utils/gemini";
import { cn } from "../lib/utils";

export default function ResolveModal({ issue, isOpen, onClose }) {
  const { updateStatus } = useIssues();
  const fileRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null); // { verified: boolean, reason: string }

  if (!isOpen) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null); // reset previous results
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleVerify = async () => {
    if (!imageFile) {
      toast.error("Please upload a photo of the completed repair.");
      return;
    }
    setVerifying(true);
    try {
      const aiResult = await verifyResolution(issue, imageFile);
      setResult(aiResult);
      if (aiResult.verified) {
        toast.success("AI verified! Issue marked as resolved.");
        await updateStatus(issue.id, "Resolved");
        setTimeout(onClose, 2500);
      } else if (aiResult._fallback) {
        toast("AI unavailable — use 'Manual Confirm' below to proceed.", { icon: "⚠️" });
      } else {
        toast.error("Verification failed. See reason.");
      }
    } catch {
      toast.error("AI verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 z-[-1]"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden flex flex-col"
        style={{
          background: "rgba(6,6,9,0.95)",
          backdropFilter: "blur(24px)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 32px rgba(16,185,129,0.4)" }}
            >
              <CheckCircle size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-white">Verify Resolution</h2>
              <p className="text-[11px] text-white/40">AI-powered repair verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[13px] text-white/60 mb-4 leading-relaxed">
            To mark <strong>"{issue.title}"</strong> as resolved, please upload a photo of the completed repair. Gemini AI will automatically verify the photo against the original complaint to prevent fraudulent closures.
          </p>

          <div className="mb-6">
            {!imagePreview ? (
              <button
                onClick={() => fileRef.current.click()}
                className="w-full rounded-2xl p-8 text-center transition-all duration-200 group flex flex-col items-center justify-center gap-3"
                style={{
                  border: "1.5px dashed rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                  <Camera size={24} className="text-white/30 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/70 group-hover:text-white transition-colors">Upload Fixed Photo</p>
                  <p className="text-[11px] text-white/30 mt-1">Tap to select an image from your device</p>
                </div>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Fixed Repair Preview"
                  className="w-full h-48 object-cover rounded-2xl"
                  style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
                />
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(6,6,9,0.8)", border: "0.5px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(6,6,9,0.8)")}
                >
                  <X size={13} className="text-white/60" />
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Result Block */}
          {result && (
            <div className={cn(
              "p-4 rounded-xl border flex items-start gap-3 mb-2",
              result.verified ? "bg-emerald-500/10 border-emerald-500/20" : result._fallback ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20"
            )}>
              {result.verified ? (
                <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : result._fallback ? (
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={18} className="text-red shrink-0 mt-0.5" />
              )}
              <div>
                <p className={cn("text-[13px] font-bold mb-1", result.verified ? "text-emerald-400" : result._fallback ? "text-amber-400" : "text-red-400")}>
                  {result.verified ? "Verification Successful" : result._fallback ? "AI Unavailable — Manual Review" : "Verification Rejected"}
                </p>
                <p className={cn("text-[12px] leading-relaxed", result.verified ? "text-emerald-400/80" : result._fallback ? "text-amber-400/80" : "text-red-400/80")}>
                  "{result.reason}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <button
            onClick={onClose}
            disabled={verifying}
            className="text-[13px] px-4 py-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          {result?._fallback ? (
            <button
              onClick={async () => {
                await updateStatus(issue.id, "Resolved");
                toast.success("Issue marked as resolved (manual confirm).");
                setTimeout(onClose, 1500);
              }}
              className="text-[13px] flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 8px 32px rgba(245,158,11,0.3)"
              }}
            >
              <CheckCircle size={14} /> Manual Confirm
            </button>
          ) : (
            <button
              onClick={handleVerify}
              disabled={verifying || !imageFile || (result && result.verified)}
              className="text-[13px] flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 8px 32px rgba(16,185,129,0.3)"
              }}
            >
              {verifying ? (
                <><Loader2 size={14} className="animate-spin" /> Analyzing Image...</>
              ) : result && result.verified ? (
                <><CheckCircle size={14} /> Resolved</>
              ) : (
                <><CheckCircle size={14} /> Verify & Resolve</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
