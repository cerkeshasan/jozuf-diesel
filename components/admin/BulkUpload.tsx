"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface CategoryRef {
  id: string;
  slug: string;
  name_tr: string | null;
  name_en: string;
  parent_id: string | null;
}

interface PreviewRow {
  name_en?: string;
  name_tr?: string;
  slug?: string;
  sku?: string;
  oem_code?: string;
  brand?: string;
  category_id?: string;
  stock_status?: string;
  stock_quantity?: number;
  description_en?: string;
  [key: string]: unknown;
}

interface BulkUploadProps {
  onClose: () => void;
}

export default function BulkUpload({ onClose }: BulkUploadProps) {
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ inserted: number; updated: number; errors: string[] } | null>(null);
  const [parseError, setParseError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [publishAfterUpload, setPublishAfterUpload] = useState(false);
  const [categoryRefs, setCategoryRefs] = useState<CategoryRef[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategoryRefs(data); })
      .catch(() => {});
  }, []);

  const parseFile = async (file: File) => {
    setParseError("");
    setRows([]);
    setResult(null);
    setFileName(file.name);

    try {
      const XLSX = await import("xlsx");
      const isCsv = file.name.toLowerCase().endsWith(".csv");

      let wb: import("xlsx").WorkBook;

      if (isCsv) {
        const text = await file.text();
        wb = XLSX.read(text, { type: "string", codepage: 65001 });
      } else {
        const buffer = await file.arrayBuffer();
        wb = XLSX.read(buffer, { type: "array" });
      }

      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<PreviewRow>(ws, { defval: "" });
      setRows(data);
    } catch {
      setParseError("Dosya okunamadi. Gecerli bir Excel veya CSV dosyasi yukleyin.");
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const handleSubmit = async () => {
    if (!rows.length) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await adminFetch("/api/bulk-upload", {
        method: "POST",
        body: JSON.stringify({ products: rows, is_active: publishAfterUpload }),
      });
      let data: { inserted: number; updated: number; errors: string[] };
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        data = { inserted: 0, updated: 0, errors: [`Sunucu yaniti okunamadi (HTTP ${res.status}): ${text.slice(0, 200)}`] };
      }
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setResult({ inserted: 0, updated: 0, errors: [`Ag hatasi: ${msg}`] });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    const XLSX = await import("xlsx");

    // Sayfa 1: Urun sablonu (ornek satir)
    const productRows = [
      {
        name_en: "Bosch Injector",
        name_tr: "Bosch Enjektör",
        name_ru: "Форсунка Bosch",
        name_ar: "حاقن بوش",
        slug: "",
        sku: "SKU001",
        oem_code: "F00VC99002",
        brand: "Bosch",
        category_id: "injector-clamps",
        stock_status: "in_stock",
        stock_quantity: 10,
        min_order_qty: 1,
        qty_step: 1,
        is_active: "true",
        is_featured: "false",
        description_en: "Common rail injector",
        description_tr: "Common rail enjektör",
        description_ru: "",
        description_ar: "",
        compatible_vehicles_en: "Mercedes C220 CDI|BMW 320d",
        compatible_vehicles_tr: "Mercedes C220 CDI|BMW 320d",
        compatible_vehicles_ru: "",
        compatible_vehicles_ar: "",
        specs_en: '{"Type":"Injector","Pressure":"1800 bar"}',
        specs_tr: '{"Tip":"Enjektör","Basınç":"1800 bar"}',
        specs_ru: "",
        specs_ar: "",
        images: "https://example.com/img1.jpg|https://example.com/img2.jpg",
        options_json: "",
      },
    ];

    const wsProducts = XLSX.utils.json_to_sheet(productRows);
    wsProducts["!cols"] = [
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 16 },
      { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 26 },
      { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 6 },
      { wch: 8 }, { wch: 8 },
      { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 16 },
      { wch: 28 }, { wch: 28 }, { wch: 20 }, { wch: 16 },
      { wch: 32 }, { wch: 32 }, { wch: 20 }, { wch: 16 },
      { wch: 40 }, { wch: 16 },
    ];

    // Sayfa 2: Mevcut kategoriler referans listesi
    const parents = categoryRefs
      .filter(c => !c.parent_id)
      .sort((a, b) => a.slug.localeCompare(b.slug));

    const catRows: Record<string, string>[] = [];
    for (const p of parents) {
      catRows.push({
        "Tur": "Ana Kategori",
        "Ust Kategori": "",
        "Ad (TR)": p.name_tr || "",
        "Ad (EN)": p.name_en,
        "category_id icin slug": p.slug,
        "ID": p.id,
      });
      const subs = categoryRefs
        .filter(c => c.parent_id === p.id)
        .sort((a, b) => a.slug.localeCompare(b.slug));
      for (const s of subs) {
        catRows.push({
          "Tur": "Alt Kategori",
          "Ust Kategori": p.name_tr || p.name_en,
          "Ad (TR)": s.name_tr || "",
          "Ad (EN)": s.name_en,
          "category_id icin slug": s.slug,
          "ID": s.id,
        });
      }
    }

    const wsCategories = XLSX.utils.json_to_sheet(
      catRows.length > 0 ? catRows : [{ "Tur": "Henuz kategori yok" }]
    );
    wsCategories["!cols"] = [
      { wch: 14 }, { wch: 24 }, { wch: 26 }, { wch: 26 }, { wch: 30 }, { wch: 38 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsProducts, "Urunler");
    XLSX.utils.book_append_sheet(wb, wsCategories, "Kategoriler");
    XLSX.writeFile(wb, "urun-sablonu.xlsx");
  };

  const previewCols = ["name_en", "name_tr", "sku", "oem_code", "brand", "stock_status"];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-oswald font-bold text-[#0D1B2A] text-xl">Toplu Ürün Yükle</h2>
            <p className="text-sm text-gray-400 mt-0.5">Excel veya CSV dosyası ile çoklu ürün ekleyin</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Bilgi kutusu + sablon indir */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="flex-1 text-xs text-blue-700 space-y-1">
              <p className="font-semibold">category_id sütununa Kategoriler sayfasındaki slug&apos;ı yazın</p>
              <p>Örnek: <span className="font-mono bg-blue-100 px-1 rounded">injector-clamps</span> veya <span className="font-mono bg-blue-100 px-1 rounded">Enjektör Kelepçeleri</span></p>
              <p className="text-blue-500">Şablonu indirince 2. sayfada tüm kategorilerin listesi hazır gelir.</p>
            </div>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 text-sm text-[#C0202A] hover:underline font-medium"
          >
            <Download size={14} /> Örnek şablonu indir (Excel — kategoriler dahil)
          </button>

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragging ? "border-[#C0202A] bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
          >
            <FileSpreadsheet size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">{fileName || "Excel veya CSV dosyası seçin"}</p>
            <p className="text-xs text-gray-400 mt-1">.xlsx, .xls, .csv desteklenir</p>
            <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleInput} className="hidden" />
          </div>

          {parseError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl">
              <AlertCircle size={14} /> {parseError}
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{rows.length} ürün bulundu — ilk 10 satır önizleme:</p>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewCols.map((col) => (
                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        {previewCols.map((col) => (
                          <td key={col} className="px-3 py-2 text-gray-700 max-w-[150px] truncate">{String(row[col] ?? "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-xl p-4 border ${result.errors.length > 0 ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-semibold text-sm text-green-700">
                  {result.inserted} eklendi, {result.updated} güncellendi
                </span>
              </div>
              {result.errors.length > 0 && (
                <div className="text-xs text-yellow-700 space-y-1">
                  {result.errors.slice(0, 5).map((e, i) => <p key={i}>• {e}</p>)}
                  {result.errors.length > 5 && <p>...ve {result.errors.length - 5} hata daha</p>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setPublishAfterUpload(!publishAfterUpload)}
              className={`relative w-10 h-6 rounded-full transition-colors ${publishAfterUpload ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${publishAfterUpload ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Siteye otomatik yayınla</p>
              <p className="text-xs text-gray-400">{publishAfterUpload ? "Yüklenen ürünler sitede görünür olacak" : "Ürünler taslak olarak kaydedilecek, sitede görünmez"}</p>
            </div>
          </label>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!rows.length || loading}
              className="flex items-center gap-2 bg-[#0D1B2A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a2f45] transition-colors disabled:opacity-50"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Yükleniyor...</> : <><Upload size={16} /> {rows.length} Ürünü Yükle</>}
            </button>
            <button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
