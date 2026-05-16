import { createServiceClient } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = createServiceClient();
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("name_en");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Yeni Ürün Ekle</h1>
        <p className="text-gray-500 text-sm">Yeni bir ürün oluşturun</p>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  );
}
