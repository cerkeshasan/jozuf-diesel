import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import Badge from "@/components/ui/Badge";
import { Eye } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const supabase = createServiceClient();
  const page = parseInt(sp.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase.from("orders").select("*", { count: "exact" });
  if (sp.status) query = query.eq("status", sp.status);

  const { data: orders, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

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

  const filters = [
    { value: "", label: "Tümü" },
    { value: "pending", label: "Beklemede" },
    { value: "confirmed", label: "Onaylandı" },
    { value: "shipped", label: "Kargoda" },
    { value: "delivered", label: "Teslim Edildi" },
    { value: "cancelled", label: "İptal" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Siparişler</h1>
        <p className="text-gray-500 text-sm">{count || 0} sipariş</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={`/admin/siparisler${f.value ? `?status=${f.value}` : ""}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              (sp.status || "") === f.value
                ? "bg-[#C0202A] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Ürünler</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Dil</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-sm text-[#0D1B2A]">#{order.order_number}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">
                      {(order.items as any[])?.length || 0} ürün
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">{order.customer_name || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-medium">
                      {order.lang?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusVariant[order.status as keyof typeof statusVariant]}>
                      {statusLabel[order.status as keyof typeof statusLabel]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/siparisler/${order.id}`}
                      className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors ml-auto w-fit"
                    >
                      <Eye size={12} />
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(orders || []).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Sipariş bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
