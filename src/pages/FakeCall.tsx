import { useState, useEffect } from "react";
import { Phone, PhoneOff, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";

const FakeCall = () => {
  const [callerName, setCallerName] = useState("Mom");
  const [delay, setDelay] = useState(5);
  const [isRinging, setIsRinging] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnCall) {
      interval = setInterval(() => setCallDuration((d) => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOnCall]);

  const triggerFakeCall = () => {
    setTimeout(() => {
      setIsRinging(true);
    }, delay * 1000);
  };

  const answerCall = () => {
    setIsRinging(false);
    setIsOnCall(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsRinging(false);
    setIsOnCall(false);
    setCallDuration(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (isRinging) {
    return (
      <div className="min-h-screen bg-foreground flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-pulse mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground">{callerName}</h2>
          <p className="text-primary-foreground/60 text-sm mt-1">Incoming Call...</p>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={endCall} className="h-16 w-16 rounded-full bg-destructive flex items-center justify-center">
            <PhoneOff className="h-7 w-7 text-destructive-foreground" />
          </button>
          <button onClick={answerCall} className="h-16 w-16 rounded-full bg-safe flex items-center justify-center animate-bounce">
            <Phone className="h-7 w-7 text-safe-foreground" />
          </button>
        </div>
      </div>
    );
  }

  if (isOnCall) {
    return (
      <div className="min-h-screen bg-foreground flex flex-col items-center justify-center px-6 text-center">
        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <User className="h-12 w-12 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-primary-foreground">{callerName}</h2>
        <p className="text-safe text-sm mt-1 font-mono">{formatTime(callDuration)}</p>
        <button onClick={endCall} className="mt-12 h-16 w-16 rounded-full bg-destructive flex items-center justify-center">
          <PhoneOff className="h-7 w-7 text-destructive-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => window.history.back()} className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Fake Call</h1>
      </header>

      <div className="px-5 space-y-4">
        <div className="p-5 rounded-2xl bg-card shadow-card border border-border/50 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Caller Name</label>
            <Input value={callerName} onChange={(e) => setCallerName(e.target.value)} className="h-11 rounded-xl bg-surface" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Delay (seconds)</label>
            <Input type="number" value={delay} onChange={(e) => setDelay(Number(e.target.value))} min={1} max={60} className="h-11 rounded-xl bg-surface" />
          </div>
          <Button variant="hero" size="lg" className="w-full rounded-2xl" onClick={triggerFakeCall}>
            <Phone className="h-4 w-4 mr-1" />
            Schedule Fake Call
          </Button>
        </div>

        <div className="p-4 rounded-2xl bg-card shadow-card border border-border/50">
          <h3 className="font-semibold text-sm text-foreground mb-2">💡 Tips</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Set a short delay to quickly escape uncomfortable situations</li>
            <li>• Use a realistic caller name for authenticity</li>
            <li>• The call screen looks like a real phone call</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default FakeCall;
