import { getTranslations, type Lang } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandSlider from "@/components/home/BrandSlider";
import WhyUs from "@/components/home/WhyUs";
import HowItWorks from "@/components/home/HowItWorks";


interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang: langStr } = await params;
  const lang = langStr as Lang;
  const t = getTranslations(lang);

  const [
    { data: categories },
    { data: featuredProducts },
    { data: latestProducts },
  ] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("order_index"),
    supabase.from("products").select("*").eq("is_featured", true).eq("is_active", true).limit(8),
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(8),
  ]);

  const displayProducts = (featuredProducts && featuredProducts.length > 0) ? featuredProducts : (latestProducts || []);
  const isFeatured = !!(featuredProducts && featuredProducts.length > 0);

  return (
    <>
      <Hero lang={lang} />
      <CategoryGrid categories={categories || []} lang={lang} t={t} />
      {displayProducts.length > 0 && (
        <FeaturedProducts
          products={displayProducts}
          lang={lang}
          t={t}
          isFeatured={isFeatured}
        />
      )}
      <BrandSlider />
      <WhyUs lang={lang} t={t} />
      <HowItWorks t={t} />
    </>
  );
}
