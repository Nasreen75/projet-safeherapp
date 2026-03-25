import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const contacts = [
  { name: "Mom", phone: "+91 98765 43210", relation: "Parent", initial: "M" },
  { name: "Dad", phone: "+91 87654 32109", relation: "Parent", initial: "D" },
  { name: "Best Friend", phone: "+91 76543 21098", relation: "Friend", initial: "B" },
];

export const ContactsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame, fps, config: { damping: 18 } }), [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 280 }}>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, color: "white", marginBottom: 12 }}>
          Emergency Contacts
        </div>
        <div style={{ fontSize: 22, color: "hsla(0, 0%, 100%, 0.5)", fontWeight: 500 }}>
          Instantly notified when SOS is triggered
        </div>
      </div>

      {/* Phone mockup frame */}
      <div
        style={{
          width: "88%",
          borderRadius: 32,
          background: "hsla(0, 0%, 100%, 0.04)",
          border: "1px solid hsla(0, 0%, 100%, 0.1)",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {contacts.map((c, i) => {
          const delay = 25 + i * 18;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const cardY = interpolate(cardSpring, [0, 1], [60, 0]);
          const cardOpacity = interpolate(cardSpring, [0, 0.3, 1], [0, 0.5, 1]);

          // Checkmark appears after contact animates in
          const checkDelay = delay + 25;
          const checkScale = spring({ frame: frame - checkDelay, fps, config: { damping: 10, stiffness: 200 } });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "20px 24px",
                borderRadius: 20,
                background: "hsla(0, 0%, 100%, 0.06)",
                border: "1px solid hsla(0, 0%, 100%, 0.08)",
                transform: `translateY(${cardY}px)`,
                opacity: cardOpacity,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "hsla(346, 77%, 55%, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "hsl(346, 77%, 65%)",
                  flexShrink: 0,
                }}
              >
                {c.initial}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>{c.name}</div>
                <div style={{ fontSize: 18, color: "hsla(0, 0%, 100%, 0.4)", fontWeight: 500 }}>
                  {c.phone} • {c.relation}
                </div>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "hsla(152, 60%, 50%, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${Math.min(checkScale, 1)})`,
                  fontSize: 18,
                }}
              >
                ✅
              </div>
            </div>
          );
        })}
      </div>

      {/* Firebase sync indicator */}
      <div
        style={{
          marginTop: 40,
          opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }),
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 20,
          color: "hsl(152, 60%, 55%)",
          fontWeight: 600,
        }}
      >
        <span>🔥</span> Synced with Firebase in real-time
      </div>
    </AbsoluteFill>
  );
};
