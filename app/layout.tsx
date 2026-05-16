import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { createServiceClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Jozuf Diesel — Common Rail & Injector Spare Parts",
  description: "Premium diesel injection spare parts. Bosch, Delphi, Denso, Siemens systems. 30+ years experience. Ships to 50+ countries.",
  keywords: "common rail, injector, diesel, bosch, delphi, denso, spare parts",
  openGraph: {
    title: "Jozuf Diesel",
    description: "Common Rail & Injector Spare Parts",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let gaId = "";
  let faviconUrl = "/favicon.svg";
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("settings").select("key, value").in("key", ["google_analytics", "favicon_url"]);
    if (Array.isArray(data)) {
      for (const row of data) {
        if (row.key === "google_analytics") gaId = row.value?.trim() || "";
        if (row.key === "favicon_url" && row.value?.trim()) faviconUrl = row.value.trim();
      }
    }
  } catch {
    // no-op: settings are optional
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
