"use client";

import { useState, useEffect } from "react";
import { Upload, Save, AlertCircle, CheckCircle, Info } from "lucide-react";
import Image from "next/image";

interface UploadSectionProps {
  label: string;
  description: string;
  hint: string;
  settingKey: string;
  value: string;
  onUploaded: (key: string, url: string) => void;
}

function UploadSection({ label, description, hint, settingKey, value, onUploaded }: UploadSectionProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("bucket", "products");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) onUploaded(settingKey, data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-1">{label}</h2>
      <p className="text-gray-500 text-sm mb-4">{description}</p>

      {value && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="h-16 max-w-xs object-contain" />
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={e => onUploaded(settingKey, e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
          placeholder="https://... (URL girin veya yükleyin)"
        />
        <label className="flex items-center gap-2 bg-[#0D1B2A] text-white px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-[#1a2f45] transition-colors whitespace-nowrap">
          <Upload size={16} />
          {uploading ? "Yükleniyor..." : "Dosya Yükle"}
          <input type="file" accept="image/*,.svg,.ico" className="hidden" onChange={handleFile} />
        </label>
      </div>

      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
        <Info size={12} /> {hint}
      </p>
    </div>
  );
}

export default function AdminMediaPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    logo_url: "",
    favicon_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then((data: { key: string; value: string }[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach(s => { map[s.key] = s.value; });
          setSettings(prev => ({ ...prev, logo_url: map.logo_url || "", favicon_url: map.favicon_url || "" }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Logo & Medya</h1>
          <p className="text-gray-500 text-sm">Site logosunu ve favicon'ı yönetin</p>
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
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle size={16} /> Logo ve favicon kaydedildi.
        </div>
      )}

      <UploadSection
        label="Site Logosu"
        description="Header ve footer'da görünür. Yüklendiğinde metin logosunun yerine geçer."
        hint="Önerilen boyut: 200×50 px · PNG veya SVG · Şeffaf arkaplan"
        settingKey="logo_url"
        value={settings.logo_url}
        onUploaded={(key, url) => setSettings(prev => ({ ...prev, [key]: url }))}
      />

      <UploadSection
        label="Favicon"
        description="Tarayıcı sekmesinde görünen ikon."
        hint="Önerilen: 32×32 px · ICO veya PNG formatında"
        settingKey="favicon_url"
        value={settings.favicon_url}
        onUploaded={(key, url) => setSettings(prev => ({ ...prev, [key]: url }))}
      />

      {settings.favicon_url && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          <strong>Favicon not:</strong> Favicon değişikliği için sitenizin{" "}
          <code className="bg-blue-100 px-1 rounded">app/layout.tsx</code> dosyasına{" "}
          <code className="bg-blue-100 px-1 rounded">{"<link rel=\"icon\" href=\"{url}\" />"}</code>{" "}
          eklenmelidir. Şu an kaydedilen URL: {settings.favicon_url}
        </div>
      )}
    </div>
  );
}
