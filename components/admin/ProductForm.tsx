"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, X, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import Image from "next/image";
import type { Category, Product, VariantGroup } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import TagInput from "@/components/ui/TagInput";

interface ProductFormProps {
  categories: Category[];
  product?: Partial<Product>;
  isEdit?: boolean;
}

const LANG_TABS = ["en", "tr", "ru", "ar"] as const;

export default function ProductForm({ categories, product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "tr" | "ru" | "ar">("en");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name_en: product?.name_en || "",
    name_tr: product?.name_tr || "",
    name_ru: product?.name_ru || "",
    name_ar: product?.name_ar || "",
    description_en: product?.description_en || "",
    description_tr: product?.description_tr || "",
    description_ru: product?.description_ru || "",
    description_ar: product?.description_ar || "",
    compatible_vehicles_en: (product?.compatible_vehicles_en || []).join("\n"),
    compatible_vehicles_tr: (product?.compatible_vehicles_tr || []).join("\n"),
    compatible_vehicles_ru: (product?.compatible_vehicles_ru || []).join("\n"),
    compatible_vehicles_ar: (product?.compatible_vehicles_ar || []).join("\n"),
    specs_en: JSON.stringify(product?.specs_en || {}, null, 2),
    specs_tr: JSON.stringify(product?.specs_tr || {}, null, 2),
    specs_ru: JSON.stringify(product?.specs_ru || {}, null, 2),
    specs_ar: JSON.stringify(product?.specs_ar || {}, null, 2),
    slug: product?.slug || "",
    category_id: product?.category_id || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    oem_code: product?.oem_code || "",
    stock_status: product?.stock_status || "in_stock",
    stock_quantity: product?.stock_quantity || 0,
    min_order_qty: product?.min_order_qty || 1,
    qty_step: product?.qty_step || 1,
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== undefined ? product.is_active : true,
    images: (product?.images || []).join("\n"),
  });

  const [variants, setVariants] = useState<VariantGroup[]>(product?.variants || []);
  const [variantOptionInputs, setVariantOptionInputs] = useState<string[]>(
    (product?.variants || []).map(() => "")
  );

  const autoSlug = () => {
    setForm((f) => ({
      ...f,
      slug: f.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "products");

    try {
      const res = await adminFetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yükleme başarısız.");
        setUploading(false);
        return;
      }
      // Append URL to images textarea
      setForm((f) => ({
        ...f,
        images: f.images ? `${f.images}\n${data.url}` : data.url,
      }));
    } catch {
      setError("Yükleme sırasında bağlantı hatası.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name_en.trim()) { setError("İngilizce ürün adı zorunludur."); return; }
    if (!form.slug.trim()) { setError("Slug zorunludur. Auto butonuna tıklayın."); return; }

    setLoading(true);

    const specsData: Record<string, Record<string, string>> = {};
    for (const lang of ["en", "tr", "ru", "ar"] as const) {
      try {
        specsData[lang] = JSON.parse(form[`specs_${lang}`] || "{}");
      } catch {
        setError(`${lang.toUpperCase()} teknik özellikler geçerli JSON formatında değil.`);
        setLoading(false);
        return;
      }
    }

    const {
      compatible_vehicles_en: cv_en,
      compatible_vehicles_tr: cv_tr,
      compatible_vehicles_ru: cv_ru,
      compatible_vehicles_ar: cv_ar,
      specs_en: _se, specs_tr: _st, specs_ru: _sr, specs_ar: _sa,
      images: imagesStr,
      ...restForm
    } = form;

    const payload = {
      ...restForm,
      images: imagesStr.split("\n").map((s) => s.trim()).filter(Boolean),
      compatible_vehicles: [],
      compatible_vehicles_en: cv_en.split("\n").map((s) => s.trim()).filter(Boolean),
      compatible_vehicles_tr: cv_tr.split("\n").map((s) => s.trim()).filter(Boolean),
      compatible_vehicles_ru: cv_ru.split("\n").map((s) => s.trim()).filter(Boolean),
      compatible_vehicles_ar: cv_ar.split("\n").map((s) => s.trim()).filter(Boolean),
      stock_quantity: Number(form.stock_quantity),
      min_order_qty: Number(form.min_order_qty) || 1,
      qty_step: Number(form.qty_step) || 1,
      specs_en: specsData.en,
      specs_tr: specsData.tr,
      specs_ru: specsData.ru,
      specs_ar: specsData.ar,
      category_id: form.category_id || null,
      variants: variants.filter(v => v.label_en && v.options.length > 0),
    };

    const url = isEdit ? `/api/products?id=${product?.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await adminFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
        setLoading(false);
        return;
      }

      router.push("/admin/urunler");
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
      setLoading(false);
    }
  };

  // Preview uploaded images
  const imageList = form.images.split("\n").map(s => s.trim()).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Lang tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 flex">
          {LANG_TABS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === lang
                  ? "border-b-2 border-[#C0202A] text-[#C0202A]"
                  : "text-gray-400 hover:text-[#0D1B2A]"
              }`}
            >
              {lang.toUpperCase()}
              {lang === "en" && <span className="text-red-500 ml-0.5">*</span>}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı ({activeTab.toUpperCase()})
              {activeTab === "en" && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={form[`name_${activeTab}`]}
              onChange={(e) => setForm({ ...form, [`name_${activeTab}`]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
              placeholder={activeTab === "en" ? "e.g. Bosch Common Rail Injector" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama ({activeTab.toUpperCase()})</label>
            <textarea
              rows={4}
              value={form[`description_${activeTab}`]}
              onChange={(e) => setForm({ ...form, [`description_${activeTab}`]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uyumlu Araçlar ({activeTab.toUpperCase()})</label>
            <p className="text-xs text-gray-400 mb-1">Her satıra bir araç girin</p>
            <textarea
              rows={3}
              value={form[`compatible_vehicles_${activeTab}`]}
              onChange={(e) => setForm({ ...form, [`compatible_vehicles_${activeTab}`]: e.target.value })}
              placeholder={activeTab === "tr" ? "Mercedes C220 CDI 2015\nBMW 320d 2016" : activeTab === "ru" ? "Mercedes C220 CDI 2015\nBMW 320d 2016" : "Mercedes C220 CDI 2015\nBMW 320d 2016"}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teknik Özellikler ({activeTab.toUpperCase()}) — JSON</label>
            <p className="text-xs text-gray-400 mb-1">Anahtar-değer çifti formatında JSON</p>
            <textarea
              rows={6}
              value={form[`specs_${activeTab}`]}
              onChange={(e) => setForm({ ...form, [`specs_${activeTab}`]: e.target.value })}
              placeholder={'{\n  "Type": "Straight Reducer",\n  "Material": "Steel"\n}'}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none"
            />
          </div>
        </div>
      </div>

      {/* General */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">Genel Bilgiler</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                placeholder="bosch-common-rail-injector"
              />
              <button type="button" onClick={autoSlug} className="px-3 py-2 bg-gray-100 rounded-xl text-xs font-medium hover:bg-gray-200 whitespace-nowrap">
                Auto
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            >
              <option value="">Kategori Seç</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name_en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Bosch, Delphi..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OEM Kodu</label>
            <input
              type="text"
              value={form.oem_code}
              onChange={(e) => setForm({ ...form, oem_code: e.target.value })}
              placeholder="F00VC99002"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A] font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu</label>
            <select
              value={form.stock_status}
              onChange={(e) => setForm({ ...form, stock_status: e.target.value as "in_stock" | "out_of_stock" | "on_order" })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            >
              <option value="in_stock">Stokta Var</option>
              <option value="out_of_stock">Stok Dışı</option>
              <option value="on_order">Sipariş Üzerine</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı</label>
            <input
              type="number"
              min={0}
              value={form.stock_quantity}
              onChange={(e) => setForm({ ...form, stock_quantity: parseInt(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Sipariş Adedi</label>
            <input
              type="number"
              min={1}
              value={form.min_order_qty}
              onChange={(e) => setForm({ ...form, min_order_qty: parseInt(e.target.value) || 1 })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adet Artış Miktarı</label>
            <input
              type="number"
              min={1}
              value={form.qty_step}
              onChange={(e) => setForm({ ...form, qty_step: parseInt(e.target.value) || 1 })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
            />
            <p className="text-xs text-gray-400 mt-1">Örn: 100 girersen 100, 200, 300... şeklinde artar</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="accent-[#C0202A]"
            />
            <span className="text-sm font-medium text-gray-700">Öne Çıkan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="accent-[#C0202A]"
            />
            <span className="text-sm font-medium text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">Görseller</h2>

        {/* Upload button */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadImage}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#C0202A] hover:text-[#C0202A] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <><Loader2 size={16} className="animate-spin" /> Yükleniyor...</>
            ) : (
              <><Upload size={16} /> Görsel Yükle (max 5MB)</>
            )}
          </button>
        </div>

        {/* Image preview */}
        {imageList.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {imageList.map((url, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group">
                <Image src={url} alt={`img ${i + 1}`} fill className="object-cover" sizes="64px" />
                <button
                  type="button"
                  onClick={() => {
                    const lines = form.images.split("\n").filter(l => l.trim() !== url);
                    setForm(f => ({ ...f, images: lines.join("\n") }));
                  }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mb-2">URL'leri satır satır girebilir veya yukarıdan dosya yükleyebilirsiniz</p>
        <textarea
          rows={3}
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C0202A] resize-none"
        />
      </div>

      {/* Variants */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg">Ürün Seçenekleri</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ör: Boru Çapı → 6mm, 8mm, 10mm</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVariants(v => [...v, { label_en: "", label_tr: "", label_ru: "", label_ar: "", options: [] }]);
              setVariantOptionInputs(v => [...v, ""]);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D1B2A] text-white rounded-xl text-sm font-medium hover:bg-[#1a2f45] transition-colors"
          >
            <Plus size={15} /> Grup Ekle
          </button>
        </div>

        {variants.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
            Henüz seçenek yok. "Grup Ekle" ile başlayın.
          </p>
        )}

        <div className="space-y-4">
          {variants.map((variant, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0D1B2A]">Grup {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => {
                    setVariants(v => v.filter((_, i) => i !== idx));
                    setVariantOptionInputs(v => v.filter((_, i) => i !== idx));
                  }}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* 4 dil label */}
              <div className="grid grid-cols-2 gap-2">
                {(["en", "tr", "ru", "ar"] as const).map(lang => (
                  <div key={lang}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Grup Adı ({lang.toUpperCase()}){lang === "en" && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <input
                      type="text"
                      value={variant[`label_${lang}`] || ""}
                      onChange={e => setVariants(v => v.map((g, i) => i === idx ? { ...g, [`label_${lang}`]: e.target.value } : g))}
                      placeholder={lang === "en" ? "Pipe Diameter" : lang === "tr" ? "Boru Çapı" : lang === "ru" ? "Диаметр" : "القطر"}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                    />
                  </div>
                ))}
              </div>

              {/* Seçenekler */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Seçenekler</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {variant.options.map((opt, oi) => (
                    <span key={oi} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-sm">
                      {opt}
                      <button
                        type="button"
                        onClick={() => setVariants(v => v.map((g, i) => i === idx ? { ...g, options: g.options.filter((_, j) => j !== oi) } : g))}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={variantOptionInputs[idx] || ""}
                    onChange={e => setVariantOptionInputs(v => v.map((val, i) => i === idx ? e.target.value : val))}
                    onKeyDown={e => {
                      if ((e.key === "Enter" || e.key === ",") && variantOptionInputs[idx]?.trim()) {
                        e.preventDefault();
                        const val = variantOptionInputs[idx].trim();
                        setVariants(v => v.map((g, i) => i === idx && !g.options.includes(val) ? { ...g, options: [...g.options, val] } : g));
                        setVariantOptionInputs(v => v.map((val2, i) => i === idx ? "" : val2));
                      }
                    }}
                    placeholder="6mm — Enter ile ekle"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = (variantOptionInputs[idx] || "").trim();
                      if (!val) return;
                      setVariants(v => v.map((g, i) => i === idx && !g.options.includes(val) ? { ...g, options: [...g.options, val] } : g));
                      setVariantOptionInputs(v => v.map((val2, i) => i === idx ? "" : val2));
                    }}
                    className="px-3 py-2 bg-[#C0202A] text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 pb-8">
        <Button type="submit" variant="primary" size="lg" loading={loading} className="gap-2">
          <Save size={18} />
          {isEdit ? "Güncelle" : "Kaydet"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push("/admin/urunler")}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
