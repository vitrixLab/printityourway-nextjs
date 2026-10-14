"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductAttribute, ProductVariation } from "@/data/products";
import { ProductGallery } from "@/components/ProductGallery";
import { VariationPicker } from "@/components/VariationPicker";

type Props = {
  images: string[];
  alt: string;
  category: string;
  sku?: string;
  description: string[];
  attributes: ProductAttribute[];
  variations?: ProductVariation[];
  basePrice: number;
  range?: [number, number];
  slug: string;
};

export function ProductDetails({ images, alt, category, sku, description, attributes, variations, basePrice, range, slug }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  return (
    <div className="detail">
      <ProductGallery images={images} alt={alt} selectedImage={selectedImage} />
      <div>
        <span className="eyebrow">{category.replace("-", " ")}</span>
        <h1>{alt}</h1>
        {sku && <p className="muted" style={{ margin: "4px 0", fontSize: 12 }}>SKU: {sku}</p>}
        <VariationPicker attributes={attributes} variations={variations} basePrice={basePrice} range={range} onVariationImage={setSelectedImage} />
        {!variations && <div className="notice"><b>Variation data unavailable.</b> The source mirror does not contain this product’s purchasable variation matrix. Prices and stock by option are unknown and have not been inferred.</div>}
        <div className="detail-action">
          <Link className="button" href={`/contact-us?topic=custom&product=${encodeURIComponent(slug)}`}>Request a custom order</Link>
          <p className="detail-action-note">Ask us about sizing, pricing, or your design. For direct contact, email <a href="mailto:Contact@printityourway.com">Contact@printityourway.com</a>.</p>
        </div>
        <div className="product-description"><h2>Description</h2>{description.map((para, i) => <p key={i}>{para}</p>)}</div>
      </div>
    </div>
  );
}
