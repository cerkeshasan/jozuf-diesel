"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

export default function MarkReadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await adminFetch(`/api/inquiries?id=${id}`, { method: "PUT" });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
      Okundu
    </button>
  );
}
