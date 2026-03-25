import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const features = [
  { icon: "🤖", title: "AI Safety Bot", desc: "Get instant safety guidance", color: "hsl(346, 77%, 55%)" },
  { icon: "📞", title: "Fake Call", desc: "Escape dangerous situations", color: "hsl(28, 90%, 55%)" },
  { icon: "🎙️", title: "Voice Detection", desc: "Detects distress keywords", color: "hsl(270, 60%, 55%)" },
  { icon: "📍", title: "Live Location", desc: "Real-time GPS tracking", color: "hsl(152, 60%, 50%)" },
];

export const FeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame, fps, config: { damping: 18 } }), [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 250 }}>
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 52,
          fontWeight: 700,
          color: "white",
          marginBottom: 80,
          textAlign: "center",
        }}
      >
        Powerful Safety{"\n"}Features
      </div>

      {/* Feature cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "85%" }}>
        {features.map((f, i) => {
          const delay = 20 + i * 15;
          const cardScale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 150 } });
          const cardX = interpolate(
            spring({ frame: frame - delay, fps, config: { damping: 18 } }),
            [0, 1],
            [i % 2 === 0 ? -300 : 300, 0]
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "28px 32px",
                borderRadius: 24,
                background: "hsla(0, 0%, 100%, 0.06)",
                border: "1px solid hsla(0, 0%, 100%, 0.1)",
                transform: `translateX(${cardX}px) scale(${Math.min(cardScale, 1)})`,
                opacity: interpolate(cardScale, [0, 0.5, 1], [0, 0.8, 1]),
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: `${f.color}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "white", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", fontWeight: 500 }}>{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
