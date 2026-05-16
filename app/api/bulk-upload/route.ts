import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";

interface ProductRow {
  name_en?: string;
  name_tr?: string;
  name_ru?: string;
  name_ar?: string;
  slug?: string;
  sku?: string;
  oem_code?: string;
  brand?: string;
  category_id?: string;
  stock_status?: string;
  stock_quantity?: number | string;
  min_order_qty?: number | string;
  qty_step?: number | string;
  description_en?: string;
  description_tr?: string;
  description_ru?: string;
  description_ar?: string;
  is_active?: boolean | string;
  is_featured?: boolean | string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const supabase = createServiceClient();
    const body = await req.json();
    const { products, is_active = false }: { products: ProductRow[]; is_active?: boolean } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Ürün listesi boş." }, { status: 400 });
    }

    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const row of products) {
      try {
        if (!row.name_en && !row.name_tr) {
          errors.push(`Satır atlandı: name_en veya name_tr zorunlu.`);
          continue;
        }

        const str = (val: unknown): string => (val != null ? String(val).trim() : "");
        const strOrNull = (val: unknown): string | null => { const s = str(val); return s || null; };

        const name = str(row.name_en) || str(row.name_tr);
        const slug = strOrNull(row.slug) || slugify(name);

        if (!slug) {
          errors.push(`Satır atlandı: slug üretilemedi (${name})`);
          continue;
        }

        const validStatuses = ["in_stock", "out_of_stock", "on_order"];
        const stockStatus = validStatuses.includes(str(row.stock_status)) ? str(row.stock_status) : "in_stock";

        const payload = {
          name_en: str(row.name_en) || "",
          name_tr: str(row.name_tr) || "",
          name_ru: str(row.name_ru) || "",
          name_ar: str(row.name_ar) || "",
          slug,
          sku: strOrNull(row.sku),
          oem_code: strOrNull(row.oem_code),
          brand: strOrNull(row.brand),
          category_id: strOrNull(row.category_id),
          stock_status: stockStatus,
          stock_quantity: parseInt(str(row.stock_quantity)) || 0,
          min_order_qty: parseInt(str(row.min_order_qty)) || 1,
          qty_step: parseInt(str(row.qty_step)) || 1,
          description_en: strOrNull(row.description_en),
          description_tr: strOrNull(row.description_tr),
          description_ru: strOrNull(row.description_ru),
          description_ar: strOrNull(row.description_ar),
          is_active: is_active,
          is_featured: row.is_featured === true || str(row.is_featured) === "true" ? true : false,
          images: [],
        };

        if (payload.sku) {
          const { data: existing, error: selectErr } = await supabase
            .from("products")
            .select("id")
            .eq("sku", payload.sku)
            .maybeSingle();

          if (selectErr) {
            errors.push(`SKU sorgu hatası (${name}): ${selectErr.message}`);
            continue;
          }

          if (existing) {
            const { error } = await supabase
              .from("products")
              .update({ ...payload, updated_at: new Date().toISOString() })
              .eq("id", existing.id);
            if (error) errors.push(`Güncelleme hatası (${name}): ${error.message}`);
            else updated++;
            continue;
          }
        }

        const { data: slugExisting } = await supabase
          .from("products")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (slugExisting) {
          payload.slug = `${slug}-${Date.now()}`;
        }

        const { error } = await supabase.from("products").insert(payload);
        if (error) errors.push(`Ekleme hatası (${name}): ${error.message}`);
        else inserted++;
      } catch (rowErr) {
        const msg = rowErr instanceof Error ? rowErr.message : String(rowErr);
        errors.push(`Beklenmedik hata (satır ${products.indexOf(row) + 1}): ${msg}`);
      }
    }

    return NextResponse.json({ inserted, updated, errors });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ inserted: 0, updated: 0, errors: [`Sunucu hatası: ${msg}`] }, { status: 500 });
  }
}
