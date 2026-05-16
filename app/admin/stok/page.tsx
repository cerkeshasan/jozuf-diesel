"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  Package, TrendingUp, TrendingDown, AlertTriangle,
  RefreshCw, Search, Plus, Minus, SlidersHorizontal,
  CheckCircle, XCircle, Clock, Loader2, Eye, EyeOff,
} from "lucide-react";

interface Product {
  id: string;
  name_en: string;
  name_tr: string | null;
  sku: string | null;
  brand: string | null;
  stock_status: "in_stock" | "out_of_stock" | "on_order";
  stock_quantity: number;
  is_active: boolean;
  updated_at: string;
}

interface Movement {
  id: string;
  product_id: string;
  type: "in" | "out" | "set";
  quantity: number;
  note: string | null;
  created_at: string;
  products: { name_en: string; sku: string | null } | null;
}

interface UpdateModal {
  product: Product;
  type: "in" | "out" | "set";
}

type FilterType = "all" | "published" | "draft" | "low" | "out";

export default function StokPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modal, setModal] = useState<UpdateModal | null>(null);
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch(`/api/stock${filter !== "all" ? `?filter=${filter}` : ""}`);
    const data = await res.json();
    setProducts(data.products || []);
    setMovements(data.movements || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTogglePublish = async (product: Product) => {
    setTogglingId(product.id);
    const res = await adminFetch("/api/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, is_active: !product.is_active }),
    });
    const data = await res.json();
    setTogglingId(null);
    if (!res.ok) {
      showToast(data.error || "Hata oluştu.", false);
    } else {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !product.is_active } : p));
      showToast(product.is_active ? "Taslağa alındı." : "Siteye yayınlandı.", true);
    }
  };

  const handleUpdate = async () => {
    if (!modal || !qty) return;
    const quantity = parseInt(qty);
    if (isNaN(quantity) || quantity < 0) return;

    setSaving(true);
    const res = await adminFetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: modal.product.id, type: modal.type, quantity, note }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      showToast(data.error || "Hata oluştu.", false);
    } else {
      showToast("Stok güncellendi.", true);
      setModal(null);
      setQty("");
      setNote("");
      fetchData();
    }
  };

  const openModal = (product: Product, type: "in" | "out" | "set") => {
    setModal({ product, type });
    setQty(type === "set" ? String(product.stock_quantity) : "");
    setNote("");
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name_en.toLowerCase().includes(q) ||
      (p.name_tr || "").toLowerCase().includes(q) ||
      (p.sku || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q)
    );
  });

  const total = products.length;
  const published = products.filter((p) => p.is_active).length;
  const draft = products.filter((p) => !p.is_active).length;
  const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length;
  const outStock = products.filter((p) => p.stock_status === "out_of_stock").length;

  const typeLabel = { in: "Stok Girişi", out: "Stok Çıkışı", set: "Stok Ayarla" };
  const typeColor = { in: "text-green-600", out: "text-red-600", set: "text-blue-600" };

  const stockBadge = (p: Product) => {
    if (p.stock_status === "out_of_stock")
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Stok Yok</span>;
    if (p.stock_quantity <= 5)
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Düşük</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Stokta</span>;
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "Tümü" },
    { value: "published", label: "Yayında" },
    { value: "draft", label: "Taslak" },
    { value: "low", label: "Düşük Stok" },
    { value: "out", label: "Stok Yok" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Stok Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-0.5">Ürün stoklarını takip et, yayın durumunu yönet</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw size={15} /> Yenile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Toplam", value: total, icon: Package, color: "text-[#0D1B2A]", bg: "bg-gray-50" },
          { label: "Yayında", value: published, icon: Eye, color: "text-green-600", bg: "bg-green-50" },
          { label: "Taslak", value: draft, icon: EyeOff, color: "text-gray-500", bg: "bg-gray-100" },
          { label: "Düşük Stok", value: lowStock, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Stok Yok", value: outStock, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color} />
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold font-oswald ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ürün adı, SKU veya marka ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${filter === f.value ? "bg-[#0D1B2A] text-white border-[#0D1B2A]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" /> Yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Ürün bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Ürün</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">SKU</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Marka</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Stok</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Miktar</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Yayın</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50/50 ${!p.is_active ? "opacity-60" : ""} ${p.stock_quantity <= 5 && p.stock_quantity > 0 ? "bg-yellow-50/30" : ""} ${p.stock_status === "out_of_stock" ? "bg-red-50/20" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0D1B2A] truncate max-w-[200px]">{p.name_tr || p.name_en}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.name_en}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{p.brand || "—"}</td>
                    <td className="px-4 py-3 text-center">{stockBadge(p)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold font-oswald text-lg ${p.stock_quantity === 0 ? "text-red-500" : p.stock_quantity <= 5 ? "text-yellow-600" : "text-[#0D1B2A]"}`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        disabled={togglingId === p.id}
                        title={p.is_active ? "Taslağa al" : "Siteye yayınla"}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${p.is_active ? "bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600" : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"}`}
                      >
                        {togglingId === p.id ? <Loader2 size={12} className="animate-spin" /> : p.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.is_active ? "Yayında" : "Taslak"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal(p, "in")} title="Stok Girişi" className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                          <Plus size={15} />
                        </button>
                        <button onClick={() => openModal(p, "out")} title="Stok Çıkışı" className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                          <Minus size={15} />
                        </button>
                        <button onClick={() => openModal(p, "set")} title="Stok Ayarla" className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                          <SlidersHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Movement History */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4 flex items-center gap-2">
          <Clock size={18} /> Son Stok Hareketleri
        </h2>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Henüz stok hareketi yok.</p>
        ) : (
          <div className="space-y-2">
            {movements.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div className={`p-1.5 rounded-lg shrink-0 ${m.type === "in" ? "bg-green-50" : m.type === "out" ? "bg-red-50" : "bg-blue-50"}`}>
                  {m.type === "in" ? <TrendingUp size={14} className="text-green-600" /> : m.type === "out" ? <TrendingDown size={14} className="text-red-600" /> : <SlidersHorizontal size={14} className="text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0D1B2A] truncate">{m.products?.name_en || "—"}</p>
                  {m.note && <p className="text-xs text-gray-400 truncate">{m.note}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${m.type === "in" ? "text-green-600" : m.type === "out" ? "text-red-600" : "text-blue-600"}`}>
                    {m.type === "in" ? "+" : m.type === "out" ? "-" : "="}{m.quantity}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(m.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div>
              <h3 className={`font-oswald font-bold text-lg ${typeColor[modal.type]}`}>{typeLabel[modal.type]}</h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate">{modal.product.name_tr || modal.product.name_en}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Mevcut Stok</span>
              <span className="font-bold font-oswald text-xl text-[#0D1B2A]">{modal.product.stock_quantity}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {modal.type === "set" ? "Yeni Miktar" : "Miktar"}
              </label>
              <input
                type="number"
                min="0"
                autoFocus
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                placeholder="0"
              />
              {qty && !isNaN(parseInt(qty)) && modal.type !== "set" && (
                <p className="text-xs text-gray-400 mt-1">
                  Yeni stok: <strong>{modal.type === "in" ? modal.product.stock_quantity + parseInt(qty) : Math.max(0, modal.product.stock_quantity - parseInt(qty))}</strong>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Not (isteğe bağlı)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
                placeholder="ör: Tedarikçi teslimatı, Satış..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpdate}
                disabled={saving || !qty}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-50 ${modal.type === "in" ? "bg-green-600 hover:bg-green-700" : modal.type === "out" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : modal.type === "in" ? <Plus size={16} /> : modal.type === "out" ? <Minus size={16} /> : <SlidersHorizontal size={16} />}
                {saving ? "Kaydediliyor..." : typeLabel[modal.type]}
              </button>
              <button onClick={() => setModal(null)} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
