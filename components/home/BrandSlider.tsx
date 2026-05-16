"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* Brand logo ikonları — inline SVG (garantili render, dış kaynak yok) */

function BoschLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 40" width="110" height="40">
      <circle cx="20" cy="20" r="18" fill="#E20015" />
      <circle cx="20" cy="20" r="14" fill="white" />
      <circle cx="20" cy="20" r="9" fill="#E20015" />
      <text x="44" y="26" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="#1A1A1A" letterSpacing="1">BOSCH</text>
    </svg>
  );
}

function DelphiLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 40" width="110" height="40">
      <text x="4" y="28" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="22" fill="#003087" letterSpacing="0.5">delphi</text>
      <rect x="4" y="31" width="60" height="3" rx="1.5" fill="#E8001C" />
    </svg>
  );
}

function DensoLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 40" width="110" height="40">
      <rect x="2" y="6" width="106" height="28" rx="4" fill="#CC0000" />
      <text x="55" y="26" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="white" letterSpacing="3" textAnchor="middle">DENSO</text>
    </svg>
  );
}

function SiemensLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40">
      <text x="4" y="26" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="16" fill="#009999" letterSpacing="0.5">SIEMENS</text>
      <rect x="4" y="29" width="88" height="2.5" rx="1.25" fill="#009999" />
    </svg>
  );
}

function ContinentalLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 40" width="140" height="40">
      <circle cx="18" cy="20" r="14" fill="none" stroke="#F5A800" strokeWidth="5" />
      <rect x="16" y="5" width="16" height="6" fill="white" />
      <text x="38" y="25" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="#1A1A1A" letterSpacing="0.3">Continental</text>
    </svg>
  );
}

function VdoLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 40" width="90" height="40">
      <rect x="2" y="4" width="86" height="32" rx="4" fill="#1A3A6B" />
      <text x="45" y="27" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="18" fill="white" letterSpacing="4" textAnchor="middle">VDO</text>
    </svg>
  );
}

function ZexelLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <text x="4" y="28" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="22" fill="#0055A4" letterSpacing="1">ZEXEL</text>
    </svg>
  );
}

function StanadyneLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 40" width="130" height="40">
      <text x="4" y="26" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="15" fill="#8B0000" letterSpacing="0.5">STANADYNE</text>
      <rect x="4" y="29" width="110" height="2.5" rx="1.25" fill="#8B0000" />
    </svg>
  );
}

const brands = [
  { name: "Bosch", Logo: BoschLogo },
  { name: "Delphi", Logo: DelphiLogo },
  { name: "Denso", Logo: DensoLogo },
  { name: "Siemens", Logo: SiemensLogo },
  { name: "Continental", Logo: ContinentalLogo },
  { name: "VDO", Logo: VdoLogo },
  { name: "Zexel", Logo: ZexelLogo },
  { name: "Stanadyne", Logo: StanadyneLogo },
];

export default function BrandSlider() {
  const doubled = [...brands, ...brands];
  const [paused, setPaused] = useState(false);

  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-wider">
          Authorized Parts For Leading Brands
        </p>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-6"
          style={{
            animation: "slideLeft 28s linear infinite",
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {doubled.map((brand, i) => (
            <motion.div
              key={i}
              onHoverStart={() => setPaused(true)}
              onHoverEnd={() => setPaused(false)}
              whileHover={{ scale: 1.08, y: -3, boxShadow: "0 8px 24px rgba(192,32,42,0.15)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center h-16 bg-white rounded-xl shadow-sm border border-gray-100 px-5 hover:border-[#C0202A] cursor-default flex-shrink-0"
            >
              <brand.Logo />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
