import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, products } from "@/data/products";
import { Catalog } from "@/components/Catalog";
import { ProductDetails } from "@/components/ProductDetails";

const siteUrl = "https://printityourway.com";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description[0]?.slice(0, 160),
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      type: "website",
      title: p.name,
      description: p.description[0]?.slice(0, 160),
      url: `${siteUrl}/product/${p.slug}`,
      images: p.image ? [{ url: p.image, alt: p.name }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description.join(" ").slice(0, 1000),
    image: p.gallery,
    category: p.category,
    url: `${siteUrl}/product/${p.slug}`,
    brand: { "@type": "Brand", name: "Print Custom" },
  };

  return (
    <section className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <p className="muted" style={{ paddingTop: 20 }}><Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {p.name}</p>
      <ProductDetails images={p.gallery} alt={p.name} category={p.category} sku={p.sku} description={p.description} attributes={p.attributes} variations={p.variations} basePrice={p.price} range={p.range} slug={p.slug} />
      {related.length > 0 && <section className="section"><div className="heading"><h2>You may also like</h2></div><Catalog items={related} /></section>}
    </section>
  );
}
