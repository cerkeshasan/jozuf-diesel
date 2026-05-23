import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-server";

interface OptionGroup {
  group_en: string;
  group_tr?: string;
  group_ru?: string;
  group_ar?: string;
  options: string[];
}

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
  compatible_vehicles_en?: string;
  compatible_vehicles_tr?: string;
  compatible_vehicles_ru?: string;
  compatible_vehicles_ar?: string;
  specs_en?: string;
  specs_tr?: string;
  specs_ru?: string;
  specs_ar?: string;
  images?: string;
  is_active?: boolean | string;
  is_featured?: boolean | string;
  options_json?: string;
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

    // Tüm kategorileri bir kez çek — slug/ad ile ID çözümleme için
    const { data: allCategories } = await supabase
      .from("categories")
      .select("id, slug, name_en, name_tr");
    const categoryCache = allCategories || [];

    const isUuid = (val: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const resolveCategoryId = (raw: string): string | null => {
      if (!raw) return null;
      if (isUuid(raw)) return raw;
      // slug ile bul
      const bySlug = categoryCache.find(c => c.slug === raw);
      if (bySlug) return bySlug.id;
      // TR veya EN adı ile bul (büyük/küçük harf duyarsız)
      const lower = raw.toLowerCase();
      const byName = categoryCache.find(
        c => c.name_tr?.toLowerCase() === lower || c.name_en?.toLowerCase() === lower
      );
      return byName ? byName.id : null;
    };

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

        const splitPipe = (val: unknown): string[] =>
          str(val) ? str(val).split("|").map(s => s.trim()).filter(Boolean) : [];

        const parseJson = (val: unknown): Record<string, string> | null => {
          const s = str(val);
          if (!s) return null;
          try { return JSON.parse(s); } catch { return null; }
        };

        const rowIsActive = row.is_active !== undefined
          ? (row.is_active === true || str(row.is_active) === "true")
          : is_active;

        type DbVariant = { label_en: string; label_tr: string; label_ru: string; label_ar: string; options: string[] };
        const parseOptions = (val: unknown): DbVariant[] | null => {
          const s = str(val);
          if (!s) return null;
          try {
            const parsed = JSON.parse(s) as OptionGroup[];
            if (!Array.isArray(parsed)) return null;
            return parsed.map((g) => ({
              label_en: String(g.group_en || ""),
              label_tr: String(g.group_tr || ""),
              label_ru: String(g.group_ru || ""),
              label_ar: String(g.group_ar || ""),
              options: Array.isArray(g.options) ? g.options.map(String) : [],
            }));
          } catch { return null; }
        };

        const variants = parseOptions(row.options_json);

        const payload = {
          name_en: str(row.name_en) || "",
          name_tr: str(row.name_tr) || "",
          name_ru: str(row.name_ru) || "",
          name_ar: str(row.name_ar) || "",
          slug,
          sku: strOrNull(row.sku),
          oem_code: strOrNull(row.oem_code),
          brand: strOrNull(row.brand),
          category_id: resolveCategoryId(str(row.category_id)),
          stock_status: stockStatus,
          stock_quantity: parseInt(str(row.stock_quantity)) || 0,
          min_order_qty: parseInt(str(row.min_order_qty)) || 1,
          qty_step: parseInt(str(row.qty_step)) || 1,
          description_en: strOrNull(row.description_en),
          description_tr: strOrNull(row.description_tr),
          description_ru: strOrNull(row.description_ru),
          description_ar: strOrNull(row.description_ar),
          compatible_vehicles_en: splitPipe(row.compatible_vehicles_en),
          compatible_vehicles_tr: splitPipe(row.compatible_vehicles_tr),
          compatible_vehicles_ru: splitPipe(row.compatible_vehicles_ru),
          compatible_vehicles_ar: splitPipe(row.compatible_vehicles_ar),
          specs_en: parseJson(row.specs_en),
          specs_tr: parseJson(row.specs_tr),
          specs_ru: parseJson(row.specs_ru),
          specs_ar: parseJson(row.specs_ar),
          images: splitPipe(row.images),
          is_active: rowIsActive,
          is_featured: row.is_featured === true || str(row.is_featured) === "true",
          ...(variants !== null ? { variants } : {}),
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
            errors.push(`Zaten mevcut — atlandı: "${name}" (SKU: ${payload.sku})`);
            continue;
          }
        }

        const { data: slugExisting } = await supabase
          .from("products")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (slugExisting) {
          errors.push(`Zaten mevcut — atlandı: "${name}" (slug: ${slug})`);
          continue;
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
