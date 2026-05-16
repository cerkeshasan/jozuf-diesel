export const dynamic = "force-dynamic";

import { getTranslations } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import ProductsFilters from "@/components/product/ProductsFilters";
import Link from "next/link";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    brand?: string;
    stock?: string;
    sort?: string;
    page?: string;
    q?: string;
  }>;
}

const LIMIT = 24;

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const sp = await searchParams;
  const t = getTranslations(lang);

  const currentPage = parseInt(sp.page || "1");
  const offset = (currentPage - 1) * LIMIT;

  let query = supabase
    .from("products")
    .select("*, categories(*)", { count: "exact" })
    .eq("is_active", true);

  if (sp.category) query = query.eq("category_id", sp.category);
  if (sp.brand) query = query.eq("brand", sp.brand);
  if (sp.stock) query = query.eq("stock_status", sp.stock);
  if (sp.q) {
    const term = sp.q.trim();
    query = query.or(
      `name_en.ilike.%${term}%,name_tr.ilike.%${term}%,oem_code.ilike.%${term}%,brand.ilike.%${term}%`
    );
  }

  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    newest: { column: "created_at", ascending: false },
    "most-viewed": { column: "view_count", ascending: false },
    rating: { column: "rating", ascending: false },
    name: { column: "name_en", ascending: true },
  };
  const sort = sortMap[sp.sort || "newest"] || sortMap.newest;
  query = query.order(sort.column, { ascending: sort.ascending });

  const { data: products, count } = await query.range(offset, offset + LIMIT - 1);

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("order_index"),
    supabase.from("products").select("brand").eq("is_active", true).not("brand", "is", null),
  ]);

  const uniqueBrands = [...new Set((brands || []).map((b) => b.brand))].filter(Boolean) as string[];
  const totalPages = Math.ceil((count || 0) / LIMIT);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0D1B2A] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-oswald text-4xl font-bold text-white">{t.nav.products}</h1>
          <p className="text-gray-400 mt-2">{count || 0} {t.search.results}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <ProductsFilters
              categories={categories || []}
              brands={uniqueBrands}
              lang={lang}
              currentCategory={sp.category}
              currentBrand={sp.brand}
              currentStock={sp.stock}
              t={t}
            />
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-gray-500 text-sm">{(products || []).length} / {count || 0} {lang === "tr" ? "ürün" : lang === "ru" ? "товаров" : lang === "ar" ? "منتجات" : "products"}</p>
                {/* Active filters */}
                {sp.brand && (
                  <Link href={`?${new URLSearchParams({ ...sp, brand: "" }).toString()}`}
                    className="flex items-center gap-1 bg-[#C0202A]/10 text-[#C0202A] px-2 py-1 rounded-full text-xs">
                    {sp.brand} ×
                  </Link>
                )}
                {sp.stock && (
                  <Link href={`?${new URLSearchParams({ ...sp, stock: "" }).toString()}`}
                    className="flex items-center gap-1 bg-[#C0202A]/10 text-[#C0202A] px-2 py-1 rounded-full text-xs">
                    {sp.stock} ×
                  </Link>
                )}
              </div>
              <div className="flex gap-1">
                {[
                  { value: "newest", label: lang === "tr" ? "En Yeni" : lang === "ru" ? "Новые" : lang === "ar" ? "الأحدث" : "Latest" },
                  { value: "most-viewed", label: lang === "tr" ? "Popüler" : lang === "ru" ? "Популярные" : lang === "ar" ? "الأكثر شعبية" : "Popular" },
                  { value: "name", label: lang === "ar" ? "أ-ي" : lang === "ru" ? "А-Я" : "A-Z" },
                ].map(opt => (
                  <Link
                    key={opt.value}
                    href={`?${new URLSearchParams({ ...sp, sort: opt.value, page: "1" }).toString()}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      (sp.sort || "newest") === opt.value
                        ? "bg-[#C0202A] text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {(products || []).length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">⚙️</div>
                <p className="text-xl">{t.search.noResults}</p>
                <Link href={`/${lang}/urunler`} className="mt-4 inline-block text-[#C0202A] hover:underline text-sm">
                  {lang === "tr" ? "Filtreleri temizle" : lang === "ru" ? "Сбросить фильтры" : lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {(products || []).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      lang={lang}
                      t={{
                        addToCart: t.product.addToCart,
                        inStock: t.product.inStock,
                        outOfStock: t.product.outOfStock,
                        onOrder: t.product.onOrder,
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {currentPage > 1 && (
                      <Link
                        href={`?${new URLSearchParams({ ...sp, page: String(currentPage - 1) }).toString()}`}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                      >
                        {lang === "tr" ? "← Önceki" : lang === "ru" ? "← Назад" : lang === "ar" ? "→ السابق" : "← Prev"}
                      </Link>
                    )}
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <Link
                          key={p}
                          href={`?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                            p === currentPage
                              ? "bg-[#C0202A] text-white"
                              : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                    {currentPage < totalPages && (
                      <Link
                        href={`?${new URLSearchParams({ ...sp, page: String(currentPage + 1) }).toString()}`}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                      >
                        {lang === "tr" ? "Sonraki →" : lang === "ru" ? "Далее →" : lang === "ar" ? "→ التالي" : "Next →"}
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
