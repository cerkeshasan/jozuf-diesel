import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`search:${ip}`, 60, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) return NextResponse.json([]);

  // Sanitize: strip special chars used in Supabase filter syntax
  const term = q.trim().replace(/[%_\\]/g, "\\$&").slice(0, 100);

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name_en, name_tr, oem_code, brand, images")
    .eq("is_active", true)
    .or(`name_en.ilike.%${term}%,name_tr.ilike.%${term}%,oem_code.ilike.%${term}%,brand.ilike.%${term}%`)
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
