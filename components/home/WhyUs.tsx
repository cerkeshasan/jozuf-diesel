"use client";

import { motion } from "framer-motion";
import { Shield, Award, Globe, Headphones } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface WhyUsProps {
  lang: string;
  t: Translations;
}

const features = [
  {
    icon: Award,
    title: "ISO 9001 Certified",
    desc: "All parts meet international quality standards and are tested before shipment.",
  },
  {
    icon: Shield,
    title: "OEM Quality",
    desc: "Original manufacturer quality parts for all major diesel injection systems.",
  },
  {
    icon: Globe,
    title: "Global Supply",
    desc: "We ship to 50+ countries worldwide with fast and reliable logistics.",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    desc: "Expert technical assistance available via WhatsApp and email.",
  },
];

export default function WhyUs({ lang, t }: WhyUsProps) {
  return (
    <section className="py-20 bg-[#0D1B2A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-oswald text-4xl font-bold text-white mb-2">{t.home.whyUs}</h2>
          <div className="w-16 h-1 bg-[#C0202A] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-colors group cursor-default"
            >
              <div className="w-12 h-12 bg-[#C0202A] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="font-oswald font-semibold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
