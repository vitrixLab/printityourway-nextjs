import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, products } from "@/data/products";
import { Catalog } from "@/components/Catalog";
import { ProductDetails } from "@/components/ProductDetails";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  return { title: p?.name ?? "Product", description: p?.description[0]?.slice(0, 160) };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);

  return (
    <section className="shell">
      <p className="muted" style={{ paddingTop: 20 }}><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {p.name}</p>
      <ProductDetails images={p.gallery} alt={p.name} category={p.category} sku={p.sku} description={p.description} attributes={p.attributes} variations={p.variations} basePrice={p.price} range={p.range} slug={p.slug} />
      {related.length > 0 && <section className="section"><div className="heading"><h2>You may also like</h2></div><Catalog items={related} /></section>}
    </section>
  );
}
