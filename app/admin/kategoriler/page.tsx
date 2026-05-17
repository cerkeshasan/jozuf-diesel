"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderOpen, AlertCircle, CheckCircle, Copy } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import type { Category } from "@/lib/supabase";
import ImageUpload from "@/components/ui/ImageUpload";

const emptyForm = {
  name_en: "", name_tr: "", name_ru: "", name_ar: "",
  slug: "", parent_id: "", image_url: "", order_index: 0,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCategories = () =>
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setCategories(data) : setCategories([]))
      .finally(() => setLoading(false));

  useEffect(() => { fetchCategories(); }, []);

  const openEdit = (cat: Category) => {
    setEditCat(cat);
    setForm({
      name_en: cat.name_en,
      name_tr: cat.name_tr || "",
      name_ru: cat.name_ru || "",
      name_ar: cat.name_ar || "",
      slug: cat.slug,
      parent_id: cat.parent_id || "",
      image_url: cat.image_url || "",
      order_index: cat.order_index,
    });
    setError("");
    setShowForm(true);
  };

  const openNew = () => {
    setEditCat(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const autoSlug = () => {
    const slug = form.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm((f) => ({ ...f, slug }));
  };

  const handleSave = async () => {
    setError("");

    if (!form.name_en.trim()) { setError("İngilizce ad zorunludur."); return; }
    if (!form.slug.trim()) { setError("Slug zorunludur. 'Auto' butonuna tıklayın."); return; }

    setSaving(true);
    const payload = {
      name_en: form.name_en,
      name_tr: form.name_tr || null,
      name_ru: form.name_ru || null,
      name_ar: form.name_ar || null,
      slug: form.slug,
      parent_id: form.parent_id || null,
      image_url: form.image_url || null,
      order_index: Number(form.order_index) || 0,
    };

    const url = editCat ? `/api/categories?id=${editCat.id}` : "/api/categories";
    const method = editCat ? "PUT" : "POST";

    try {
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Hata: ${res.status}`);
        setSaving(false);
        return;
      }

      setSuccess(editCat ? "Kategori güncellendi." : "Kategori eklendi.");
      setTimeout(() => setSuccess(""), 3000);
      setShowForm(false);
      await fetchCategories();
    } catch (e) {
      setError("Bağlantı hatası. Tekrar deneyin.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) return;
    const res = await adminFetch(`/api/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((c) => c.filter((cat) => cat.id !== id));
      setSelected((s) => { const n = new Set(s); n.delete(id); return n; });
      setSuccess("Kategori silindi.");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Silme başarısız.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} kategoriyi silmek istediğinizden emin misiniz?`)) return;
    setBulkDeleting(true);
    let deleted = 0;
    for (const id of selected) {
      const res = await adminFetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) deleted++;
    }
    setSelected(new Set());
    setSuccess(`${deleted} kategori silindi.`);
    setTimeout(() => setSuccess(""), 3000);
    setBulkDeleting(false);
    await fetchCategories();
  };

  const toggleSelect = (id: string) => {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    const allIds = categories.map((c) => c.id);
    setSelected(selected.size === allIds.length ? new Set() : new Set(allIds));
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const parents = categories.filter((c) => !c.parent_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Kategoriler</h1>
          <p className="text-gray-500 text-sm">{categories.length} kategori</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
            >
              <Trash2 size={15} />
              {bulkDeleting ? "Siliniyor..." : `${selected.size} Seçiliyi Sil`}
            </button>
          )}
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#C0202A] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#a81b23] transition-colors"
          >
            <Plus size={18} />
            Yeni Kategori
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          <CheckCircle size={18} /> {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">
            {editCat ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
          </h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {(["en", "tr", "ru", "ar"] as const).map((lang) => (
              <div key={lang}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad ({lang.toUpperCase()}) {lang === "en" && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={form[`name_${lang}`]}
                  onChange={(e) => setForm({ ...form, [`name_${lang}`]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                  placeholder={lang === "en" ? "Bosch Common Rail" : ""}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                  placeholder="bosch-common-rail"
                />
                <button
                  type="button"
                  onClick={autoSlug}
                  className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-medium hover:bg-gray-200"
                >
                  Auto
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Üst Kategori</label>
              <select
                value={form.parent_id}
                onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
              >
                <option value="">Ana Kategori (Üst yok)</option>
                {parents.filter((p) => p.id !== editCat?.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name_en}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Görseli</label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                bucket="categories"
                label="Kategori görseli yükle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#C0202A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#a81b23] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</>
              ) : (
                "Kaydet"
              )}
            </button>
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Yükleniyor...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FolderOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p>Henüz kategori yok</p>
          </div>
        ) : (
          <>
          {/* Table header */}
          <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <input
              type="checkbox"
              checked={selected.size === categories.length && categories.length > 0}
              onChange={toggleAll}
              className="accent-[#C0202A] w-4 h-4"
            />
            <span className="w-5" />
            <span className="flex-1">Kategori</span>
            <span className="w-64 hidden md:block">ID</span>
            <span className="w-28 text-right">İşlem</span>
          </div>

          <div className="divide-y divide-gray-50">
            {parents.map((cat) => (
              <div key={cat.id}>
                <div className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 ${selected.has(cat.id) ? "bg-red-50/40" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.has(cat.id)}
                    onChange={() => toggleSelect(cat.id)}
                    className="accent-[#C0202A] w-4 h-4 shrink-0"
                  />
                  <FolderOpen size={18} className="text-[#C0202A] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#0D1B2A]">{cat.name_en}</p>
                    <p className="text-xs text-gray-400">/{cat.slug} · {cat.product_count} ürün</p>
                  </div>
                  <div className="w-64 hidden md:flex items-center gap-1.5">
                    <span className="font-mono text-xs text-gray-400 truncate">{cat.id}</span>
                    <button
                      onClick={() => copyId(cat.id)}
                      className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
                      title="Kopyala"
                    >
                      {copiedId === cat.id ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  </div>
                  <div className="flex gap-2 w-28 justify-end">
                    <button onClick={() => openEdit(cat)} className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                      <Edit size={12} /> Düzenle
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name_en)} className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg">
                      <Trash2 size={12} /> Sil
                    </button>
                  </div>
                </div>
                {categories.filter((c) => c.parent_id === cat.id).map((child) => (
                  <div key={child.id} className={`flex items-center gap-4 px-6 py-3 pl-14 bg-gray-50/50 hover:bg-gray-50 ${selected.has(child.id) ? "bg-red-50/40" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selected.has(child.id)}
                      onChange={() => toggleSelect(child.id)}
                      className="accent-[#C0202A] w-4 h-4 shrink-0"
                    />
                    <FolderOpen size={14} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0D1B2A]">{child.name_en}</p>
                      <p className="text-xs text-gray-400">/{child.slug}</p>
                    </div>
                    <div className="w-64 hidden md:flex items-center gap-1.5">
                      <span className="font-mono text-xs text-gray-400 truncate">{child.id}</span>
                      <button onClick={() => copyId(child.id)} className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors" title="Kopyala">
                        {copiedId === child.id ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                    <div className="flex gap-2 w-28 justify-end">
                      <button onClick={() => openEdit(child)} className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                        <Edit size={12} /> Düzenle
                      </button>
                      <button onClick={() => handleDelete(child.id, child.name_en)} className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg">
                        <Trash2 size={12} /> Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
