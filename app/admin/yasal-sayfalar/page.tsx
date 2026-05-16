"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const langs = ["en", "tr", "ru", "ar"] as const;
type Lang = typeof langs[number];
const langLabels: Record<Lang, string> = { en: "English", tr: "Türkçe", ru: "Русский", ar: "العربية" };

const slugs = [
  { value: "privacy", label: "Gizlilik Politikası" },
  { value: "terms", label: "Kullanım Şartları" },
  { value: "kvkk", label: "KVKK" },
] as const;
type Slug = typeof slugs[number]["value"];

interface LegalPage {
  slug: Slug;
  lang: Lang;
  title: string;
  content: string;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminLegalPagesPage() {
  const [activeSlug, setActiveSlug] = useState<Slug>("privacy");
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [pages, setPages] = useState<Record<string, LegalPage>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    supabase.from("legal_pages").select("*").then(({ data }) => {
      if (data) {
        const map: Record<string, LegalPage> = {};
        data.forEach((row: LegalPage) => {
          map[`${row.slug}_${row.lang}`] = row;
        });
        setPages(map);
      }
      setLoading(false);
    });
  }, []);

  const key = `${activeSlug}_${activeLang}`;
  const current = pages[key] || { slug: activeSlug, lang: activeLang, title: "", content: "" };

  const update = (field: "title" | "content", value: string) => {
    setPages(prev => ({ ...prev, [key]: { ...current, [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const supabase = getSupabase();
      const { error: err } = await supabase
        .from("legal_pages")
        .upsert(
          { slug: activeSlug, lang: activeLang, title: current.title, content: current.content, updated_at: new Date().toISOString() },
          { onConflict: "slug,lang" }
        );
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Kaydetme hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Yasal Sayfalar</h1>
          <p className="text-gray-500 text-sm">Gizlilik, kullanım şartları ve KVKK içerikleri</p>
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
          <CheckCircle size={16} /> Kaydedildi.
        </div>
      )}

      {/* Page type tabs */}
      <div className="flex gap-2 flex-wrap">
        {slugs.map(s => (
          <button
            key={s.value}
            onClick={() => setActiveSlug(s.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeSlug === s.value ? "bg-[#0D1B2A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Sayfa Başlığı ({langLabels[activeLang]})</label>
          <input
            type="text"
            value={current.title}
            onChange={e => update("title", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            placeholder="Privacy Policy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (HTML destekli)</label>
          <textarea
            rows={16}
            value={current.content}
            onChange={e => update("content", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-y"
            placeholder="<h2>1. Section</h2><p>Content...</p>"
          />
          <p className="text-xs text-gray-400 mt-1">HTML etiketleri kullanabilirsiniz. Boş bırakırsanız varsayılan içerik gösterilir.</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <strong>Not:</strong> Bu içerikler doldurulduğunda ilgili sayfada (/{activeSlug}) gösterilir. Boş bırakırsanız varsayılan (kod içindeki) içerik gösterilir.
      </div>
    </div>
  );
}
