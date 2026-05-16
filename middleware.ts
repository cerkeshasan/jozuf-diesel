import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "tr", "ru", "ar"];
const defaultLocale = "en";

// Country → language mapping
const countryToLang: Record<string, string> = {
  TR: "tr",
  RU: "ru", KZ: "ru", BY: "ru", UA: "ru",
  AE: "ar", SA: "ar", EG: "ar", QA: "ar", KW: "ar",
  MA: "ar", DZ: "ar", TN: "ar", IQ: "ar", JO: "ar",
  SY: "ar", LB: "ar", LY: "ar", OM: "ar", BH: "ar", YE: "ar",
};

function detectLang(request: NextRequest): string {
  // 1. Check lang-preference cookie (user explicitly chose a language)
  const cookieLang = request.cookies.get("lang-preference")?.value;
  if (cookieLang && locales.includes(cookieLang)) return cookieLang;

  // 2. Vercel geo IP header
  const country = request.headers.get("x-vercel-ip-country") || "";
  if (country && countryToLang[country]) return countryToLang[country];

  // 3. Accept-Language header fallback
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferred = acceptLanguage.split(",")[0].split("-")[0];
  if (locales.includes(preferred)) return preferred;

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, admin
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Already has a valid locale prefix — pass through
  if (locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  // Root or unlocalised path — detect language and redirect
  const lang = detectLang(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);

  // Set preference cookie so future visits go to the same lang
  response.cookies.set("lang-preference", lang, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
