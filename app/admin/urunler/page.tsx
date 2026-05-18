"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Loader2, CheckCircle, Eye, EyeOff, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import Badge from "@/components/ui/Badge";
import BulkUploadTrigger from "@/components/admin/BulkUploadTrigger";
import ExportProductsButton from "@/components/admin/ExportProductsButton";
import { adminFetch } from "@/lib/admin-fetch";

interface Product {
  id: string;
  name_en: string;
  sku: string | null;
  oem_code: string | null;
  brand: string | null;
  stock_status: "in_stock" | "out_of_stock" | "on_order";
  is_active: boolean;
  is_featured: boolean;
  categories?: { name_en: string } | null;
}

type SortKey = "name_en" | "sku" | "oem_code" | "brand" | "category" | "stock_status" | "is_active";
type SortDir = "asc" | "desc";

const stockVariant = {
  in_stock: "success" as const,
  out_of_stock: "danger" as const,
  on_order: "warning" as const,
};

const PAGE_SIZE = 20;

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-gray-300 ml-1 inline" />;
  return sortDir === "asc"
    ? <ChevronUp size={12} className="text-[#C0202A] ml-1 inline" />
    : <ChevronDown size={12} className="text-[#C0202A] ml-1 inline" />;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name_en");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const params = new URLSearchParams({ limit: "1000", all: "true" });
      if (search) params.set("q", search);
      const res = await adminFetch(`/api/products?${params}`);
      const data = await res.json();
      const all: Product[] = Array.isArray(data) ? data : [];
      setTotal(all.length);
      setProducts(all);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sorted = [...products].sort((a, b) => {
    let aVal = "";
    let bVal = "";
    if (sortKey === "category") {
      aVal = a.categories?.name_en || "";
      bVal = b.categories?.name_en || "";
    } else if (sortKey === "is_active") {
      aVal = a.is_active ? "1" : "0";
      bVal = b.is_active ? "1" : "0";
    } else {
      aVal = (a[sortKey] ?? "") as string;
      bVal = (b[sortKey] ?? "") as string;
    }
    const cmp = aVal.localeCompare(bVal, "tr", { sensitivity: "base" });
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  const toggleSelect = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = () =>
    setSelected(selected.size === paged.length ? new Set() : new Set(paged.map((p) => p.id)));

  const selectAllProducts = () =>
    setSelected(selected.size === sorted.length ? new Set() : new Set(sorted.map((p) => p.id)));

  const handleBulkDelete = async () => {
    if (!confirm(`${selected.size} ürünü silmek istediğinizden emin misiniz?`)) return;
    setBulkLoading(true);
    let done = 0;
    for (const id of selected) {
      const res = await adminFetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) done++;
    }
    showToast(`${done} ürün silindi.`);
    await fetchProducts();
    setBulkLoading(false);
  };

  const handleBulkStatus = async (is_active: boolean) => {
    setBulkLoading(true);
    let done = 0;
    for (const id of selected) {
      const product = products.find((p) => p.id === id);
      if (!product) continue;
      const res = await adminFetch(`/api/products?id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...product, is_active, category_id: null, compatible_vehicles: [], images: [], specs_en: null, specs_tr: null, specs_ru: null, specs_ar: null, compatible_vehicles_en: [], compatible_vehicles_tr: [], compatible_vehicles_ru: [], compatible_vehicles_ar: [] }),
      });
      if (res.ok) done++;
    }
    showToast(`${done} ürün ${is_active ? "aktif" : "pasif"} yapıldı.`);
    await fetchProducts();
    setBulkLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) return;
    const res = await adminFetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Ürün silindi."); await fetchProducts(); }
  };

  const thClass = "text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase cursor-pointer select-none hover:text-gray-800 whitespace-nowrap";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Ürünler</h1>
          <p className="text-gray-500 text-sm">{total} ürün</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.size > 0 && (
            <>
              <button
                onClick={() => handleBulkStatus(true)}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 disabled:opacity-50"
              >
                <Eye size={14} /> Aktif Yap ({selected.size})
              </button>
              <button
                onClick={() => handleBulkStatus(false)}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-500 text-white rounded-xl text-sm font-medium hover:bg-gray-600 disabled:opacity-50"
              >
                <EyeOff size={14} /> Pasif Yap ({selected.size})
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {bulkLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Sil ({selected.size})
              </button>
            </>
          )}
          <ExportProductsButton />
          <BulkUploadTrigger />
          <Link
            href="/admin/urunler/yeni"
            className="flex items-center gap-2 bg-[#C0202A] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#a81b23] transition-colors"
          >
            <Plus size={18} /> Yeni Ürün
          </Link>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setSearch(q); setPage(1); } }}
            placeholder="Ürün adı, OEM kodu, SKU, marka..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
          />
        </div>
        <button
          onClick={() => { setSearch(q); setPage(1); }}
          className="bg-[#0D1B2A] text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          Ara
        </button>
        {search && (
          <button
            onClick={() => { setQ(""); setSearch(""); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
          >
            Temizle
          </button>
        )}
        <button
          onClick={selectAllProducts}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
        >
          {selected.size === sorted.length && sorted.length > 0 ? "Seçimi Kaldır" : `Tümünü Seç (${sorted.length})`}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && selected.size === paged.length}
                    onChange={toggleAll}
                    className="accent-[#C0202A] w-4 h-4"
                  />
                </th>
                <th className={thClass} onClick={() => handleSort("name_en")}>
                  Ürün <SortIcon col="name_en" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort("sku")}>
                  SKU <SortIcon col="sku" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort("oem_code")}>
                  OEM <SortIcon col="oem_code" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort("brand")}>
                  Marka <SortIcon col="brand" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort("category")}>
                  Kategori <SortIcon col="category" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort("stock_status")}>
                  Stok <SortIcon col="stock_status" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className={thClass} onClick={() => handleSort("is_active")}>
                  Durum <SortIcon col="is_active" sortKey={sortKey} sortDir={sortDir} />
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">Ürün bulunamadı</td>
                </tr>
              ) : paged.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selected.has(product.id) ? "bg-red-50/30" : ""}`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="accent-[#C0202A] w-4 h-4"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-sm text-[#0D1B2A] line-clamp-1">{product.name_en}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-gray-500">{product.sku || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-[#C0202A]">{product.oem_code || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{product.brand || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">{product.categories?.name_en || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={stockVariant[product.stock_status]}>
                      {product.stock_status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={product.is_active ? "success" : "danger"}>
                      {product.is_active ? "Aktif" : "Pasif"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/urunler/${product.id}`}
                        className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Edit size={12} /> Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name_en)}
                        className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} /> Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page ? "bg-[#C0202A] text-white" : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
