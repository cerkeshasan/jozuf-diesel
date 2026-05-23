"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderOpen, AlertCircle, CheckCircle, Copy, ChevronDown, ChevronRight, Download } from "lucide-react";
import * as XLSX from "xlsx";
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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchCategories = () =>
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          // Başlangıçta tüm ana kategorileri aç
          const parentIds = data.filter((c: Category) => !c.parent_id).map((c: Category) => c.id);
          setExpandedIds(new Set(parentIds));
        } else {
          setCategories([]);
        }
      })
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openNew = (parentId = "") => {
    setEditCat(null);
    setForm({ ...emptyForm, parent_id: parentId });
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      if (!res.ok) { setError(data.error || `Hata: ${res.status}`); setSaving(false); return; }
      setSuccess(editCat ? "Kategori güncellendi." : "Kategori eklendi.");
      setTimeout(() => setSuccess(""), 3000);
      setShowForm(false);
      await fetchCategories();
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const children = categories.filter(c => c.parent_id === id);
    const msg = children.length > 0
      ? `"${name}" ve içindeki ${children.length} alt kategori silinecek. Emin misiniz?`
      : `"${name}" kategorisini silmek istediğinizden emin misiniz?`;
    if (!confirm(msg)) return;
    const res = await adminFetch(`/api/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((c) => c.filter((cat) => cat.id !== id && cat.parent_id !== id));
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

  const toggleSelect = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = () => {
    const allIds = categories.map((c) => c.id);
    setSelected(selected.size === allIds.length ? new Set() : new Set(allIds));
  };

  const toggleExpand = (id: string) =>
    setExpandedIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const exportExcel = () => {
    const rows: Record<string, string | number>[] = [];
    const sorted = categories
      .filter(c => !c.parent_id)
      .sort((a, b) => a.order_index - b.order_index);

    for (const parent of sorted) {
      rows.push({
        "Tür": "Ana Kategori",
        "Üst Kategori": "",
        "Üst Kategori ID": "",
        "Ad (TR)": parent.name_tr || "",
        "Ad (EN)": parent.name_en,
        "Ad (RU)": parent.name_ru || "",
        "Ad (AR)": parent.name_ar || "",
        "Slug": parent.slug,
        "Sıra": parent.order_index,
        "ID": parent.id,
      });
      const subs = categories
        .filter(c => c.parent_id === parent.id)
        .sort((a, b) => a.order_index - b.order_index);
      for (const sub of subs) {
        rows.push({
          "Tür": "Alt Kategori",
          "Üst Kategori": parent.name_tr || parent.name_en,
          "Üst Kategori ID": parent.id,
          "Ad (TR)": sub.name_tr || "",
          "Ad (EN)": sub.name_en,
          "Ad (RU)": sub.name_ru || "",
          "Ad (AR)": sub.name_ar || "",
          "Slug": sub.slug,
          "Sıra": sub.order_index,
          "ID": sub.id,
        });
      }
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 14 }, { wch: 24 }, { wch: 38 },
      { wch: 24 }, { wch: 24 }, { wch: 24 }, { wch: 24 },
      { wch: 28 }, { wch: 6 }, { wch: 38 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kategoriler");
    XLSX.writeFile(wb, "jozuf-kategoriler.xlsx");
  };

  const parents = categories.filter((c) => !c.parent_id).sort((a, b) => a.order_index - b.order_index);
  const isSubForm = showForm && !!form.parent_id;
  const formParentName = form.parent_id ? categories.find(c => c.id === form.parent_id)?.name_en : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Kategoriler</h1>
          <p className="text-gray-500 text-sm">{parents.length} ana · {categories.length - parents.length} alt kategori</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 text-sm">
              <Trash2 size={15} />
              {bulkDeleting ? "Siliniyor..." : `${selected.size} Seçiliyi Sil`}
            </button>
          )}
          <button onClick={exportExcel} disabled={categories.length === 0}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-40 text-sm">
            <Download size={15} /> Excel İndir
          </button>
          <button onClick={() => openNew("")}
            className="flex items-center gap-2 bg-[#C0202A] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#a81b23] transition-colors">
            <Plus size={18} /> Yeni Ana Kategori
          </button>
        </div>
      </div>

      {/* Bildirimler */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          <CheckCircle size={18} /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-[#C0202A]/20">
          {/* Form başlığı */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSubForm ? "bg-blue-100" : "bg-[#C0202A]/10"}`}>
              <FolderOpen size={16} className={isSubForm ? "text-blue-600" : "text-[#C0202A]"} />
            </div>
            <div>
              <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg leading-none">
                {editCat ? "Kategori Düzenle" : isSubForm ? "Alt Kategori Ekle" : "Ana Kategori Ekle"}
              </h2>
              {isSubForm && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Üst kategori: <span className="font-medium text-blue-600">{formParentName}</span>
                </p>
              )}
            </div>
          </div>

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
                  placeholder={
                    lang === "en" ? (isSubForm ? "Leak-Off Connectors" : "Injector Parts") :
                    lang === "tr" ? (isSubForm ? "Geri Dönüş Plastikleri" : "Enjektör Malzemeleri") : ""
                  }
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
                  placeholder="leak-off-connectors"
                />
                <button type="button" onClick={autoSlug}
                  className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-medium hover:bg-gray-200">
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
                <option value="">— Ana Kategori (üst yok)</option>
                {parents.filter((p) => p.id !== editCat?.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name_tr || p.name_en}</option>
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
            <button onClick={handleSave} disabled={saving}
              className="bg-[#C0202A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#a81b23] transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Kaydediliyor...</>) : "Kaydet"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Kategori listesi */}
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
            {/* Tablo başlığı */}
            <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <input type="checkbox"
                checked={selected.size === categories.length && categories.length > 0}
                onChange={toggleAll}
                className="accent-[#C0202A] w-4 h-4" />
              <span className="flex-1">Kategori adı</span>
              <span className="hidden lg:block w-72">ID</span>
              <span className="w-52 text-right">İşlemler</span>
            </div>

            <div className="divide-y divide-gray-50">
              {parents.map((cat) => {
                const subs = categories
                  .filter(c => c.parent_id === cat.id)
                  .sort((a, b) => a.order_index - b.order_index);
                const isExpanded = expandedIds.has(cat.id);

                return (
                  <div key={cat.id}>
                    {/* Ana kategori satırı */}
                    <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors ${selected.has(cat.id) ? "bg-red-50/40" : ""}`}>
                      <input type="checkbox" checked={selected.has(cat.id)} onChange={() => toggleSelect(cat.id)}
                        className="accent-[#C0202A] w-4 h-4 shrink-0" />

                      {/* Açma/kapama */}
                      <button onClick={() => toggleExpand(cat.id)}
                        className="shrink-0 text-gray-400 hover:text-[#C0202A] transition-colors">
                        {isExpanded
                          ? <ChevronDown size={16} />
                          : <ChevronRight size={16} />}
                      </button>

                      <FolderOpen size={17} className="text-[#C0202A] shrink-0" />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0D1B2A]">
                          {cat.name_tr || cat.name_en}
                          {cat.name_tr && cat.name_tr !== cat.name_en && (
                            <span className="ml-1.5 text-xs text-gray-400 font-normal">({cat.name_en})</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">/{cat.slug} · {subs.length} alt kategori</p>
                      </div>

                      <button onClick={() => copyId(cat.id)}
                        className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-[#C0202A] hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors w-72"
                        title="ID kopyala">
                        <span className="truncate">{cat.id}</span>
                        {copiedId === cat.id ? <CheckCircle size={12} className="text-green-500 shrink-0" /> : <Copy size={12} className="shrink-0" />}
                      </button>

                      <div className="flex items-center gap-1.5 w-52 justify-end">
                        <button onClick={() => openNew(cat.id)}
                          className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                          <Plus size={11} /> Alt Kategori
                        </button>
                        <button onClick={() => openEdit(cat)}
                          className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg">
                          <Edit size={11} /> Düzenle
                        </button>
                        <button onClick={() => handleDelete(cat.id, cat.name_en)}
                          className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg">
                          <Trash2 size={11} /> Sil
                        </button>
                      </div>
                    </div>

                    {/* Alt kategoriler */}
                    {isExpanded && subs.map((child) => (
                      <div key={child.id}
                        className={`flex items-center gap-3 px-5 py-2.5 pl-16 border-t border-gray-50 bg-gray-50/40 hover:bg-gray-50 transition-colors ${selected.has(child.id) ? "bg-red-50/40" : ""}`}>
                        <input type="checkbox" checked={selected.has(child.id)} onChange={() => toggleSelect(child.id)}
                          className="accent-[#C0202A] w-4 h-4 shrink-0" />

                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#0D1B2A]">
                            {child.name_tr || child.name_en}
                            {child.name_tr && child.name_tr !== child.name_en && (
                              <span className="ml-1.5 text-xs text-gray-400">({child.name_en})</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400">/{child.slug}</p>
                        </div>

                        <button onClick={() => copyId(child.id)}
                          className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-[#C0202A] hover:bg-white px-2 py-1 rounded-lg transition-colors w-72"
                          title="ID kopyala">
                          <span className="truncate">{child.id}</span>
                          {copiedId === child.id ? <CheckCircle size={12} className="text-green-500 shrink-0" /> : <Copy size={12} className="shrink-0" />}
                        </button>

                        <div className="flex items-center gap-1.5 w-52 justify-end">
                          <button onClick={() => openEdit(child)}
                            className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg">
                            <Edit size={11} /> Düzenle
                          </button>
                          <button onClick={() => handleDelete(child.id, child.name_en)}
                            className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-lg">
                            <Trash2 size={11} /> Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
