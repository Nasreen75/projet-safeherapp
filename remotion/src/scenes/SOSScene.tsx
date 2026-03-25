import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });

export const SOSScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const phoneScale = spring({ frame: frame - 5, fps, config: { damping: 15 } });

  // SOS button pulse
  const pulseScale = 1 + Math.sin(frame / 8) * 0.04;
  const ring1 = interpolate(frame % 45, [0, 45], [1, 2.5]);
  const ring1O = interpolate(frame % 45, [0, 45], [0.4, 0]);
  const ring2 = interpolate((frame + 15) % 45, [0, 45], [1, 2.5]);
  const ring2O = interpolate((frame + 15) % 45, [0, 45], [0.4, 0]);

  // Finger press simulation at frame 60
  const fingerOpacity = frame >= 45 ? interpolate(frame, [45, 55, 90, 95], [0, 1, 1, 0], { extrapolateRight: "clamp" }) : 0;
  const fingerY = frame >= 45 ? interpolate(frame, [45, 55], [80, 0], { extrapolateRight: "clamp" }) : 80;
  const pressScale = frame >= 55 && frame < 70 ? interpolate(frame, [55, 62, 70], [1, 0.88, 1], { extrapolateRight: "clamp" }) : 1;

  // Hold progress bar
  const holdProgress = frame >= 55 ? interpolate(frame, [55, 100], [0, 100], { extrapolateRight: "clamp" }) : 0;

  // Flash + sent state
  const isSent = frame >= 100;
  const flashOpacity = frame >= 97 && frame < 110 ? interpolate(frame, [97, 102, 110], [0, 0.25, 0], { extrapolateRight: "clamp" }) : 0;

  // Notification cards sliding in
  const notif1Y = spring({ frame: frame - 105, fps, config: { damping: 15 } });
  const notif2Y = spring({ frame: frame - 115, fps, config: { damping: 15 } });
  const notif3Y = spring({ frame: frame - 125, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 100 }}>
      <div style={{ opacity: stepOpacity, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "hsl(0, 85%, 55%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>2</div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>SOS Emergency Button</span>
      </div>

      <div style={{ opacity: stepOpacity, fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 30, textAlign: "center", maxWidth: 450, lineHeight: 1.5 }}>
        Hold for 1.5 seconds → Sends alert to police, parents & emergency contacts with your live location
      </div>

      {/* SOS Button area */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${Math.min(phoneScale, 1)})` }}>
        {/* Rings */}
        {[[ring1, ring1O], [ring2, ring2O]].map(([s, o], i) => (
          <div key={i} style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: "2px solid hsl(0, 85%, 55%)", opacity: o as number, transform: `scale(${s})`, top: 0, left: "50%", marginLeft: -90 }} />
        ))}

        {/* SOS Button */}
        <div style={{
          width: 180, height: 180, borderRadius: "50%",
          background: isSent ? "linear-gradient(135deg, hsl(152, 60%, 45%), hsl(170, 55%, 40%))" : "linear-gradient(135deg, hsl(0, 85%, 55%), hsl(20, 90%, 50%))",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${pulseScale * pressScale})`,
          boxShadow: isSent ? "0 8px 40px -8px hsla(152, 60%, 45%, 0.5)" : "0 8px 40px -8px hsla(0, 85%, 55%, 0.5)",
        }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: "white", letterSpacing: 3 }}>
            {isSent ? "SENT ✓" : "SOS"}
          </span>
        </div>

        {/* Finger tap indicator */}
        {fingerOpacity > 0 && (
          <div style={{
            position: "absolute", top: 55, left: "50%", marginLeft: -20,
            transform: `translateY(${fingerY}px)`,
            opacity: fingerOpacity,
          }}>
            <div style={{ fontSize: 50 }}>👆</div>
          </div>
        )}
      </div>

      {/* Hold progress */}
      {holdProgress > 0 && holdProgress < 100 && (
        <div style={{ width: 260, height: 6, borderRadius: 3, background: "hsla(0, 0%, 100%, 0.1)", marginTop: 30, overflow: "hidden" }}>
          <div style={{ width: `${holdProgress}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg, hsl(0, 85%, 55%), hsl(38, 92%, 50%))" }} />
        </div>
      )}

      {holdProgress > 0 && holdProgress < 100 && (
        <div style={{ fontSize: 16, color: "hsla(0, 0%, 100%, 0.5)", marginTop: 10 }}>
          Holding... {Math.floor(holdProgress)}%
        </div>
      )}

      {/* Flash */}
      <AbsoluteFill style={{ background: `hsla(0, 85%, 55%, ${flashOpacity})`, pointerEvents: "none" }} />

      {/* Notification cards after SOS */}
      {isSent && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "85%", marginTop: 40 }}>
          {[
            { y: notif1Y, icon: "🚔", text: "Police station notified", sub: "Nearest station alerted with your GPS" },
            { y: notif2Y, icon: "👨‍👩‍👧", text: "Parents contacted", sub: "SMS + call sent to Mom & Dad" },
            { y: notif3Y, icon: "📍", text: "Location shared", sub: "Live GPS: 28.6139°N, 77.2090°E" },
          ].map((n, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 20px", borderRadius: 18,
              background: "hsla(152, 60%, 50%, 0.08)",
              border: "1px solid hsla(152, 60%, 50%, 0.2)",
              transform: `translateY(${interpolate(n.y, [0, 1], [40, 0])}px)`,
              opacity: interpolate(n.y, [0, 0.5, 1], [0, 0.7, 1]),
            }}>
              <span style={{ fontSize: 28 }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "hsl(152, 60%, 55%)" }}>{n.text}</div>
                <div style={{ fontSize: 14, color: "hsla(0, 0%, 100%, 0.4)" }}>{n.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
