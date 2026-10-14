"use client";

import { useState } from "react";
import type { ProductAttribute, ProductVariation } from "@/data/products";
import { ProductGallery } from "@/components/ProductGallery";
import { VariationPicker } from "@/components/VariationPicker";

type Props = {
  images: string[];
  alt: string;
  attributes: ProductAttribute[];
  variations?: ProductVariation[];
  basePrice: number;
  range?: [number, number];
};

export function ProductDetails({ images, alt, attributes, variations, basePrice, range }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  return (
    <div className="detail">
      <ProductGallery images={images} alt={alt} selectedImage={selectedImage} />
      <div>
        <VariationPicker
          attributes={attributes}
          variations={variations}
          basePrice={basePrice}
          range={range}
          onVariationImage={setSelectedImage}
        />
      </div>
    </div>
  );
}
