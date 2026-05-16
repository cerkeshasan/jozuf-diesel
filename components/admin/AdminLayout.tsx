"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard, Package, FolderOpen, ShoppingBag,
  Languages, Settings, LogOut, Menu, X, ChevronRight, Loader2,
  MessageSquare, Mail, Building2, FileText, Image, Warehouse
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/stok", label: "Stok", icon: Warehouse },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderOpen },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag },
  { href: "/admin/sorular", label: "Sorular", icon: MessageSquare },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: Mail },
  { href: "/admin/kurumsal", label: "Kurumsal", icon: Building2 },
  { href: "/admin/yasal-sayfalar", label: "Yasal Sayfalar", icon: FileText },
  { href: "/admin/diller", label: "Dil Yönetimi", icon: Languages },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
  { href: "/admin/medya", label: "Logo & Medya", icon: Image },
];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin");
      } else {
        setAuthChecked(true);
      }
    });

    // Listen for auth changes (e.g., session expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.replace("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    router.replace("/admin");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#C0202A]" />
          <p className="text-gray-500 text-sm">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className="bg-[#0D1B2A] text-white flex flex-col shrink-0"
        style={{ width: sidebarOpen ? "256px" : "64px", transition: "width 0.3s ease" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {sidebarOpen && (
            <Link href="/admin/dashboard" className="font-oswald text-lg font-bold hover:opacity-80 transition-opacity">
              JOZUF<span className="text-[#C0202A]">DIESEL</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors ml-auto"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  active
                    ? "bg-[#C0202A] text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {active && <ChevronRight size={16} />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Çıkış" : undefined}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Çıkış</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0">
          <h1 className="font-oswald font-semibold text-[#0D1B2A] text-lg">
            {navItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label || "Admin Panel"}
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-[#C0202A] transition-colors"
            >
              Siteyi Görüntüle →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
