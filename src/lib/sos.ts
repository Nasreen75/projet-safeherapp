import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/lib/device";

export interface SosContact {
  id: string;
  name: string;
  phone: string;
}

export interface SosResult {
  contacts: SosContact[];
  message: string;
  mapsLink: string | null;
}

export const buildSosMessage = (
  userName: string,
  location: { lat: number; lng: number } | null
) => {
  const mapsLink = location
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : null;
  const message =
    `🚨 EMERGENCY SOS from ${userName}. I need help right now!` +
    (mapsLink ? ` My live location: ${mapsLink}` : " (location unavailable)") +
    ` — sent ${new Date().toLocaleString()} via SafeHer.`;
  return { message, mapsLink };
};

/** Saves the SOS alert and returns the contacts to notify with the ready message. */
export const triggerSos = async (
  location: { lat: number; lng: number } | null
): Promise<SosResult> => {
  const deviceId = getDeviceId();
  const user = JSON.parse(localStorage.getItem("safeher_user") || "{}");
  const userName = user.name || "A SafeHer user";

  const { data: contacts, error: contactsError } = await supabase
    .from("emergency_contacts")
    .select("id, name, phone")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: true });

  if (contactsError) throw contactsError;

  const { message, mapsLink } = buildSosMessage(userName, location);

  const { error: alertError } = await supabase.from("sos_alerts").insert({
    device_id: deviceId,
    name: userName,
    phone: user.phone || null,
    email: user.email || null,
    latitude: location?.lat ?? null,
    longitude: location?.lng ?? null,
    message,
    contacts_notified: contacts?.length ?? 0,
  });

  if (alertError) throw alertError;

  return { contacts: contacts ?? [], message, mapsLink };
};

const cleanPhone = (phone: string) => phone.replace(/[^\d+]/g, "");

export const smsLink = (phones: string[], message: string) =>
  `sms:${phones.map(cleanPhone).join(",")}?&body=${encodeURIComponent(message)}`;

export const whatsappLink = (phone: string, message: string) =>
  `https://wa.me/${cleanPhone(phone).replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
