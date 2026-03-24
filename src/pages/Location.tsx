import { useState, useEffect } from "react";
import { MapPin, Share2, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const Location = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => toast({ title: "Location access denied", variant: "destructive" })
      );
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, []);

  const toggleLiveTracking = () => {
    if (watching && watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setWatching(false);
      toast({ title: "Live tracking stopped" });
    } else {
      const id = navigator.geolocation.watchPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
      setWatchId(id);
      setWatching(true);
      toast({ title: "Live tracking started 📍" });
    }
  };

  const shareLocation = () => {
    if (!location) return;
    const url = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    if (navigator.share) {
      navigator.share({ title: "My Location - SafeHer", url });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Location link copied! 📋" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => window.history.back()} className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Live Location</h1>
      </header>

      <div className="px-5 space-y-4">
        {/* Map placeholder */}
        <div className="h-64 rounded-2xl bg-card shadow-card border border-border/50 flex flex-col items-center justify-center gap-3 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <MapPin className="h-10 w-10 text-primary relative z-10" />
          {location ? (
            <div className="text-center relative z-10">
              <p className="text-sm font-semibold text-foreground">Your Location</p>
              <p className="text-xs text-muted-foreground mt-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground relative z-10">Fetching location...</p>
          )}
        </div>

        {/* Status */}
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${watching ? "bg-safe/10 text-safe" : "bg-surface text-muted-foreground"}`}>
          <Navigation className="h-4 w-4" />
          <span className="text-xs font-medium">
            {watching ? "🟢 Live tracking active" : "⚪ Live tracking inactive"}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant={watching ? "safe" : "hero"} size="lg" onClick={toggleLiveTracking} className="rounded-2xl">
            <Navigation className="h-4 w-4 mr-1" />
            {watching ? "Stop" : "Start"} Tracking
          </Button>
          <Button variant="outline" size="lg" onClick={shareLocation} className="rounded-2xl" disabled={!location}>
            <Share2 className="h-4 w-4 mr-1" />
            Share Location
          </Button>
        </div>

        {/* Info cards */}
        <div className="p-4 rounded-2xl bg-card shadow-card border border-border/50">
          <h3 className="font-semibold text-sm text-foreground mb-2">How it works</h3>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>📍 Your location is tracked in real-time</li>
            <li>🚨 During SOS, location is shared with contacts & police</li>
            <li>🔒 Your location data is encrypted and private</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Location;
