import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import { Plus, Edit, Search } from "lucide-react";
import Badge from "@/components/ui/Badge";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import BulkUploadTrigger from "@/components/admin/BulkUploadTrigger";
import ExportProductsButton from "@/components/admin/ExportProductsButton";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const supabase = createServiceClient();
  const page = parseInt(sp.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select("*, categories(name_en)", { count: "exact" });

  if (sp.q) {
    query = query.or(`name_en.ilike.%${sp.q}%,oem_code.ilike.%${sp.q}%,brand.ilike.%${sp.q}%`);
  }

  const { data: products, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count || 0) / limit);

  const stockVariant = {
    in_stock: "success" as const,
    out_of_stock: "danger" as const,
    on_order: "warning" as const,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Ürünler</h1>
          <p className="text-gray-500 text-sm">{count || 0} ürün</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportProductsButton />
          <BulkUploadTrigger />
          <Link
            href="/admin/urunler/yeni"
            className="flex items-center gap-2 bg-[#C0202A] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#a81b23] transition-colors"
          >
            <Plus size={18} />
            Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Ürün adı, OEM kodu, marka..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C0202A]"
          />
        </div>
        <button type="submit" className="bg-[#0D1B2A] text-white px-4 py-2 rounded-xl text-sm font-medium">
          Ara
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Ürün</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">OEM</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Marka</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(products || []).map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-sm text-[#0D1B2A] line-clamp-1">{product.name_en}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-[#C0202A]">{product.oem_code || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600">{product.brand || "-"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-500">
                      {product.categories?.name_en || "-"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={stockVariant[product.stock_status as keyof typeof stockVariant]}>
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
                        <Edit size={12} />
                        Düzenle
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(products || []).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Ürün bulunamadı</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?page=${p}${sp.q ? `&q=${sp.q}` : ""}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page ? "bg-[#C0202A] text-white" : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
