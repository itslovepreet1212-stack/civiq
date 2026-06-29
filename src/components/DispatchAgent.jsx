import { useState, useEffect } from "react";
import { Send, CheckCircle, Clock, Mail, Brain } from "lucide-react";

const STORAGE_KEY = "nagarai_dispatches";

function loadDispatches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDispatches(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

const DEPT_EMAILS = {
  Pothole: "pwd.complaints@gov.in",
  "Damaged Road": "pwd.complaints@gov.in",
  Garbage: "swachh.bharat@municipal.gov.in",
  "Broken Streetlight": "electricity.board@gov.in",
  "Water Leakage": "waterboard.complaints@gov.in",
  "Open Drain": "municipal.drainage@gov.in",
  Other: "grievance@municipal.gov.in",
};

export default function DispatchAgent({ issues }) {
  const [dispatches, setDispatches] = useState(loadDispatches);
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    const verified = issues.filter(
      (i) => i.status === "Verified" && !dispatches.find((d) => d.issueId === i.id)
    );
    if (verified.length === 0 || dispatching) return;

    const doDispatch = async () => {
      setDispatching(true);
      for (const issue of verified) {
        await new Promise((r) => setTimeout(r, 800));
        const dispatch = {
          id: crypto.randomUUID(),
          issueId: issue.id,
          title: issue.title,
          department: issue.department || "Municipal Corporation",
          email: DEPT_EMAILS[issue.category] || DEPT_EMAILS.Other,
          dispatchedAt: new Date().toISOString(),
          category: issue.category,
        };
        const updated = [dispatch, ...dispatches];
        setDispatches(updated);
        saveDispatches(updated);
      }
      setDispatching(false);
    };
    doDispatch();
  }, [issues, dispatches, dispatching]);

  if (dispatches.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={14} className="text-violet-light" />
        <span className="text-[11px] font-semibold text-violet-light tracking-wide uppercase">
          Civiq Dispatch Agent
        </span>
        {dispatching && (
          <span className="flex items-center gap-1.5 text-[10px] text-amber font-mono ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            Dispatching...
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {dispatches.slice(0, 5).map((d) => (
          <div
            key={d.id}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              background: "rgba(74,222,128,0.06)",
              border: "0.5px solid rgba(74,222,128,0.15)",
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "rgba(74,222,128,0.12)",
              }}
            >
              <Send size={12} className="text-green" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[12px] font-semibold text-white/80 truncate">{d.title}</p>
                <CheckCircle size={11} className="text-green shrink-0" />
              </div>
              <p className="text-[10px] text-white/40 mt-0.5 flex items-center gap-1">
                <Mail size={9} />
                {d.email}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                <Clock size={9} />
                {new Date(d.dispatchedAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
      {dispatches.length > 5 && (
        <p className="text-[10px] text-white/30 mt-3 text-center">
          +{dispatches.length - 5} more dispatches
        </p>
      )}
    </div>
  );
}
