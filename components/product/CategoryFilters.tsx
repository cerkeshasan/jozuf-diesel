"use client";

import { useRouter } from "next/navigation";
import type { Translations } from "@/lib/translations";

interface CategoryFiltersProps {
  brands: string[];
  lang: string;
  slug: string;
  currentStock?: string;
  currentBrand?: string;
  currentSort?: string;
  t: Translations;
}

export default function CategoryFilters({
  brands,
  lang,
  slug,
  currentStock,
  currentBrand,
  t,
}: CategoryFiltersProps) {
  const router = useRouter();

  const navigate = (key: string, value: string | null) => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // reset to page 1 on filter change
    router.push(`/${lang}/kategori/${slug}?${params.toString()}`);
  };

  const stockOptions = [
    { value: "in_stock", label: t.product.inStock },
    { value: "on_order", label: t.product.onOrder },
    { value: "out_of_stock", label: t.product.outOfStock },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-oswald font-semibold text-[#0D1B2A] text-lg">Filtreler</h3>
        {(currentStock || currentBrand) && (
          <button
            onClick={() => {
              const params = new URLSearchParams();
              router.push(`/${lang}/kategori/${slug}`);
            }}
            className="text-xs text-[#C0202A] hover:underline"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <h4 className="font-medium text-xs text-gray-500 mb-3 uppercase tracking-wide">Stok Durumu</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="stock"
              checked={!currentStock}
              onChange={() => navigate("stock", null)}
              className="accent-[#C0202A]"
            />
            <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">Tümü</span>
          </label>
          {stockOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="stock"
                checked={currentStock === opt.value}
                onChange={() => navigate("stock", opt.value)}
                className="accent-[#C0202A]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h4 className="font-medium text-xs text-gray-500 mb-3 uppercase tracking-wide">Marka</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                checked={!currentBrand}
                onChange={() => navigate("brand", null)}
                className="accent-[#C0202A]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">Tümü</span>
            </label>
            {brands.slice(0, 10).map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={currentBrand === brand}
                  onChange={() => navigate("brand", brand)}
                  className="accent-[#C0202A]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
