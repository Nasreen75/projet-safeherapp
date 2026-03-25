import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const contacts = [
  { name: "Mom", phone: "+91 98765 43210", relation: "Parent", initial: "M", color: "hsl(346, 77%, 55%)" },
  { name: "Dad", phone: "+91 87654 32109", relation: "Parent", initial: "D", color: "hsl(28, 90%, 55%)" },
  { name: "Best Friend", phone: "+91 76543 21098", relation: "Friend", initial: "B", color: "hsl(270, 60%, 55%)" },
];

export const ContactsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 100 }}>
      <div style={{ opacity: stepOpacity, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "hsl(270, 60%, 55%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>3</div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>Emergency Contacts</span>
      </div>

      <div style={{ opacity: stepOpacity, fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 30, textAlign: "center", maxWidth: 450, lineHeight: 1.5 }}>
        Add, edit & delete contacts who get notified instantly when SOS is triggered
      </div>

      {/* Phone mockup with contacts */}
      <div style={{
        width: 420, borderRadius: 32,
        background: "hsla(0, 0%, 100%, 0.04)",
        border: "1px solid hsla(0, 0%, 100%, 0.1)",
        padding: "24px 20px",
        transform: `scale(${Math.min(spring({ frame: frame - 10, fps, config: { damping: 15 } }), 1)})`,
      }}>
        {/* Header with + button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "white" }}>My Contacts</span>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "hsl(346, 77%, 55%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "white", fontWeight: 700,
            transform: `scale(${frame >= 40 && frame < 50 ? interpolate(frame, [40, 45, 50], [1, 1.2, 1]) : 1})`,
          }}>+</div>
        </div>

        {/* Contact cards */}
        {contacts.map((c, i) => {
          const delay = 20 + i * 15;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const cardX = interpolate(cardSpring, [0, 1], [200, 0]);

          // Action buttons appear
          const actionsOpacity = interpolate(frame, [60 + i * 10, 70 + i * 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px", borderRadius: 16, marginBottom: 10,
              background: "hsla(0, 0%, 100%, 0.05)",
              border: "1px solid hsla(0, 0%, 100%, 0.08)",
              transform: `translateX(${cardX}px)`,
              opacity: interpolate(cardSpring, [0, 0.3, 1], [0, 0.5, 1]),
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: `${c.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, color: c.color, flexShrink: 0,
              }}>{c.initial}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "white" }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "hsla(0, 0%, 100%, 0.4)" }}>{c.phone} • {c.relation}</div>
              </div>
              <div style={{ display: "flex", gap: 6, opacity: actionsOpacity }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "hsla(152, 60%, 50%, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📞</div>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "hsla(346, 77%, 55%, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✏️</div>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "hsla(0, 85%, 55%, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🗑️</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action labels */}
      <div style={{
        display: "flex", gap: 24, marginTop: 30,
        opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        {[
          { icon: "➕", label: "Add" },
          { icon: "✏️", label: "Edit" },
          { icon: "🗑️", label: "Delete" },
          { icon: "📞", label: "Call" },
        ].map((a, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            transform: `scale(${Math.min(spring({ frame: frame - 80 - i * 5, fps, config: { damping: 12 } }), 1)})`,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "hsla(0, 0%, 100%, 0.06)",
              border: "1px solid hsla(0, 0%, 100%, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>{a.icon}</div>
            <span style={{ fontSize: 13, color: "hsla(0, 0%, 100%, 0.5)", fontWeight: 600 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Real-time sync note */}
      <div style={{
        marginTop: 30,
        opacity: interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" }),
        fontSize: 18, color: "hsl(152, 60%, 55%)", fontWeight: 600,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span>🔄</span> Changes sync to Firebase in real-time
      </div>
    </AbsoluteFill>
  );
};
