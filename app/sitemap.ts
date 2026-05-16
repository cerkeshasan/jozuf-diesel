import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jozufdiesel.com";
const LANGS = ["en", "tr", "ru", "ar"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase.from("products").select("slug, updated_at").eq("is_active", true);
  const { data: categories } = await supabase.from("categories").select("slug").eq("is_active", true);

  const staticPages = LANGS.flatMap((lang) => [
    { url: `${SITE_URL}/${lang}`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/${lang}/urunler`, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${SITE_URL}/${lang}/kurumsal`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/${lang}/iletisim`, changeFrequency: "monthly" as const, priority: 0.7 },
  ]);

  const productPages = LANGS.flatMap((lang) =>
    (products || []).map((p) => ({
      url: `${SITE_URL}/${lang}/urunler/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  const categoryPages = LANGS.flatMap((lang) =>
    (categories || []).map((c) => ({
      url: `${SITE_URL}/${lang}/kategori/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...productPages, ...categoryPages];
}
