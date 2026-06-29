export default function MeshBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "64px 64px"
      }} />
      <div style={{
        position: "absolute", width: 520, height: 520,
        background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
        filter: "blur(80px)", top: -140, left: -100,
        animation: "drift1 14s ease-in-out infinite alternate", borderRadius: "50%"
      }} />
      <div style={{
        position: "absolute", width: 380, height: 380,
        background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)",
        filter: "blur(80px)", top: 80, right: -80,
        animation: "drift2 18s ease-in-out infinite alternate", borderRadius: "50%"
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
        filter: "blur(70px)", top: "45%", left: "35%",
        animation: "drift3 12s ease-in-out infinite alternate", borderRadius: "50%"
      }} />
    </div>
  );
}
