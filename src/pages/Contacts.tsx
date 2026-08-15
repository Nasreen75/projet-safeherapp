import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
}

const getDeviceId = () => {
  let id = localStorage.getItem("safeher_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("safeher_device_id", id);
  }
  return id;
};

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const { toast } = useToast();
  const deviceId = getDeviceId();

  const loadContacts = async () => {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("id, name, phone, relation")
      .eq("device_id", deviceId)
      .order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      toast({ title: "Failed to load contacts", variant: "destructive" });
      return;
    }
    setContacts(data ?? []);
  };

  useEffect(() => {
    loadContacts();

    const channel = supabase
      .channel("emergency_contacts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergency_contacts" },
        () => loadContacts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Name and phone are required", variant: "destructive" });
      return;
    }

    if (editId) {
      const { error } = await supabase
        .from("emergency_contacts")
        .update({ name: name.trim(), phone: phone.trim(), relation: relation.trim() || null })
        .eq("id", editId);
      if (error) {
        console.error(error);
        toast({ title: "Failed to update contact", variant: "destructive" });
        return;
      }
      toast({ title: "Contact updated ✅" });
    } else {
      const { error } = await supabase.from("emergency_contacts").insert({
        device_id: deviceId,
        name: name.trim(),
        phone: phone.trim(),
        relation: relation.trim() || null,
      });
      if (error) {
        console.error(error);
        toast({ title: "Failed to save contact", variant: "destructive" });
        return;
      }
      toast({ title: "Contact added ✅" });
    }

    await loadContacts();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast({ title: "Failed to delete contact", variant: "destructive" });
      return;
    }
    toast({ title: "Contact removed" });
    await loadContacts();
  };

  const handleEdit = (c: Contact) => {
    setEditId(c.id);
    setName(c.name);
    setPhone(c.phone);
    setRelation(c.relation ?? "");
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setName("");
    setPhone("");
    setRelation("");
  };

  return (
    <div className="min-h-screen bg-gradient-surface pb-20">
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Emergency Contacts</h1>
        </div>
        <Button size="icon" variant="default" className="rounded-xl" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-5 w-5" />
        </Button>
      </header>

      {showForm && (
        <div className="mx-5 mb-4 p-4 rounded-2xl bg-card shadow-card border border-border/50 animate-slide-up space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-surface" />
          <Input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl bg-surface" />
          <Input placeholder="Relation (e.g. Mom, Friend)" value={relation} onChange={(e) => setRelation(e.target.value)} className="h-11 rounded-xl bg-surface" />
          <div className="flex gap-2">
            <Button variant="hero" className="flex-1" onClick={handleSubmit}>
              {editId ? "Update" : "Add Contact"}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="px-5 space-y-3">
        {contacts.length === 0 && !showForm && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-muted-foreground text-sm">No emergency contacts yet</p>
            <p className="text-muted-foreground text-xs mt-1">Add contacts who'll be notified during SOS</p>
          </div>
        )}
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-4 rounded-2xl bg-card shadow-card border border-border/50">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.phone} {c.relation && `• ${c.relation}`}</p>
            </div>
            <div className="flex items-center gap-1">
              <a href={`tel:${c.phone}`} className="h-8 w-8 rounded-lg bg-safe/10 flex items-center justify-center text-safe">
                <Phone className="h-4 w-4" />
              </a>
              <button onClick={() => handleEdit(c)} className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Contacts;
