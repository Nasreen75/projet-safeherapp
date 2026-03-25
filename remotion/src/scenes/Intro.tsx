import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shieldScale = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const titleY = interpolate(
    spring({ frame: frame - 20, fps, config: { damping: 18 } }),
    [0, 1], [80, 0]
  );
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(
    spring({ frame: frame - 40, fps, config: { damping: 18 } }),
    [0, 1], [40, 0]
  );
  const lineWidth = interpolate(
    spring({ frame: frame - 55, fps, config: { damping: 20 } }),
    [0, 1], [0, 200]
  );

  // Pulsing glow behind shield
  const glowScale = 1 + Math.sin(frame / 15) * 0.1;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily }}>
      {/* Shield glow */}
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(346, 77%, 55%, 0.4), transparent 70%)",
          transform: `scale(${glowScale * shieldScale})`,
        }}
      />

      {/* Shield icon */}
      <div
        style={{
          transform: `scale(${shieldScale})`,
          marginBottom: 40,
        }}
      >
        <svg width="160" height="180" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z"
            fill="hsl(346, 77%, 55%)"
            stroke="hsl(346, 77%, 70%)"
            strokeWidth="0.5"
          />
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">♀</text>
        </svg>
      </div>

      {/* Title */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 88, fontWeight: 800, color: "white", letterSpacing: -2 }}>
          Safe
        </span>
        <span style={{ fontSize: 88, fontWeight: 800, color: "hsl(346, 77%, 55%)", letterSpacing: -2 }}>
          Her
        </span>
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 3,
          background: "linear-gradient(90deg, transparent, hsl(346, 77%, 55%), transparent)",
          borderRadius: 2,
          marginTop: 20,
          marginBottom: 20,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 32,
          color: "hsla(0, 0%, 100%, 0.7)",
          fontWeight: 500,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Your Safety Companion
      </div>
    </AbsoluteFill>
  );
};
