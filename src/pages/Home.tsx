import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Mic, MicOff, MapPin, Bell } from "lucide-react";
import SOSButton from "@/components/SOSButton";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { database, ref, push, set } from "@/lib/firebase";

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [isListening, setIsListening] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("safeher_user");
    if (user) {
      setUserName(JSON.parse(user).name || "User");
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const handleSOS = () => {
    const user = JSON.parse(localStorage.getItem("safeher_user") || "{}");
    const sosData = {
      name: user.name,
      phone: user.phone,
      email: user.email,
      location,
      timestamp: new Date().toISOString(),
      status: "active",
    };
    const existing = JSON.parse(localStorage.getItem("safeher_sos_logs") || "[]");
    existing.push(sosData);
    localStorage.setItem("safeher_sos_logs", JSON.stringify(existing));
  };

  const toggleVoiceDetection = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice Detection Off" : "Voice Detection On 🎙️",
      description: isListening
        ? "Stopped listening for distress signals."
        : "Listening for keywords like 'Help', 'Save me', 'Stop'...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/ai-bot")}
            className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"
          >
            <Bot className="h-5 w-5 text-primary" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <h2 className="text-lg font-bold text-foreground">{userName}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceDetection}
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
              isListening ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center text-muted-foreground">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Location Status */}
      {location && (
        <div className="mx-5 mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-safe/10 text-safe">
          <MapPin className="h-4 w-4" />
          <span className="text-xs font-medium">
            Live location active • {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        </div>
      )}

      {/* Voice Detection Status */}
      {isListening && (
        <div className="mx-5 mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary animate-fade-in">
          <Mic className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-medium">
            Listening for distress keywords...
          </span>
        </div>
      )}

      {/* SOS Section */}
      <div className="flex flex-col items-center justify-center mt-8 mb-10">
        <p className="text-sm text-muted-foreground mb-2">Hold for 1.5 seconds to activate</p>
        <SOSButton onActivate={handleSOS} />
        <p className="text-xs text-muted-foreground mt-6 max-w-[200px] text-center">
          Sends alert to emergency contacts, police & saves your location
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-5 grid grid-cols-2 gap-3">
        <QuickAction icon="👮" title="Alert Police" desc="Notify nearby police station" onClick={() => toast({ title: "Police alerted! 🚔" })} />
        <QuickAction icon="📞" title="Fake Call" desc="Trigger a fake incoming call" onClick={() => navigate("/fake-call")} />
        <QuickAction icon="📍" title="Share Location" desc="Share live location now" onClick={() => toast({ title: "Location shared! 📍" })} />
        <QuickAction icon="🤖" title="AI Assistant" desc="Get safety tips & help" onClick={() => navigate("/ai-bot")} />
      </div>

      <BottomNav />
    </div>
  );
};

const QuickAction = ({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-start gap-1 p-4 rounded-2xl bg-card shadow-card border border-border/50 text-left transition-all active:scale-[0.97]"
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-sm font-semibold text-foreground">{title}</span>
    <span className="text-xs text-muted-foreground">{desc}</span>
  </button>
);

export default Home;
