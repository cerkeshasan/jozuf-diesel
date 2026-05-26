export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getTranslations, languages, type Lang } from "@/lib/translations";
import { supabase } from "@/lib/supabase";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/cart/WhatsAppFloat";
import ScrollToTop from "@/components/ui/ScrollToTop";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return Object.keys(languages).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);
  return {
    title: `Jozuf Diesel — ${t.hero.stats.products} | Common Rail Parts`,
    description: `Bosch, Delphi, Denso, Siemens — ${t.hero.stats.years} | ${t.hero.stats.countries}`,
    alternates: {
      languages: {
        en: "/en",
        tr: "/tr",
        ru: "/ru",
        ar: "/ar",
      },
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const dir = languages[lang as Lang]?.dir || "ltr";

  const [{ data: categories }, { data: settingsRows }] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("order_index"),
    supabase.from("settings").select("key, value"),
  ]);

  // Tüm ayarları tek bir map'e topla — hem TopBar hem Footer kullanır
  const settings: Record<string, string> = Object.fromEntries(
    (settingsRows || []).map((s) => [s.key, s.value ?? ""])
  );

  return (
    <div dir={dir} lang={lang} className="overflow-x-hidden">
      <TopBar lang={lang} settings={settings} />
      <Header lang={lang} t={t} categories={categories || []} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} t={t} settings={settings} />
      <WhatsAppFloat lang={lang} whatsappNumber={settings["whatsapp"]} />
      <ScrollToTop />
    </div>
  );
}
