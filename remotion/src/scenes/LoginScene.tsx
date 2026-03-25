import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const PhoneMockup: React.FC<{ children: React.ReactNode; scale?: number }> = ({ children, scale = 1 }) => (
  <div style={{
    width: 380,
    height: 720,
    borderRadius: 40,
    border: "3px solid hsla(0, 0%, 100%, 0.15)",
    background: "hsla(0, 0%, 100%, 0.04)",
    overflow: "hidden",
    transform: `scale(${scale})`,
    position: "relative",
  }}>
    {/* Status bar */}
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "hsla(0, 0%, 0%, 0.3)" }}>
      <span style={{ fontSize: 13, color: "white", fontWeight: 600 }}>9:41</span>
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ width: 16, height: 10, borderRadius: 2, background: "white" }} />
        <div style={{ width: 20, height: 10, borderRadius: 2, border: "1px solid white", display: "flex", alignItems: "center", padding: "0 2px" }}>
          <div style={{ width: "70%", height: 6, borderRadius: 1, background: "hsl(152, 60%, 50%)" }} />
        </div>
      </div>
    </div>
    {children}
  </div>
);

export const LoginScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepLabelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const phoneScale = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const phoneY = interpolate(spring({ frame: frame - 10, fps, config: { damping: 18 } }), [0, 1], [100, 0]);

  // Typing animation for email
  const emailText = "priya@example.com";
  const charsShown = Math.min(Math.floor(Math.max(0, frame - 40) / 2), emailText.length);
  const typedEmail = emailText.slice(0, charsShown);

  // Password dots appearing
  const passwordDots = Math.min(Math.floor(Math.max(0, frame - 60) / 3), 8);

  // Login button highlight
  const btnGlow = frame >= 80 ? interpolate(frame, [80, 90, 95], [0, 1, 0.7], { extrapolateRight: "clamp" }) : 0;

  // Cursor tap on login
  const cursorOpacity = frame >= 82 && frame < 95 ? 1 : 0;
  const cursorScale = frame >= 85 && frame < 90 ? interpolate(frame, [85, 87, 90], [1, 0.8, 1]) : 1;

  // Arrow indicating flow
  const arrowOpacity = interpolate(frame, [90, 100], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily, paddingTop: 120 }}>
      {/* Step indicator */}
      <div style={{
        opacity: stepLabelOpacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 30,
      }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "hsl(346, 77%, 55%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>1</div>
        <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>Login / Sign Up</span>
      </div>

      <div style={{ opacity: stepLabelOpacity, fontSize: 20, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 40, textAlign: "center", maxWidth: 400, lineHeight: 1.5 }}>
        Users create an account with name, email, phone number and password
      </div>

      {/* Phone mockup */}
      <div style={{ transform: `translateY(${phoneY}px) scale(${Math.min(phoneScale, 1)})` }}>
        <PhoneMockup scale={1.15}>
          <div style={{ padding: "40px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "white" }}>Safe</span>
              <span style={{ fontSize: 32, fontWeight: 800, color: "hsl(346, 77%, 55%)" }}>Her</span>
              <div style={{ fontSize: 13, color: "hsla(0, 0%, 100%, 0.4)", marginTop: 4 }}>Welcome back</div>
            </div>

            {/* Email field */}
            <div>
              <div style={{ fontSize: 12, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 6 }}>Email</div>
              <div style={{ height: 44, borderRadius: 12, background: "hsla(0, 0%, 100%, 0.08)", border: "1px solid hsla(0, 0%, 100%, 0.12)", display: "flex", alignItems: "center", padding: "0 14px" }}>
                <span style={{ fontSize: 14, color: "hsla(0, 0%, 100%, 0.9)" }}>{typedEmail}</span>
                {charsShown < emailText.length && (
                  <div style={{ width: 2, height: 18, background: "hsl(346, 77%, 55%)", marginLeft: 1, opacity: Math.sin(frame / 4) > 0 ? 1 : 0 }} />
                )}
              </div>
            </div>

            {/* Password field */}
            <div>
              <div style={{ fontSize: 12, color: "hsla(0, 0%, 100%, 0.5)", marginBottom: 6 }}>Password</div>
              <div style={{ height: 44, borderRadius: 12, background: "hsla(0, 0%, 100%, 0.08)", border: "1px solid hsla(0, 0%, 100%, 0.12)", display: "flex", alignItems: "center", padding: "0 14px", gap: 4 }}>
                {Array.from({ length: passwordDots }).map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "hsla(0, 0%, 100%, 0.7)" }} />
                ))}
              </div>
            </div>

            {/* Login button */}
            <div style={{
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, hsl(346, 77%, 55%), hsl(320, 70%, 50%))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              boxShadow: btnGlow > 0 ? `0 0 ${30 * btnGlow}px hsla(346, 77%, 55%, ${0.5 * btnGlow})` : "none",
              transform: `scale(${cursorScale})`,
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Login →</span>
            </div>

            {/* Cursor */}
            {cursorOpacity > 0 && (
              <div style={{
                position: "absolute",
                left: 200,
                top: 380,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "hsla(0, 0%, 100%, 0.3)",
                border: "2px solid white",
                opacity: cursorOpacity,
              }} />
            )}

            {/* Sign up link */}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <span style={{ fontSize: 13, color: "hsla(0, 0%, 100%, 0.4)" }}>Don't have an account? </span>
              <span style={{ fontSize: 13, color: "hsl(346, 77%, 55%)", fontWeight: 600 }}>Sign Up</span>
            </div>
          </div>
        </PhoneMockup>
      </div>

      {/* Arrow to next */}
      <div style={{ opacity: arrowOpacity, marginTop: 30, fontSize: 22, color: "hsla(0, 0%, 100%, 0.4)", fontWeight: 500 }}>
        After login → Home Screen ↓
      </div>
    </AbsoluteFill>
  );
};
