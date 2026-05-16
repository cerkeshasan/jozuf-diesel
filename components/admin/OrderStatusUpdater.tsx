"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

const statuses = [
  { value: "pending", label: "Beklemede", color: "bg-yellow-500" },
  { value: "confirmed", label: "Onaylandı", color: "bg-blue-500" },
  { value: "shipped", label: "Kargoya Verildi", color: "bg-orange-500" },
  { value: "delivered", label: "Teslim Edildi", color: "bg-green-500" },
  { value: "cancelled", label: "İptal", color: "bg-red-500" },
];

export default function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await adminFetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Güncelleme başarısız.");
        setSaving(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch {
      setError("Bağlantı hatası. Tekrar deneyin.");
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-4">Durum Güncelle</h2>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl mb-3">
          <AlertCircle size={14} className="shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2.5 rounded-xl mb-3">
          <CheckCircle size={14} /> Durum güncellendi.
        </div>
      )}

      <div className="space-y-2 mb-4">
        {statuses.map((s) => (
          <label key={s.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="status"
              value={s.value}
              checked={status === s.value}
              onChange={() => setStatus(s.value)}
              className="accent-[#C0202A]"
            />
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-sm font-medium text-[#0D1B2A]">{s.label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="w-full bg-[#0D1B2A] text-white py-3 rounded-xl font-medium hover:bg-[#1a2f45] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Güncelleniyor...</>
        ) : (
          "Güncelle"
        )}
      </button>
    </div>
  );
}
