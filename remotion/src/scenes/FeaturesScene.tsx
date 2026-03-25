import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700"] , subsets: ["latin"] });

const features = [
  { icon: "🤖", title: "AI Safety Bot", desc: "Chat assistant with safety tips, harassment help, emergency guidance", color: "hsl(346, 77%, 55%)" },
  { icon: "📞", title: "Fake Call", desc: "Simulates incoming call to escape dangerous situations", color: "hsl(28, 90%, 55%)" },
  { icon: "🎙️", title: "Voice Detection", desc: "Listens for 'Help', 'Save me', 'Stop' and auto-triggers SOS", color: "hsl(270, 60%, 55%)" },
  { icon: "📍", title: "Live GPS Tracking", desc: "Real-time location shared with contacts and police", color: "hsl(152, 60%, 50%)" },
  { icon: "🛡️", title: "Safety Tips", desc: "Night travel, public transport, self-defense guides", color: "hsl(200, 70%, 50%)" },
];

export const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 100 }}>
      <div style={{ opacity: stepOpacity, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "hsl(28, 90%, 55%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>4</div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>Advanced Features</span>
      </div>

      <div style={{ opacity: stepOpacity, fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 40, textAlign: "center", maxWidth: 450, lineHeight: 1.5 }}>
        Built-in tools designed for women's safety
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "88%" }}>
        {features.map((f, i) => {
          const delay = 15 + i * 12;
          const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 150 } });
          const fromLeft = i % 2 === 0;
          const cardX = interpolate(cardSpring, [0, 1], [fromLeft ? -400 : 400, 0]);

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 20,
              padding: "22px 24px", borderRadius: 22,
              background: "hsla(0, 0%, 100%, 0.05)",
              border: `1px solid ${f.color}33`,
              transform: `translateX(${cardX}px)`,
              opacity: interpolate(cardSpring, [0, 0.3, 1], [0, 0.5, 1]),
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${f.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "hsla(0, 0%, 100%, 0.45)", lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
