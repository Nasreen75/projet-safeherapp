import { ArrowLeft, Shield, AlertTriangle, Eye, Volume2, Fingerprint, Route } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const features = [
  {
    icon: Shield,
    title: "SOS Alert System",
    desc: "One-press emergency alert to contacts, police, and family with real-time location.",
    color: "text-sos bg-sos/10",
  },
  {
    icon: Volume2,
    title: "Voice Detection",
    desc: "AI listens for distress keywords like 'Help', 'Stop', and auto-triggers SOS.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: AlertTriangle,
    title: "Fake Call Detection",
    desc: "Trigger a realistic fake phone call to escape uncomfortable situations.",
    color: "text-warning bg-warning/10",
  },
  {
    icon: Eye,
    title: "Stealth Mode",
    desc: "Discreetly send alerts without the attacker knowing. Works with screen off.",
    color: "text-safe bg-safe/10",
  },
  {
    icon: Fingerprint,
    title: "Shake to Alert",
    desc: "Shake your phone vigorously to trigger an instant SOS alert.",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Route,
    title: "Safe Route Finder",
    desc: "Find the safest route home based on lighting, police stations & crowd density.",
    color: "text-primary bg-primary/10",
  },
];

const helplines = [
  { name: "Women Helpline", number: "181" },
  { name: "Police", number: "100" },
  { name: "Ambulance", number: "108" },
  { name: "NCW", number: "7827-170-170" },
];

const Safety = () => {
  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={() => window.history.back()} className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Safety Features</h1>
      </header>

      <div className="px-5 space-y-4">
        <div className="grid gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 p-4 rounded-2xl bg-card shadow-card border border-border/50">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-card shadow-card border border-border/50">
          <h3 className="font-semibold text-sm text-foreground mb-3">📞 Emergency Helplines</h3>
          <div className="grid grid-cols-2 gap-2">
            {helplines.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface text-center"
              >
                <span className="text-xs font-medium text-foreground">{h.name}</span>
                <span className="text-xs font-bold text-primary">{h.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Safety;
