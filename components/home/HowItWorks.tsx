"use client";

import { motion } from "framer-motion";
import { ShoppingCart, FileText, MessageCircle, Package } from "lucide-react";
import type { Translations } from "@/lib/translations";

interface HowItWorksProps {
  t: Translations;
}

export default function HowItWorks({ t }: HowItWorksProps) {
  const steps = [
    { icon: ShoppingCart, title: t.home.step1, desc: t.home.step1Desc, num: "01" },
    { icon: FileText, title: t.home.step2, desc: t.home.step2Desc, num: "02" },
    { icon: MessageCircle, title: t.home.step3, desc: t.home.step3Desc, num: "03" },
    { icon: Package, title: t.home.step4, desc: t.home.step4Desc, num: "04" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-oswald text-4xl font-bold text-[#0D1B2A] mb-2">{t.home.howItWorks}</h2>
          <div className="w-16 h-1 bg-[#C0202A] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <motion.div
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gray-200 z-0 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative z-10"
            >
              <div className="w-20 h-20 bg-[#F8FAFC] border-2 border-[#C0202A] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <step.icon size={32} className="text-[#C0202A]" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#C0202A] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-oswald font-semibold text-[#0D1B2A] text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
