import { getTranslations } from "@/lib/translations";
import CartPage from "@/components/cart/CartPage";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  return <CartPage lang={lang} t={t} />;
}
