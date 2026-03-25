import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });

export const SOSScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // SOS button animation
  const buttonScale = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 120 } });
  const pulseScale = 1 + Math.sin(frame / 8) * 0.06;

  // Ring animations
  const ring1 = interpolate(frame % 45, [0, 45], [1, 2.8]);
  const ring1Opacity = interpolate(frame % 45, [0, 45], [0.5, 0]);
  const ring2 = interpolate((frame + 15) % 45, [0, 45], [1, 2.8]);
  const ring2Opacity = interpolate((frame + 15) % 45, [0, 45], [0.5, 0]);
  const ring3 = interpolate((frame + 30) % 45, [0, 45], [1, 2.8]);
  const ring3Opacity = interpolate((frame + 30) % 45, [0, 45], [0.5, 0]);

  const labelOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(spring({ frame: frame - 30, fps, config: { damping: 18 } }), [0, 1], [30, 0]);

  // Press animation at frame 60
  const pressScale = frame >= 60 && frame < 75
    ? interpolate(frame, [60, 67, 75], [1, 0.9, 1], { extrapolateRight: "clamp" })
    : 1;

  // Flash effect on press
  const flashOpacity = frame >= 67 && frame < 85
    ? interpolate(frame, [67, 72, 85], [0, 0.3, 0], { extrapolateRight: "clamp" })
    : 0;

  // Status text after press
  const statusOpacity = interpolate(frame, [75, 90], [0, 1], { extrapolateRight: "clamp" });
  const statusY = interpolate(spring({ frame: frame - 75, fps, config: { damping: 15 } }), [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily }}>
      {/* Section label */}
      <div
        style={{
          position: "absolute",
          top: 200,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontSize: 28,
          fontWeight: 600,
          color: "hsla(0, 0%, 100%, 0.5)",
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        Emergency SOS
      </div>

      {/* Pulsing rings */}
      {[[ring1, ring1Opacity], [ring2, ring2Opacity], [ring3, ring3Opacity]].map(([scale, opacity], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "2px solid hsl(0, 85%, 55%)",
            opacity: opacity as number,
            transform: `scale(${scale})`,
          }}
        />
      ))}

      {/* SOS Button */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(135deg, hsl(0, 85%, 55%), hsl(20, 90%, 50%))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${buttonScale * pulseScale * pressScale})`,
          boxShadow: "0 8px 40px -8px hsla(0, 85%, 55%, 0.6)",
        }}
      >
        <span style={{ fontSize: 56, fontWeight: 800, color: "white", letterSpacing: 4 }}>
          {frame >= 75 ? "SENT ✓" : "SOS"}
        </span>
      </div>

      {/* Flash overlay */}
      <AbsoluteFill style={{ background: "hsla(0, 85%, 55%, " + flashOpacity + ")" }} />

      {/* Hold instruction */}
      <div
        style={{
          position: "absolute",
          bottom: 500,
          opacity: labelOpacity,
          fontSize: 24,
          color: "hsla(0, 0%, 100%, 0.5)",
          fontWeight: 500,
        }}
      >
        Hold for 1.5 seconds to activate
      </div>

      {/* Status messages after press */}
      {frame >= 75 && (
        <div
          style={{
            position: "absolute",
            bottom: 350,
            opacity: statusOpacity,
            transform: `translateY(${statusY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 24, color: "hsl(152, 60%, 55%)", fontWeight: 700 }}>
            ✅ SOS Alert Sent!
          </div>
          <div style={{ fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", textAlign: "center", lineHeight: 1.5 }}>
            Location shared • Police notified • Contacts alerted
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
