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
      <ProductDetails images={p.gallery} alt={p.name} attributes={p.attributes} variations={p.variations} basePrice={p.price} range={p.range} />
      <div className="detail-copy">
        <span className="eyebrow">{p.category.replace("-", " ")}</span>
        <h1>{p.name}</h1>
        {p.sku && <p className="muted" style={{ margin: "4px 0", fontSize: 12 }}>SKU: {p.sku}</p>}
        {!p.variations && <div className="notice"><b>Variation data unavailable.</b> The source mirror does not contain this product’s purchasable variation matrix. Prices and stock by option are unknown and have not been inferred.</div>}
        <div className="product-description">{p.description.map((para, i) => <p key={i}>{para}</p>)}</div>
        <button className="button" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>Purchasing unavailable in catalog preview</button>
        <p className="muted">No cart, stock reservation, payment, or order submission is connected yet.</p>
      </div>
      {related.length > 0 && <section className="section"><div className="heading"><h2>You may also like</h2></div><Catalog items={related} /></section>}
    </section>
  );
}
