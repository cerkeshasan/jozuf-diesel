"use client";

import { motion } from "framer-motion";

interface HeroStatsProps {
  stats: {
    years: string;
    products: string;
    countries: string;
    delivery: string;
  };
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function HeroStats({ stats }: HeroStatsProps) {
  const values = [stats.years, stats.products, stats.countries, stats.delivery];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 container mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
    >
      {values.map((val, i) => (
        <motion.div
          key={i}
          variants={item}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(192,32,42,0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm cursor-default"
        >
          <p className="text-2xl font-bold text-white">{val}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
