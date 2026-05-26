"use client";

import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
  videoSrc?: string;
}

export default function HeroImage({ src, alt, videoSrc }: HeroImageProps) {
  if (videoSrc) {
    return (
      <div className="w-80 h-80 md:w-[540px] md:h-[540px] relative">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain"
          style={{ background: "transparent" }}
        >
          <source src={videoSrc} type="video/webm" />
          {/* WebM desteklenmezse görsele düş */}
          <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} priority />
        </video>
      </div>
    );
  }

  return (
    <div className="w-80 h-80 md:w-[540px] md:h-[540px] relative animate-hero-float">
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} priority />
    </div>
  );
}
