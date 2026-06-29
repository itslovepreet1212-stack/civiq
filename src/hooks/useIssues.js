import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase/config";
import toast from "react-hot-toast";

const STORAGE_KEY = "nagarai_issues";

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocal(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      const local = loadLocal();
      setIssues(local);
    } else {
      setIssues(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchIssues(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchIssues]);

  const addIssue = async ({ imageFile, ...fields }) => {
    let image_url = null;
    if (imageFile) {
      const safeName = `${Date.now()}-${encodeURIComponent(imageFile.name)}`;
      const { error: upErr } = await supabase.storage
        .from("issue-images")
        .upload(safeName, imageFile);
      if (!upErr) {
        const { data: urlData } = supabase.storage
          .from("issue-images")
          .getPublicUrl(safeName);
        image_url = urlData?.publicUrl || null;
      }
    }

    const { data, error } = await supabase
      .from("issues")
      .insert([{ ...fields, image_url, status: "Reported", upvotes: 0 }])
      .select();
    if (error) {
      const localIssue = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...fields,
        image_url,
        status: "Reported",
        upvotes: 0,
      };
      const current = loadLocal();
      saveLocal([localIssue, ...current]);
      setIssues((p) => [localIssue, ...p]);
      window.dispatchEvent(new CustomEvent("nagarai-issue-updated"));
      return localIssue;
    }
    setIssues((p) => [data[0], ...p]);
    window.dispatchEvent(new CustomEvent("nagarai-issue-updated"));
    return data[0];
  };

  const upvoteIssue = async (id) => {
    const issue = issues.find((i) => i.id === id);
    if (!issue) return;
    const newUpvotes = (issue.upvotes || 0) + 1;
    const newStatus =
      newUpvotes >= 5 && issue.status === "Reported" ? "Verified" : issue.status;
    const { error } = await supabase
      .from("issues")
      .update({ upvotes: newUpvotes, status: newStatus })
      .eq("id", id);
    if (error) {
      const current = loadLocal();
      const updated = current.map((i) =>
        i.id === id ? { ...i, upvotes: newUpvotes, status: newStatus } : i
      );
      saveLocal(updated);
      setIssues((p) =>
        p.map((i) => (i.id === id ? { ...i, upvotes: newUpvotes, status: newStatus } : i))
      );
      return;
    }
    setIssues((p) =>
      p.map((i) => (i.id === id ? { ...i, upvotes: newUpvotes, status: newStatus } : i))
    );
    window.dispatchEvent(new CustomEvent("nagarai-issue-updated"));
    if (newStatus === "Verified") toast.success("Issue verified by community!");
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from("issues").update({ status }).eq("id", id);
    if (error) {
      const current = loadLocal();
      const updated = current.map((i) => (i.id === id ? { ...i, status } : i));
      saveLocal(updated);
    }
    setIssues((p) => p.map((i) => (i.id === id ? { ...i, status } : i)));
    window.dispatchEvent(new CustomEvent("nagarai-issue-updated"));
  };

  return { issues, loading, addIssue, upvoteIssue, updateStatus, refetch: fetchIssues };
}
