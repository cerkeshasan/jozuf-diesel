import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, getCategoryName } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilters from "@/components/product/CategoryFilters";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{
    stock?: string;
    brand?: string;
    sort?: string;
    page?: string;
  }>;
}

const LIMIT = 24;

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { lang, slug } = await params;
  const sp = await searchParams;
  const t = getTranslations(lang);
  const currentPage = parseInt(sp.page || "1");
  const offset = (currentPage - 1) * LIMIT;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  // Üst kategori (varsa)
  const { data: parentCategory } = category.parent_id
    ? await supabase.from("categories").select("*").eq("id", category.parent_id).single()
    : { data: null };

  // Tüm aktif kategoriler (sol sidebar ağacı için)
  const { data: allCategories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  // Alt kategoriler (bu sayfaya ait — ürün filtresi için)
  const { data: subCategories } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", category.id)
    .eq("is_active", true)
    .order("order_index");

  let query = supabase
    .from("products")
    .select("*, categories(*)", { count: "exact" })
    .eq("is_active", true);

  const allCategoryIds = [
    category.id,
    ...(subCategories || []).map(c => c.id),
  ];

  if (allCategoryIds.length === 1) {
    query = query.eq("category_id", category.id);
  } else {
    query = query.in("category_id", allCategoryIds);
  }

  if (sp.stock) query = query.eq("stock_status", sp.stock);
  if (sp.brand) query = query.eq("brand", sp.brand);

  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    newest: { column: "created_at", ascending: false },
    "most-viewed": { column: "view_count", ascending: false },
    rating: { column: "rating", ascending: false },
    name: { column: "name_en", ascending: true },
  };
  const sort = sortMap[sp.sort || "newest"] || sortMap.newest;
  query = query.order(sort.column, { ascending: sort.ascending });

  const { data: products, count } = await query.range(offset, offset + LIMIT - 1);

  const { data: brandData } = await supabase
    .from("products")
    .select("brand")
    .in("category_id", allCategoryIds)
    .eq("is_active", true)
    .not("brand", "is", null);

  const uniqueBrands = [...new Set((brandData || []).map(b => b.brand))].filter(Boolean) as string[];
  const totalPages = Math.ceil((count || 0) / LIMIT);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#0D1B2A] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
            <Link href={`/${lang}`} className="hover:text-white transition-colors">{t.nav.home}</Link>
            <span>/</span>
            <Link href={`/${lang}/urunler`} className="hover:text-white transition-colors">{t.nav.products}</Link>
            {parentCategory && (
              <>
                <span>/</span>
                <Link href={`/${lang}/kategori/${parentCategory.slug}`} className="hover:text-white transition-colors">
                  {getCategoryName(parentCategory, lang)}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white">{getCategoryName(category, lang)}</span>
          </nav>
          <h1 className="font-oswald text-4xl font-bold text-white">{getCategoryName(category, lang)}</h1>
          {(category as Record<string, string | null>)[`description_${lang}`] && (
            <p className="text-gray-400 mt-2">{(category as Record<string, string | null>)[`description_${lang}`]}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">{count || 0} {t.filters.products}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
            <CategoryFilters
              allCategories={allCategories || []}
              brands={uniqueBrands}
              lang={lang}
              slug={slug}
              currentStock={sp.stock}
              currentBrand={sp.brand}
              currentSort={sp.sort}
              t={t}
            />
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-gray-500 text-sm">
                {(products || []).length} / {count || 0} {t.filters.products}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[
                    { value: "newest", label: t.filters.sortNewest },
                    { value: "most-viewed", label: t.filters.sortPopular },
                    { value: "name", label: t.filters.sortName },
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
            </div>

            {(products || []).length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">⚙️</div>
                <p className="text-xl">{t.search.noResults}</p>
                <Link href={`/${lang}/urunler`} className="mt-4 inline-block text-[#C0202A] hover:underline">
                  {t.filters.clear}
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                        {t.filters.prev}
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
                        {t.filters.next}
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
