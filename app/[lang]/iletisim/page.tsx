export const dynamic = "force-dynamic";

import { getTranslations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/layout/ContactForm";

interface PageProps {
  params: Promise<{ lang: string }>;
}

const getInTouchLabels: Record<string, string> = {
  en: "Get In Touch",
  tr: "İletişime Geçin",
  ru: "Свяжитесь с нами",
  ar: "تواصل معنا",
};

const subtitles: Record<string, string> = {
  en: "We're here to help. Get in touch via any channel.",
  tr: "Yardım etmek için buradayız. Herhangi bir kanaldan iletişime geçin.",
  ru: "Мы здесь, чтобы помочь. Свяжитесь с нами любым удобным способом.",
  ar: "نحن هنا للمساعدة. تواصل معنا عبر أي قناة.",
};

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.87.49 3.63 1.35 5.15L2 22l4.99-1.31A9.94 9.94 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.08-1.12l-.29-.18-3.01.79.8-2.95-.19-.3A8 8 0 1112 20zm4.41-5.93c-.23-.12-1.38-.68-1.59-.76-.21-.08-.36-.12-.52.12-.15.23-.6.76-.73.92-.14.15-.27.17-.5.06-.23-.12-1-.37-1.9-1.18a7.1 7.1 0 01-1.31-1.65c-.14-.23-.01-.36.1-.48.11-.1.23-.27.35-.41.12-.13.15-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.52-1.25-.71-1.71-.19-.45-.38-.39-.52-.4h-.44c-.15 0-.39.06-.6.29-.2.23-.78.76-.78 1.86s.8 2.16.91 2.31c.12.15 1.58 2.41 3.83 3.38.53.23.95.37 1.27.47.54.17.03.17.03.17s.1.17.1.17.87.74 1.71.74c.84 0 1.35-.43 1.53-.83.19-.41.19-.75.13-.83-.06-.08-.21-.13-.44-.24z"/>
    </svg>
  );
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const isRtl = lang === "ar";

  const { data: settingsRows } = await supabase.from("settings").select("key, value");
  const s: Record<string, string> = Object.fromEntries(
    (settingsRows || []).map((r) => [r.key, r.value ?? ""])
  );

  const phone = s["phone"] || "+90 551 704 22 68";
  const email = s["email"] || "info@jozufdiesel.com";
  const address = s["address"] || "Istanbul, Turkey";
  const langKey = `working_hours_${lang}`;
  const workingHours = s[langKey] || s["working_hours"] || "Mon-Sat 08:00-18:00";
  const whatsappNum = (s["whatsapp"] || "905517042268").replace(/\D/g, "");
  const phoneTel = phone.replace(/\s/g, "");
  const mapsEmbedUrl = s["maps_embed_url"] || "";
  const mapsAddressUrl = s["maps_address_url"] || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  type ContactItem = {
    iconType: "Phone" | "Mail" | "WhatsApp" | "MapPin" | "Clock";
    label: string;
    value: string;
    href?: string;
  };

  const contacts: ContactItem[] = [
    { iconType: "Phone", label: t.contact.phone2, value: phone, href: `tel:${phoneTel}` },
    { iconType: "Mail", label: t.contact.emailLabel, value: email, href: `mailto:${email}` },
    { iconType: "WhatsApp", label: t.contact.whatsapp, value: phone, href: `https://wa.me/${whatsappNum}` },
    { iconType: "MapPin", label: t.contact.address, value: address, href: mapsAddressUrl },
    { iconType: "Clock", label: t.contact.hours, value: workingHours },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-[#0D1B2A] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-oswald text-5xl font-bold text-white mb-2">{t.contact.title}</h1>
          <p className="text-gray-300">{subtitles[lang] || subtitles.en}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-oswald text-2xl font-bold text-[#0D1B2A] mb-8">{getInTouchLabels[lang] || getInTouchLabels.en}</h2>
            <div className="space-y-4">
              {contacts.map((item, i) => {
                const iconMap = { Phone, Mail, MapPin, Clock };
                const IconComp = item.iconType !== "WhatsApp" ? iconMap[item.iconType as keyof typeof iconMap] : null;
                return (
                  <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-[#C0202A] rounded-xl flex items-center justify-center shrink-0">
                      {IconComp ? <IconComp size={20} className="text-white" /> : <WhatsAppIcon />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-[#0D1B2A] font-semibold hover:text-[#C0202A] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[#0D1B2A] font-semibold">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map */}
            <div className="mt-8 bg-white rounded-2xl overflow-hidden shadow-sm h-64 border border-gray-100">
              {mapsEmbedUrl ? (
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              ) : (
                <a
                  href={mapsAddressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center h-full hover:bg-gray-50 transition-colors"
                >
                  <MapPin size={32} className="text-[#C0202A] mb-2" />
                  <p className="font-medium text-[#0D1B2A] text-sm">{address}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {lang === "tr" ? "Haritada Aç" : lang === "ru" ? "Открыть на карте" : lang === "ar" ? "فتح في الخريطة" : "Open in Maps"}
                  </p>
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <div>
            <ContactForm t={t} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
