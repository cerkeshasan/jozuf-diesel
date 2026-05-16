"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";

export default function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    const res = await adminFetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Silme başarısız.");
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 size={12} />
      {loading ? "..." : "Sil"}
    </button>
  );
}
