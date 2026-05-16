import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import Badge from "@/components/ui/Badge";
import { MessageCircle, Copy, ArrowLeft } from "lucide-react";
import type { Order } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  const statusVariant = {
    pending: "warning" as const,
    confirmed: "info" as const,
    shipped: "info" as const,
    delivered: "success" as const,
    cancelled: "danger" as const,
  };

  const statusLabel: Record<string, string> = {
    pending: "Beklemede",
    confirmed: "Onaylandı",
    shipped: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/siparisler" className="flex items-center gap-1 text-gray-400 hover:text-[#C0202A] transition-colors">
          <ArrowLeft size={18} />
          Geri
        </Link>
        <div>
          <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">#{order.order_number}</h1>
          <p className="text-gray-500 text-sm">
            {new Date(order.created_at).toLocaleString("tr-TR")} · {order.lang?.toUpperCase()}
          </p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusVariant[order.status as keyof typeof statusVariant] || "gray"}>
            {statusLabel[order.status] || order.status}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order items */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">Sipariş Ürünleri</h2>
          <div className="space-y-3">
            {(order.items as any[]).map((item: any, i: number) => (
              <div key={i} className="flex items-start justify-between border-b border-gray-50 pb-3">
                <div>
                  <p className="font-medium text-sm text-[#0D1B2A]">{item.product_name}</p>
                  {item.oem_code && <p className="text-xs text-[#C0202A] font-mono">{item.oem_code}</p>}
                </div>
                <span className="text-sm font-semibold text-gray-600 shrink-0 ml-4">x{item.quantity}</span>
              </div>
            ))}
          </div>
          {order.note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Sipariş Notu:</p>
              <p className="text-sm text-gray-700">{order.note}</p>
            </div>
          )}
        </div>

        {/* Customer info & actions */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">Müşteri Bilgileri</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Ad", value: order.customer_name },
                { label: "Telefon", value: order.customer_phone },
                { label: "Email", value: order.customer_email },
                { label: "Ülke", value: order.customer_country },
              ].map((f, i) => f.value && (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-400 w-16">{f.label}:</span>
                  <span className="text-[#0D1B2A] font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status updater */}
          <OrderStatusUpdater orderId={id} currentStatus={order.status} />

          {/* WA Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">WhatsApp</h2>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "905517042268"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-medium hover:bg-[#1ebe5a] transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp&apos;tan Yanıtla
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
