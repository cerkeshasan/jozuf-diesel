"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const langs = ["en", "tr", "ru", "ar"] as const;
type Lang = typeof langs[number];

const langLabels: Record<Lang, string> = { en: "English", tr: "Türkçe", ru: "Русский", ar: "العربية" };

interface CorporateContent {
  lang: Lang;
  title: string;
  subtitle: string;
  body: string;
  hero_image_url: string;
}

const defaultContent: CorporateContent = { lang: "en", title: "", subtitle: "", body: "", hero_image_url: "" };

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminCorporatePage() {
  const [activeLang, setActiveLang] = useState<Lang>("en");
  const [content, setContent] = useState<Record<Lang, CorporateContent>>({
    en: { ...defaultContent, lang: "en" },
    tr: { ...defaultContent, lang: "tr" },
    ru: { ...defaultContent, lang: "ru" },
    ar: { ...defaultContent, lang: "ar" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.from("corporate_content").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        const map = { ...content };
        data.forEach((row: CorporateContent) => {
          if (row.lang in map) {
            map[row.lang as Lang] = row;
          }
        });
        setContent(map);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const supabase = getSupabase();
      const row = content[activeLang];
      const { error: err } = await supabase
        .from("corporate_content")
        .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "lang" });
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("bucket", "products");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        setContent(prev => ({ ...prev, [activeLang]: { ...prev[activeLang], hero_image_url: data.url } }));
      }
    } finally {
      setUploading(false);
    }
  };

  const update = (field: keyof CorporateContent, value: string) => {
    setContent(prev => ({ ...prev, [activeLang]: { ...prev[activeLang], [field]: value } }));
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  const c = content[activeLang];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Kurumsal Sayfa İçeriği</h1>
          <p className="text-gray-500 text-sm">Her dil için ayrı içerik girebilirsiniz</p>
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
          <CheckCircle size={16} /> {langLabels[activeLang]} içeriği kaydedildi.
        </div>
      )}

      {/* Lang tabs */}
      <div className="flex border-b border-gray-200">
        {langs.map(l => (
          <button
            key={l}
            onClick={() => setActiveLang(l)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeLang === l ? "border-[#C0202A] text-[#C0202A]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {langLabels[l]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Başlık ({langLabels[activeLang]})</label>
          <input
            type="text"
            value={c.title}
            onChange={e => update("title", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            placeholder="About Jozuf Diesel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
          <input
            type="text"
            value={c.subtitle}
            onChange={e => update("subtitle", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            placeholder="30+ years of experience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (HTML destekli)</label>
          <textarea
            rows={12}
            value={c.body}
            onChange={e => update("body", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-y"
            placeholder="<h2>Our Story</h2><p>...</p>"
          />
          <p className="text-xs text-gray-400 mt-1">HTML etiketleri kullanabilirsiniz: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hero Fotoğrafı</label>
          {c.hero_image_url && (
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.hero_image_url} alt="Hero" className="h-32 rounded-xl object-cover" />
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={c.hero_image_url}
              onChange={e => update("hero_image_url", e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
              placeholder="https://..."
            />
            <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors">
              <Upload size={16} />
              {uploading ? "Yükleniyor..." : "Yükle"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
