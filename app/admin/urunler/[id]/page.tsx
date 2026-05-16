import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").eq("is_active", true).order("name_en"),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-oswald text-2xl font-bold text-[#0D1B2A]">Ürünü Düzenle</h1>
        <p className="text-gray-500 text-sm">{product.name_en}</p>
      </div>
      <ProductForm categories={categories || []} product={product} isEdit />
    </div>
  );
}
