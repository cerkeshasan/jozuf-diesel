import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"
  );
}

export type Category = {
  id: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  product_count: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  name_en: string;
  name_tr: string | null;
  name_ru: string | null;
  name_ar: string | null;
  description_en: string | null;
  description_tr: string | null;
  description_ru: string | null;
  description_ar: string | null;
};

export type Product = {
  id: string;
  slug: string;
  category_id: string | null;
  brand: string | null;
  sku: string | null;
  oem_code: string | null;
  stock_status: "in_stock" | "out_of_stock" | "on_order";
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  images: string[];
  compatible_vehicles: string[];
  rating: number;
  review_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  name_en: string;
  name_tr: string | null;
  name_ru: string | null;
  name_ar: string | null;
  description_en: string | null;
  description_tr: string | null;
  description_ru: string | null;
  description_ar: string | null;
  specs_en: Record<string, string> | null;
  specs_tr: Record<string, string> | null;
  specs_ru: Record<string, string> | null;
  specs_ar: Record<string, string> | null;
  keywords: string[];
  min_order_qty: number | null;
  qty_step: number | null;
  variants: VariantGroup[] | null;
  categories?: Category;
};

export type Order = {
  id: string;
  order_number: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_country: string | null;
  note: string | null;
  lang: string;
  wa_message: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
};

export type VariantGroup = {
  label_en: string;
  label_tr?: string;
  label_ru?: string;
  label_ar?: string;
  options: string[];
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  oem_code: string;
  quantity: number;
  image?: string;
  selected_variants?: Record<string, string>;
};
