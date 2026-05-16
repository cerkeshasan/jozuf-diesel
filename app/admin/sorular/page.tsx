import { createServiceClient } from "@/lib/supabase";
import { MessageSquare, Mail, Phone, Package, Clock } from "lucide-react";
import MarkReadButton from "@/components/admin/MarkReadButton";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminSorularPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const supabase = createServiceClient();
  const page = parseInt(sp.page || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data: inquiries, count } = await supabase
    .from("inquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const unreadCount = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A] flex items-center gap-2">
            Sorular
            {(unreadCount.count || 0) > 0 && (
              <span className="bg-[#C0202A] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount.count} yeni
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm">{count || 0} toplam soru</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {!inquiries || inquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
            <p>Henüz soru yok</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${!inquiry.is_read ? "bg-blue-50/30 border-l-4 border-l-[#C0202A]" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-semibold text-[#0D1B2A]">{inquiry.customer_name}</span>
                      {!inquiry.is_read && (
                        <span className="text-xs bg-[#C0202A] text-white px-2 py-0.5 rounded-full">Yeni</span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(inquiry.created_at).toLocaleDateString("tr-TR", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500">
                      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:text-[#C0202A]">
                        <Mail size={14} /> {inquiry.email}
                      </a>
                      <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:text-[#C0202A]">
                        <Phone size={14} /> {inquiry.phone}
                      </a>
                      {inquiry.product_name && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Package size={14} /> {inquiry.product_name}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {!inquiry.is_read && <MarkReadButton id={inquiry.id} />}
                    <a
                      href={`mailto:${inquiry.email}?subject=Re: ${inquiry.product_name || "Ürün Sorusu"}`}
                      className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Mail size={12} /> Yanıtla
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?page=${p}`}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                p === page ? "bg-[#C0202A] text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
