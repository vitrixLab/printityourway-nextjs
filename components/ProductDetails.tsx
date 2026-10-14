"use client";

import { useState } from "react";
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
};

export function ProductDetails({ images, alt, category, sku, description, attributes, variations, basePrice, range }: Props) {
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
        <div className="product-description">{description.map((para, i) => <p key={i}>{para}</p>)}</div>
        <button className="button" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>Purchasing unavailable in catalog preview</button>
        <p className="muted">No cart, stock reservation, payment, or order submission is connected yet.</p>
      </div>
    </div>
  );
}
