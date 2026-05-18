export const dynamic = "force-dynamic";

import { createServiceClient } from "@/lib/supabase";
import { Package, FolderOpen, ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default async function DashboardPage() {
  const supabase = createServiceClient();

  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: pendingOrders },
    { data: recentOrders },
    { data: topProducts },
    { data: viewData },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("products").select("id, name_en, brand, view_count").order("view_count", { ascending: false }).limit(5),
    supabase.from("products").select("view_count"),
  ]);

  const totalViews = (viewData || []).reduce((sum, p) => sum + (p.view_count || 0), 0);

  const stats = [
    { label: "Toplam Ürün", value: totalProducts ?? 0, icon: Package, color: "bg-blue-500" },
    { label: "Kategoriler", value: totalCategories ?? 0, icon: FolderOpen, color: "bg-purple-500" },
    { label: "Bekleyen Siparişler", value: pendingOrders ?? 0, icon: ShoppingBag, color: "bg-yellow-500" },
    { label: "Toplam Görüntüleme", value: totalViews, icon: Eye, color: "bg-green-500" },
  ];

  const statusVariant = {
    pending: "warning" as const,
    confirmed: "info" as const,
    shipped: "info" as const,
    delivered: "success" as const,
    cancelled: "danger" as const,
  };

  const statusLabel = {
    pending: "Beklemede",
    confirmed: "Onaylandı",
    shipped: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal",
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <div className="font-oswald text-3xl font-bold text-[#0D1B2A]">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg">Son Siparişler</h2>
            <Link href="/admin/siparisler" className="text-[#C0202A] text-sm hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(recentOrders || []).map((order) => (
              <Link
                key={order.id}
                href={`/admin/siparisler/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm text-[#0D1B2A]">#{order.order_number}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("tr-TR")} · {order.lang?.toUpperCase()}
                  </p>
                </div>
                <Badge variant={statusVariant[order.status as keyof typeof statusVariant]}>
                  {statusLabel[order.status as keyof typeof statusLabel] || order.status}
                </Badge>
              </Link>
            ))}
            {(recentOrders || []).length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">Henüz sipariş yok</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg">En Çok Görüntülenen</h2>
            <Link href="/admin/urunler" className="text-[#C0202A] text-sm hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(topProducts || []).map((product, i) => (
              <div key={product.id} className="flex items-center gap-4 px-6 py-4">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0D1B2A] truncate">{product.name_en}</p>
                  <p className="text-xs text-gray-400">{product.brand || "-"}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Eye size={14} />
                  {product.view_count || 0}
                </div>
              </div>
            ))}
            {(topProducts || []).length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">Henüz ürün yok</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/urunler/yeni" className="bg-[#C0202A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#a81b23] transition-colors">
            + Yeni Ürün Ekle
          </Link>
          <Link href="/admin/kategoriler" className="bg-[#0D1B2A] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1a2f45] transition-colors">
            + Kategori Ekle
          </Link>
          <Link href="/admin/siparisler" className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Siparişleri Yönet
          </Link>
          <Link href="/admin/ayarlar" className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Site Ayarları
          </Link>
        </div>
      </div>
    </div>
  );
}
