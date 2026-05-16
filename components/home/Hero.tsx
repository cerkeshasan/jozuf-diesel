import { supabase } from "@/lib/supabase";
import { getTranslations, type Lang } from "@/lib/translations";
import HeroImage from "./HeroImage";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";
import { DottedSurface } from "@/components/ui/dotted-surface";

interface HeroProps {
  lang: Lang;
}

export default async function Hero({ lang }: HeroProps) {
  const t = getTranslations(lang);

  const { data: settingsRows, error } = await supabase.from("settings").select("key, value");

  if (error) {
    console.error("Error fetching settings for Hero:", error);
    return <div>Error loading hero section.</div>;
  }

  const settings: Record<string, string> = Object.fromEntries(
    (settingsRows || []).map((s) => [s.key, s.value ?? ""])
  );

  const heroImageUrl = settings["hero_image_url"] || "/images/hero-injector.png";

  return (
    <section className="relative bg-[#0D1B2A] py-16 md:py-24">
      {/* Animasyonlu nokta arka planı */}
      <DottedSurface className="opacity-60" />

      <div className="relative z-20 container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Sol taraf: Başlık ve Arama */}
        <HeroContent
          title={settings[`hero_title_${lang}`] || "Common Rail & Injector Parts"}
          subtitle={settings[`hero_subtitle_${lang}`] || "Bosch, Delphi, Denso, Siemens — original quality parts."}
          lang={lang}
          placeholder={t.hero.searchPlaceholder}
          popular={t.hero.popular}
        />

        {/* Sağ taraf: Animasyonlu Görsel */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <HeroImage
            src={heroImageUrl}
            alt={settings[`hero_title_${lang}`] || "Jozuf Diesel"}
          />
        </div>
      </div>

      {/* İstatistik Çubuğu */}
      <HeroStats stats={t.hero.stats} />
    </section>
  );
}
