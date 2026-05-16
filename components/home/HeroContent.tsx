"use client";

import { motion } from "framer-motion";
import HeroSearch from "./HeroSearch";

interface HeroContentProps {
  title: string;
  subtitle: string;
  lang: string;
  placeholder: string;
  popular: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function HeroContent({ title, subtitle, lang, placeholder, popular }: HeroContentProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
    >
      <motion.h1
        variants={item}
        className="font-oswald text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
      >
        {title}
      </motion.h1>

      <motion.p variants={item} className="text-lg text-gray-300 mb-6">
        {subtitle}
      </motion.p>

      <motion.div variants={item}>
        <HeroSearch lang={lang} placeholder={placeholder} popular={popular} />
      </motion.div>
    </motion.div>
  );
}
