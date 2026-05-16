"use client";

import { usePathname } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login sayfasında sidebar gösterme
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
