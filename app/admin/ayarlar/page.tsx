"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

const settingGroups = [
  {
    title: "İletişim",
    icon: "📞",
    keys: [
      { key: "phone", label: "Telefon", placeholder: "+90 551 704 22 68" },
      { key: "email", label: "Email", placeholder: "info@jozufdiesel.com" },
      { key: "address", label: "Adres", placeholder: "Istanbul, Turkey" },
    ],
  },
  {
    title: "Çalışma Saatleri (Dil Bazında)",
    icon: "🕐",
    keys: [
      { key: "working_hours_en", label: "Çalışma Saatleri (EN)", placeholder: "Mon-Sat 08:00-18:00" },
      { key: "working_hours_tr", label: "Çalışma Saatleri (TR)", placeholder: "Pzt-Cmt 08:00-18:00" },
      { key: "working_hours_ru", label: "Çalışma Saatleri (RU)", placeholder: "Пн-Сб 08:00-18:00" },
      { key: "working_hours_ar", label: "Çalışma Saatleri (AR)", placeholder: "الاثنين-السبت 08:00-18:00" },
    ],
  },
  {
    title: "Harita & Adres",
    icon: "📍",
    keys: [
      { key: "maps_embed_url", label: "Google Maps Embed URL", placeholder: "https://www.google.com/maps/embed?pb=..." },
      { key: "maps_address_url", label: "Google Maps Adres URL", placeholder: "https://maps.google.com/?q=Istanbul+Turkey" },
    ],
  },
  {
    title: "Hero Başlıkları",
    icon: "🏠",
    keys: [
      { key: "hero_title_en", label: "Hero Başlık (EN)", placeholder: "" },
      { key: "hero_title_tr", label: "Hero Başlık (TR)", placeholder: "" },
      { key: "hero_title_ru", label: "Hero Başlık (RU)", placeholder: "" },
      { key: "hero_title_ar", label: "Hero Başlık (AR)", placeholder: "" },
    ],
  },
  {
    title: "Hero Alt Başlıklar",
    icon: "📝",
    keys: [
      { key: "hero_subtitle_en", label: "Hero Alt Başlık (EN)", placeholder: "" },
      { key: "hero_subtitle_tr", label: "Hero Alt Başlık (TR)", placeholder: "" },
      { key: "hero_subtitle_ru", label: "Hero Alt Başlık (RU)", placeholder: "" },
      { key: "hero_subtitle_ar", label: "Hero Alt Başlık (AR)", placeholder: "" },
    ],
  },
  {
    title: "Sosyal Medya",
    icon: "🌐",
    keys: [
      { key: "whatsapp", label: "WhatsApp Numarası", placeholder: "905517042268" },
      { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/jozufdiesel" },
      { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/jozufdiesel" },
      { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/jozufdiesel" },
      { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@jozufdiesel" },
      { key: "twitter", label: "Twitter / X URL", placeholder: "https://x.com/jozufdiesel" },
    ],
  },
  {
    title: "Analitik",
    icon: "📊",
    keys: [
      { key: "google_analytics", label: "Google Analytics ID", placeholder: "G-XXXXXXXXXX" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: { key: string; value: string }[] | { error: string }) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach((s) => { map[s.key] = s.value; });
          setSettings(map);
        }
      })
      .catch(() => setError("Ayarlar yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await adminFetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Hata: ${res.status}`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Site Ayarları</h1>
          <p className="text-gray-500 text-sm">Genel site yapılandırması</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#C0202A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#a81b23] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle size={16} /> Ayarlar kaydedildi.
        </div>
      )}

      {settingGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4 flex items-center gap-2">
            <span>{group.icon}</span> {group.title}
          </h2>
          <div className="space-y-4">
            {group.keys.map((setting) => (
              <div key={setting.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {setting.label}
                </label>
                <input
                  type="text"
                  value={settings[setting.key] ?? ""}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, [setting.key]: e.target.value }))
                  }
                  placeholder={setting.placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
