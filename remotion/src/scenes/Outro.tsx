import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 18 } }), [0, 1], [30, 0]);

  const taglineOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: "clamp" });

  // Subtle breathing on the shield
  const breathe = 1 + Math.sin(frame / 20) * 0.03;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily }}>
      {/* Large glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(346, 77%, 55%, 0.15), transparent 70%)",
          transform: `scale(${breathe})`,
        }}
      />

      {/* Shield */}
      <div style={{ transform: `scale(${logoScale * breathe})`, marginBottom: 40 }}>
        <svg width="120" height="140" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z"
            fill="hsl(346, 77%, 55%)"
            stroke="hsl(346, 77%, 70%)"
            strokeWidth="0.5"
          />
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">♀</text>
        </svg>
      </div>

      {/* App name */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 72, fontWeight: 800, color: "white" }}>Safe</span>
        <span style={{ fontSize: 72, fontWeight: 800, color: "hsl(346, 77%, 55%)" }}>Her</span>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          marginTop: 24,
          fontSize: 30,
          fontWeight: 600,
          color: "hsla(0, 0%, 100%, 0.6)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Because every woman{"\n"}deserves to feel safe
      </div>

      {/* Feature pills */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 60,
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {["SOS Alert", "AI Bot", "Fake Call", "Live GPS", "Voice Detection"].map((f, i) => {
          const pillScale = spring({ frame: frame - 60 - i * 5, fps, config: { damping: 15 } });
          return (
            <div
              key={i}
              style={{
                padding: "10px 22px",
                borderRadius: 50,
                background: "hsla(346, 77%, 55%, 0.15)",
                border: "1px solid hsla(346, 77%, 55%, 0.3)",
                color: "hsl(346, 77%, 70%)",
                fontSize: 18,
                fontWeight: 600,
                transform: `scale(${Math.min(pillScale, 1)})`,
              }}
            >
              {f}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
