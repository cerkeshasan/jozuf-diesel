import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";
import { z } from "zod";

const ProductSchema = z.object({
  slug: z.string().min(1),
  name_en: z.string().min(1),
  name_tr: z.string().optional(),
  name_ru: z.string().optional(),
  name_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_tr: z.string().optional(),
  description_ru: z.string().optional(),
  description_ar: z.string().optional(),
  category_id: z.string().uuid().optional().nullable(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  oem_code: z.string().optional(),
  stock_status: z.enum(["in_stock", "out_of_stock", "on_order"]).default("in_stock"),
  stock_quantity: z.number().int().default(0),
  min_order_qty: z.number().int().optional(),
  qty_step: z.number().int().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  images: z.array(z.string()).default([]),
  compatible_vehicles: z.array(z.string()).default([]),
  compatible_vehicles_en: z.array(z.string()).default([]),
  compatible_vehicles_tr: z.array(z.string()).default([]),
  compatible_vehicles_ru: z.array(z.string()).default([]),
  compatible_vehicles_ar: z.array(z.string()).default([]),
  specs_en: z.record(z.string(), z.string()).optional().nullable(),
  specs_tr: z.record(z.string(), z.string()).optional().nullable(),
  specs_ru: z.record(z.string(), z.string()).optional().nullable(),
  specs_ar: z.record(z.string(), z.string()).optional().nullable(),
  variants: z.array(z.object({
    label_en: z.string().min(1),
    label_tr: z.string().optional(),
    label_ru: z.string().optional(),
    label_ar: z.string().optional(),
    options: z.array(z.string()).min(1),
  })).optional().nullable(),
});

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return false;
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await supabase.auth.getUser(token);
  return !!user;
}

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const brand = searchParams.get("brand");
  const q = searchParams.get("q");
  const all = searchParams.get("all");
  const limit = parseInt(searchParams.get("limit") || "48");

  const admin = all === "true" ? await isAuthenticated(req) : false;

  let query = supabase.from("products").select("*, categories(*)");
  if (!admin) query = query.eq("is_active", true);

  if (category) query = query.eq("category_id", category);
  if (featured) query = query.eq("is_featured", true);
  if (brand) query = query.eq("brand", brand);
  if (q) {
    query = query.or(
      `name_en.ilike.%${q}%,name_tr.ilike.%${q}%,oem_code.ilike.%${q}%,brand.ilike.%${q}%`
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const body = await req.json();
  const parsed = ProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  // Duplicate slug kontrolü
  const { data: slugExists } = await supabase
    .from("products")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (slugExists) {
    return NextResponse.json(
      { error: `Bu slug zaten kullanılıyor: "${parsed.data.slug}". Farklı bir isim veya slug deneyin.` },
      { status: 409 }
    );
  }

  // Duplicate SKU kontrolü
  if (parsed.data.sku) {
    const { data: skuExists } = await supabase
      .from("products")
      .select("id")
      .eq("sku", parsed.data.sku)
      .maybeSingle();
    if (skuExists) {
      return NextResponse.json(
        { error: `Bu SKU zaten kayıtlı: "${parsed.data.sku}". Bu ürün sistemde mevcut.` },
        { status: 409 }
      );
    }
  }

  const { data, error } = await supabase.from("products").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const body = await req.json();
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
