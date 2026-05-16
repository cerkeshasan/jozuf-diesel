"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/supabase";
import { getCategoryName } from "@/lib/translations";
import type { Translations } from "@/lib/translations";

interface CategoryGridProps {
  categories: Category[];
  lang: string;
  t: Translations;
}

// Renkli placeholder gradients for categories without images
const gradients = [
  "from-blue-600 to-blue-900",
  "from-red-600 to-red-900",
  "from-emerald-600 to-emerald-900",
  "from-purple-600 to-purple-900",
  "from-orange-600 to-orange-900",
  "from-cyan-600 to-cyan-900",
  "from-pink-600 to-pink-900",
  "from-yellow-600 to-yellow-900",
];

const icons = ["⚙️", "🔧", "💉", "🛠️", "🔩", "🏭", "⛽", "🔋"];

export default function CategoryGrid({ categories, lang, t }: CategoryGridProps) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const parentCats = categories.filter((c) => !c.parent_id);

  if (parentCats.length === 0) return null;

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-oswald text-4xl font-bold text-[#0D1B2A] mb-2">{t.home.categories}</h2>
          <p className="text-gray-500">{t.home.categoriesSubtitle}</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {parentCats.map((cat, idx) => (
            <motion.div key={cat.id} variants={item}>
              <Link href={`/${lang}/kategori/${cat.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#C0202A]">
                  <div className="aspect-video relative overflow-hidden">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={getCategoryName(cat, lang)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center`}>
                        <div className="text-center">
                          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">
                            {icons[idx % icons.length]}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-[#0D1B2A]/20 group-hover:bg-transparent transition-colors duration-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-oswald font-semibold text-[#0D1B2A] group-hover:text-[#C0202A] transition-colors leading-tight">
                      {getCategoryName(cat, lang)}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-sm">
                        {cat.product_count || 0}{" "}
                        {lang === "tr" ? "ürün" : lang === "ru" ? "товаров" : lang === "ar" ? "منتجات" : "products"}
                      </span>
                      <span className="text-[#C0202A] text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                        {t.home.explore}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
