import { useState } from "react";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const safetyResponses: Record<string, string> = {
  help: "If you're in immediate danger, press the SOS button on the home screen. It will alert your emergency contacts and share your location with authorities.",
  safe: "Here are some safety tips:\n• Always share your live location with trusted contacts\n• Save emergency numbers on speed dial\n• Trust your instincts — if something feels wrong, leave\n• Use the Fake Call feature to exit uncomfortable situations",
  harassment: "If you're facing harassment:\n1. Document everything (screenshots, recordings)\n2. Report to local police — dial 100\n3. Contact Women Helpline — 181\n4. Use SafeHer's SOS to alert your contacts immediately",
  night: "Safety tips for night travel:\n• Share your live location\n• Keep someone informed of your route\n• Stay in well-lit areas\n• Keep your phone charged\n• Have a fake call ready",
  default: "I'm your SafeHer AI safety assistant! I can help with:\n• Emergency guidance\n• Safety tips\n• Harassment advice\n• Night travel safety\n\nHow can I help you stay safe?",
};

const getResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("help") || lower.includes("danger") || lower.includes("emergency")) return safetyResponses.help;
  if (lower.includes("safe") || lower.includes("tip")) return safetyResponses.safe;
  if (lower.includes("harass") || lower.includes("stalk") || lower.includes("follow")) return safetyResponses.harassment;
  if (lower.includes("night") || lower.includes("travel") || lower.includes("cab") || lower.includes("walk")) return safetyResponses.night;
  return safetyResponses.default;
};

const AIBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! I'm your SafeHer AI assistant 🛡️\n\nI can help you with safety tips, emergency guidance, and more. What do you need help with?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user" };
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: getResponse(input), sender: "bot" };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      <header className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-border">
        <button onClick={() => window.history.back()} className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">SafeHer AI</h1>
            <p className="text-[10px] text-safe font-medium">● Online</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-primary/10" : "bg-surface"}`}>
                {msg.sender === "user" ? <User className="h-3 w-3 text-primary" /> : <Bot className="h-3 w-3 text-primary" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card shadow-card border border-border/50 text-foreground rounded-bl-md"
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about safety..."
            className="h-11 rounded-xl bg-surface flex-1"
          />
          <Button size="icon" variant="default" className="rounded-xl h-11 w-11" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIBot;
