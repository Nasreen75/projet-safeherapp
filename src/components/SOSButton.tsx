import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SOSButtonProps {
  onActivate: () => void;
}

const SOSButton = ({ onActivate }: SOSButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handlePressStart = () => {
    const timer = setTimeout(() => {
      setIsActive(true);
      onActivate();
      toast({
        title: "🚨 SOS Alert Sent!",
        description: "Emergency contacts and authorities have been notified with your location.",
      });
    }, 1500);
    setHoldTimer(timer);
  };

  const handlePressEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated rings */}
      <div className="absolute h-48 w-48 rounded-full border-2 border-sos/20 animate-sos-ring" />
      <div className="absolute h-48 w-48 rounded-full border-2 border-sos/15 animate-sos-ring" style={{ animationDelay: "0.5s" }} />
      <div className="absolute h-48 w-48 rounded-full border-2 border-sos/10 animate-sos-ring" style={{ animationDelay: "1s" }} />

      <Button
        variant="sos"
        size="sos"
        className={`animate-sos-pulse z-10 ${isActive ? "bg-safe" : ""}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {isActive ? "SENT ✓" : "SOS"}
      </Button>
    </div>
  );
};

export default SOSButton;
