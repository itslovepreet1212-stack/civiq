import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Loader2, MapPin, AlertTriangle, X, CheckCircle2, ArrowRight, LocateFixed } from "lucide-react";
import { analyzeImage } from "../utils/gemini";
import { useIssues } from "../hooks/useIssues";
import toast from "react-hot-toast";

const CATEGORIES = ["Pothole","Garbage","Broken Streetlight","Water Leakage","Open Drain","Damaged Road","Other"];
const IMPACTS = ["Traffic Disruption", "Pedestrian Hazard", "Health & Sanitation Risk", "Property Damage", "General Inconvenience"];
const DURATIONS = ["Just Happened (Today)", "Ongoing for Days", "Ongoing for Weeks", "Recurring Problem"];
const SEV_LABEL = { 1:"Minimal",2:"Very Low",3:"Low",4:"Minor",5:"Moderate",6:"Noticeable",7:"High",8:"Severe",9:"Critical",10:"Emergency" };

function sevColor(s) {
  if (s <= 3) return "#4ade80";
  if (s <= 6) return "#fbbf24";
  return "#f87171";
}

export default function ReportIssue() {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const fileRef = useRef();

  const [form, setForm] = useState({ title:"", description:"", location:"", category:"", severity:5, department:"", impact:"", duration:"", latitude: null, longitude: null });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleDetectLocation = () => {
    setLocating(true);

    const fetchIpFallback = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city) {
          const address = `${data.city}, ${data.region}, ${data.country_name}`;
          setForm((p) => ({ ...p, location: address, latitude: data.latitude, longitude: data.longitude }));
          toast.success("Location auto-filled via IP!");
        } else {
          toast.error("Could not detect location automatically.");
        }
      } catch {
        toast.error("Location access denied or unavailable.");
      } finally {
        setLocating(false);
      }
    };

    if (!navigator.geolocation) {
      fetchIpFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`);
          const data = await res.json();
          if (data.status === "OK" && data.results[0]) {
            const address = data.results[0].formatted_address;
            setForm((p) => ({ ...p, location: address, latitude, longitude }));
            toast.success("Location auto-filled!");
            setLocating(false);
          } else {
            fetchIpFallback(); // fallback if geocoding fails
          }
        } catch {
          fetchIpFallback();
        }
      },
      () => {
        fetchIpFallback();
      }
    );
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAiDone(false);
    setAnalyzing(true);
    try {
      const r = await analyzeImage(file);
      setForm((p) => ({
        ...p,
        category: r.category || p.category,
        severity: r.severity || p.severity,
        description: r.description || p.description,
        department: r.suggested_department || p.department,
        title: p.title || `${r.category} Issue`,
        _aiInsights: {
          materials: r.materials_needed,
          cost: r.estimated_cost,
          time: r.estimated_time,
          butterfly: r.butterfly_effect
        }
      }));
      setAiDone(true);
      toast.success("AI analysed your photo!");
    } catch {
      toast.error("AI analysis failed — fill manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setAiDone(false);
    fileRef.current.value = "";
    setForm(p => { const next = {...p}; delete next._aiInsights; return next; });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location || !form.category) {
      toast.error("Please fill Title, Location and Category.");
      return;
    }
    setSubmitting(true);
    try {
      let finalDesc = form.description;
      if (form.impact || form.duration) {
        finalDesc += `\n\nContext:`;
        if (form.impact) finalDesc += `\n- Impact: ${form.impact}`;
        if (form.duration) finalDesc += `\n- Duration: ${form.duration}`;
      }
      if (form._aiInsights) {
        finalDesc += `\n\n🛠️ AI Repair Estimate:`;
        finalDesc += `\n- Materials: ${form._aiInsights.materials}`;
        finalDesc += `\n- Time: ${form._aiInsights.time}`;
        finalDesc += `\n- Cost: ${form._aiInsights.cost}`;
        finalDesc += `\n\n🦋 Butterfly Effect Warning:`;
        finalDesc += `\n${form._aiInsights.butterfly}`;
      }
      
      const payload = { ...form, description: finalDesc.trim() };
      delete payload._aiInsights; // remove temp field
      
      await addIssue({ ...payload, imageFile });
      toast.success("Issue reported! Community is watching.");
      navigate("/dashboard");
    } catch {
      toast.error("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-[58px] relative z-10">
      <div className="max-w-2xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="eyebrow mb-2">Make a difference</p>
          <h1 className="text-[36px] font-black tracking-tightest leading-tight mb-3">
            Report an Issue
          </h1>
          <p className="text-[14px] text-white/38 leading-relaxed">
            Upload a photo and Gemini AI auto-fills the form. Your community validates it, authorities resolve it.
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* Image upload */}
          <div className="glass rounded-2xl p-6">
            <label className="label-glass">Photo of Issue</label>
            {!imagePreview ? (
              <button
                onClick={() => fileRef.current.click()}
                className="w-full rounded-xl p-10 text-center transition-all duration-200 group"
                style={{
                  border: "1.5px dashed rgba(255,255,255,0.1)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                <Upload size={28} className="text-white/20 mx-auto mb-3 transition-colors group-hover:text-violet-light" />
                <p className="text-[13px] text-white/30 group-hover:text-white/60 transition-colors">
                  Click to upload — AI analyses instantly
                </p>
                <p className="text-[11px] text-white/18 mt-1">JPG, PNG supported</p>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-xl"
                  style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}
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

                {analyzing && (
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(6,6,9,0.7)", backdropFilter: "blur(4px)" }}
                  >
                    <div className="text-center">
                      <Loader2 size={28} className="text-violet-light animate-spin mx-auto mb-2" />
                      <p className="text-[12px] text-white/60 font-medium">AI analysing…</p>
                    </div>
                  </div>
                )}

                {aiDone && (
                  <div
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(74,222,128,0.15)", border: "0.5px solid rgba(74,222,128,0.28)" }}
                  >
                    <CheckCircle2 size={12} className="text-green" />
                    <span className="text-[11px] text-green font-semibold">AI auto-filled the form</span>
                  </div>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Title & Location */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <label className="label-glass">Issue Title *</label>
              <input
                className="input-glass"
                placeholder="e.g. Deep pothole causing accidents near main market"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label-glass">Location *</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  className="input-glass pl-9 pr-24"
                  placeholder="e.g. MG Road, near City Mall, Ludhiana"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white/70 px-2 py-1.5 rounded-lg transition-colors"
                >
                  {locating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} className="text-violet-light" />}
                  {locating ? "Locating..." : "Auto"}
                </button>
              </div>
            </div>
          </div>

          {/* AI fields */}
          <div className="glass rounded-2xl p-6 flex flex-col gap-5">
            <div
              className="flex items-center gap-2 pb-4"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
            >
              <Sparkles size={13} className="text-violet-light" />
              <span className="text-[11px] text-violet-light font-semibold">
                AI fills these — you can edit
              </span>
            </div>

            <div>
              <label className="label-glass">Category *</label>
              <select
                className="select-glass"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-glass">Citizen Impact</label>
                <select
                  className="select-glass"
                  value={form.impact}
                  onChange={(e) => setForm({ ...form, impact: e.target.value })}
                >
                  <option value="">Select impact...</option>
                  {IMPACTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-glass">Issue Duration</label>
                <select
                  className="select-glass"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                >
                  <option value="">Select duration...</option>
                  {DURATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label-glass">Description</label>
              <textarea
                className="input-glass resize-none"
                rows={3}
                placeholder="Describe the issue and its impact on citizens…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Severity slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label-glass mb-0">Severity</label>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: sevColor(form.severity), boxShadow: `0 0 8px ${sevColor(form.severity)}` }}
                  />
                  <span className="font-mono text-[11px] font-bold" style={{ color: sevColor(form.severity) }}>
                    {form.severity}/10
                  </span>
                  <span className="text-[11px] text-white/28">— {SEV_LABEL[form.severity]}</span>
                </div>
              </div>
              <input
                type="range" min="1" max="10" step="1"
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}
                className="w-full cursor-pointer"
                style={{ accentColor: sevColor(form.severity) }}
              />
              <div className="flex justify-between text-[10px] text-white/20 mt-1 font-mono">
                <span>Minimal</span><span>Emergency</span>
              </div>
            </div>

            <div>
              <label className="label-glass">Responsible Department</label>
              <input
                className="input-glass"
                placeholder="e.g. PWD, Municipal Corporation, Water Board"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
          </div>

          {form._aiInsights && (
            <div className="glass rounded-2xl p-6 flex flex-col gap-4" style={{ background: "rgba(99,102,241,0.05)", border: "0.5px solid rgba(99,102,241,0.2)" }}>
              <div
                className="flex items-center gap-2 pb-4"
                style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
              >
                <Sparkles size={13} className="text-violet-light" />
                <span className="text-[12px] text-white font-bold">AI Damage Assessment</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-white/40 mb-1">Estimated Materials</p>
                  <p className="text-white/80 font-medium">{form._aiInsights.materials || "N/A"}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-white/40 mb-1">Estimated Cost</p>
                  <p className="text-white/80 font-medium font-mono">{form._aiInsights.cost || "N/A"}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 col-span-2">
                  <p className="text-white/40 mb-1">Estimated Time</p>
                  <p className="text-white/80 font-medium">{form._aiInsights.time || "N/A"}</p>
                </div>
              </div>

              <div className="mt-2 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-amber mb-1">Butterfly Effect Prediction</p>
                  <p className="text-[12px] text-amber/80 leading-relaxed italic">"{form._aiInsights.butterfly}"</p>
                </div>
              </div>
            </div>
          )}

          {/* High severity warning */}
          {form.severity >= 8 && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "rgba(248,113,113,0.07)", border: "0.5px solid rgba(248,113,113,0.2)" }}
            >
              <AlertTriangle size={15} className="text-red shrink-0 mt-0.5" />
              <p className="text-[12px] text-red/80">
                Critical severity detected. This report will be auto-escalated to senior authorities and flagged for urgent action.
              </p>
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full justify-center py-4 text-[15px]">
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Submitting…</>
            ) : (
              <><MapPin size={16} /> Submit Report <ArrowRight size={15} /></>
            )}
          </button>

          <p className="text-center text-[11px] text-white/22">
            Visible to community immediately · You earn{" "}
            <span className="text-violet-light font-semibold">+10 points</span> for reporting
          </p>
        </div>
      </div>
    </div>
  );
}