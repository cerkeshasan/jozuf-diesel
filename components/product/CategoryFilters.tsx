"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Translations } from "@/lib/translations";
import type { Category } from "@/lib/supabase";
import CategoryTree from "./CategoryTree";

interface CategoryFiltersProps {
  allCategories: Category[];  // tüm kategoriler (ağaç için)
  brands: string[];
  lang: string;
  slug: string;               // aktif sayfa slug'ı
  currentStock?: string;
  currentBrand?: string;
  currentSort?: string;
  t: Translations;
}

export default function CategoryFilters({
  allCategories,
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
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`/${lang}/kategori/${slug}?${params.toString()}`);
  };

  const stockOptions = [
    { value: "in_stock", label: t.product.inStock },
    { value: "on_order", label: t.product.onOrder },
    { value: "out_of_stock", label: t.product.outOfStock },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-oswald font-semibold text-[#0D1B2A] text-lg">{t.filters.title}</h3>
        {(currentStock || currentBrand) && (
          <button
            onClick={() => router.push(`/${lang}/kategori/${slug}`)}
            className="text-xs text-[#C0202A] hover:underline"
          >
            {t.filters.clear}
          </button>
        )}
      </div>

      {/* Kategori ağacı — her zaman tam görünür */}
      <div>
        <h4 className="font-medium text-xs text-gray-500 mb-2 uppercase tracking-wide">
          {lang === "tr" ? "Kategoriler" : lang === "ru" ? "Категории" : lang === "ar" ? "الفئات" : "Categories"}
        </h4>
        <CategoryTree
          categories={allCategories}
          lang={lang}
          activeSlug={slug}
        />
      </div>

      <div className="border-t border-gray-100" />

      {/* Stok */}
      <div>
        <h4 className="font-medium text-xs text-gray-500 mb-2 uppercase tracking-wide">
          {t.filters.stockStatus}
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="stock"
              checked={!currentStock}
              onChange={() => navigate("stock", null)}
              className="accent-[#C0202A]"
            />
            <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
              {t.filters.all}
            </span>
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

      {/* Marka */}
      {brands.length > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <div>
            <h4 className="font-medium text-xs text-gray-500 mb-2 uppercase tracking-wide">
              {t.filters.brand}
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={!currentBrand}
                  onChange={() => navigate("brand", null)}
                  className="accent-[#C0202A]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#C0202A] transition-colors">
                  {t.filters.all}
                </span>
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
        </>
      )}
    </div>
  );
}
