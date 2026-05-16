"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroImageProps {
  src: string;
  alt: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <motion.div
      initial={{ y: -20, rotate: -5 }}
      animate={{ y: 20, rotate: 5 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 4,
        ease: "easeInOut",
      }}
      className="w-80 h-80 md:w-[540px] md:h-[540px] relative"
    >
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} priority />
    </motion.div>
  );
}
