import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Intro } from "./scenes/Intro";
import { LoginScene } from "./scenes/LoginScene";
import { SOSScene } from "./scenes/SOSScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { ContactsScene } from "./scenes/ContactsScene";
import { FirebaseScene } from "./scenes/FirebaseScene";
import { Outro } from "./scenes/Outro";

export const MainVideo = () => {
  const frame = useCurrentFrame();
  const bgHue = interpolate(frame, [0, 750], [346, 370]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(${135 + Math.sin(frame / 80) * 10}deg, 
            hsl(${bgHue}, 18%, 7%), 
            hsl(${bgHue - 20}, 25%, 10%), 
            hsl(240, 12%, 5%))`,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 400 + i * 80,
            height: 400 + i * 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(346, 77%, 55%, ${0.06 - i * 0.015}), transparent 70%)`,
            left: `${20 + i * 25 + Math.sin((frame + i * 50) / 100) * 8}%`,
            top: `${10 + i * 30 + Math.cos((frame + i * 40) / 70) * 6}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <LoginScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })}
        />
        <TransitionSeries.Sequence durationInFrames={140}>
          <SOSScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })}
        />
        <TransitionSeries.Sequence durationInFrames={130}>
          <ContactsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={130}>
          <FeaturesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <FirebaseScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
