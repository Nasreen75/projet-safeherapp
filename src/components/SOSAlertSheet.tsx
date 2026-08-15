import { MessageSquare, Send, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SosContact, smsLink, whatsappLink } from "@/lib/sos";

interface Props {
  open: boolean;
  onClose: () => void;
  contacts: SosContact[];
  message: string;
}

const SOSAlertSheet = ({ open, onClose, contacts, message }: Props) => {
  if (!open) return null;

  const allPhones = contacts.map((c) => c.phone);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-t-3xl bg-card border border-border/50 p-5 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">🚨 SOS alert ready</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Alert saved with your live location
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl bg-surface p-3 text-xs text-muted-foreground mb-4 leading-relaxed">
          {message}
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-foreground font-semibold">No emergency contacts saved</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add contacts so alerts can reach them instantly.
            </p>
          </div>
        ) : (
          <>
            <Button
              variant="hero"
              className="w-full mb-3"
              onClick={() => { window.location.href = smsLink(allPhones, message); }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send SMS to all {contacts.length} contacts
            </Button>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Users className="h-3.5 w-3.5" /> Or send individually
            </div>

            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl bg-surface">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                  <a
                    href={smsLink([c.phone], message)}
                    className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> SMS
                  </a>
                  <a
                    href={whatsappLink(c.phone, message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-3 rounded-lg bg-safe/10 text-safe text-xs font-semibold flex items-center"
                  >
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SOSAlertSheet;
