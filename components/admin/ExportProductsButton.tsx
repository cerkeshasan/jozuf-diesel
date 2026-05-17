"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

export default function ExportProductsButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/products?limit=1000");
      const products = await res.json();

      const XLSX = await import("xlsx");

      // Group by category
      const groups: Record<string, typeof products> = {};
      for (const p of products) {
        const catName = p.categories?.name_en || "Uncategorized";
        if (!groups[catName]) groups[catName] = [];
        groups[catName].push(p);
      }

      const wb = XLSX.utils.book_new();

      const cols = [
        "name_en", "name_tr", "name_ru", "name_ar",
        "slug", "sku", "oem_code", "brand",
        "stock_status", "stock_quantity", "min_order_qty", "qty_step",
        "is_active", "is_featured",
        "description_en", "description_tr", "description_ru", "description_ar",
        "compatible_vehicles_en", "compatible_vehicles_tr", "compatible_vehicles_ru", "compatible_vehicles_ar",
        "specs_en", "specs_tr", "specs_ru", "specs_ar",
        "images",
      ];

      for (const [catName, rows] of Object.entries(groups)) {
        const data = rows.map((p: Record<string, unknown>) => {
          const row: Record<string, string | number | boolean> = {};
          for (const col of cols) {
            const val = p[col];
            if (Array.isArray(val)) {
              row[col] = val.join("|");
            } else if (val != null && typeof val === "object") {
              row[col] = JSON.stringify(val);
            } else if (val == null) {
              row[col] = "";
            } else {
              row[col] = val as string | number | boolean;
            }
          }
          return row;
        });

        const ws = XLSX.utils.json_to_sheet(data, { header: cols });
        // Sheet name max 31 chars, strip special chars
        const sheetName = catName.replace(/[\\/*?[\]:]/g, "").slice(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }

      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `urunler-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Dışa aktarma başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
      Dışa Aktar
    </button>
  );
}
