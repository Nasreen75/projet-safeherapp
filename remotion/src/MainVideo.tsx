import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./scenes/Intro";
import { SOSScene } from "./scenes/SOSScene";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { ContactsScene } from "./scenes/ContactsScene";
import { Outro } from "./scenes/Outro";

export const MainVideo = () => {
  const frame = useCurrentFrame();

  // Persistent animated background
  const bgHue = interpolate(frame, [0, 540], [346, 360]);

  return (
    <AbsoluteFill>
      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${135 + Math.sin(frame / 60) * 15}deg, 
            hsl(${bgHue}, 20%, 8%), 
            hsl(${bgHue - 20}, 30%, 12%), 
            hsl(240, 15%, 6%))`,
        }}
      />

      {/* Floating accent circles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 300 + i * 100,
            height: 300 + i * 100,
            borderRadius: "50%",
            background: `radial-gradient(circle, hsla(346, 77%, 55%, ${0.08 - i * 0.02}), transparent 70%)`,
            left: `${20 + i * 25 + Math.sin((frame + i * 40) / 80) * 10}%`,
            top: `${15 + i * 30 + Math.cos((frame + i * 30) / 60) * 8}%`,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}

      {/* Scene transitions */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <SOSScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <FeaturesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <ContactsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
