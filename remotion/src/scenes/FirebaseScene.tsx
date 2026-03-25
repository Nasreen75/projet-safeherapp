import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

export const FirebaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Data flow animation
  const dataNodes = [
    { label: "SOS Pressed", icon: "🚨", y: 0 },
    { label: "User Data Collected", icon: "👤", y: 1 },
    { label: "Location Captured", icon: "📍", y: 2 },
    { label: "Saved to Firebase", icon: "🔥", y: 3 },
    { label: "Contacts Notified", icon: "📱", y: 4 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 100 }}>
      <div style={{ opacity: stepOpacity, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "hsl(38, 92%, 50%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>5</div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>How Data Flows</span>
      </div>

      <div style={{ opacity: stepOpacity, fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 50, textAlign: "center", maxWidth: 450, lineHeight: 1.5 }}>
        Firebase Realtime Database stores everything securely and instantly
      </div>

      {/* Flow diagram */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "80%" }}>
        {dataNodes.map((node, i) => {
          const delay = 15 + i * 16;
          const nodeSpring = spring({ frame: frame - delay, fps, config: { damping: 14 } });
          const nodeScale = Math.min(nodeSpring, 1);
          const nodeOpacity = interpolate(nodeSpring, [0, 0.5, 1], [0, 0.6, 1]);

          // Connector line
          const lineDelay = delay + 10;
          const lineHeight = frame >= lineDelay ? interpolate(frame, [lineDelay, lineDelay + 10], [0, 40], { extrapolateRight: "clamp" }) : 0;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "18px 28px", borderRadius: 20,
                background: i === 3 ? "hsla(38, 92%, 50%, 0.1)" : "hsla(0, 0%, 100%, 0.05)",
                border: `1px solid ${i === 3 ? "hsla(38, 92%, 50%, 0.3)" : "hsla(0, 0%, 100%, 0.1)"}`,
                transform: `scale(${nodeScale})`,
                opacity: nodeOpacity,
                width: "100%",
              }}>
                <span style={{ fontSize: 30 }}>{node.icon}</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: i === 3 ? "hsl(38, 92%, 55%)" : "white" }}>{node.label}</span>
                {i === 3 && <span style={{ fontSize: 14, color: "hsla(38, 92%, 50%, 0.6)", marginLeft: "auto", fontWeight: 500 }}>Realtime DB</span>}
              </div>
              {i < dataNodes.length - 1 && (
                <div style={{
                  width: 3, height: lineHeight,
                  background: "linear-gradient(180deg, hsla(346, 77%, 55%, 0.5), hsla(346, 77%, 55%, 0.1))",
                  borderRadius: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* JSON preview */}
      <div style={{
        marginTop: 40, width: "85%", padding: "16px 20px",
        borderRadius: 16, background: "hsla(0, 0%, 0%, 0.3)",
        border: "1px solid hsla(0, 0%, 100%, 0.08)",
        opacity: interpolate(frame, [85, 100], [0, 1], { extrapolateRight: "clamp" }),
        fontFamily: "monospace",
      }}>
        <div style={{ fontSize: 12, color: "hsla(0, 0%, 100%, 0.3)", marginBottom: 8 }}>// Firebase Data Structure</div>
        <div style={{ fontSize: 14, color: "hsl(38, 92%, 60%)" }}>{"{"}</div>
        <div style={{ fontSize: 13, color: "hsla(0, 0%, 100%, 0.7)", paddingLeft: 16 }}>
          "name": "Priya",<br />
          "phone": "+91 98765...",<br />
          "location": {"{"} lat, lng {"}"},<br />
          "status": "active"
        </div>
        <div style={{ fontSize: 14, color: "hsl(38, 92%, 60%)" }}>{"}"}</div>
      </div>
    </AbsoluteFill>
  );
};
