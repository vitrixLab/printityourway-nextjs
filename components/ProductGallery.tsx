"use client";

import { useState } from "react";

export function ProductGallery({ images, alt, selectedImage }: { images: string[]; alt: string; selectedImage?: string }) {
  const [picked, setPicked] = useState<{ src: string; variant?: string } | null>(null);
  const shown = picked && picked.variant === selectedImage
    ? picked.src
    : selectedImage && images.includes(selectedImage)
      ? selectedImage
      : images[0];

  return (
    <div>
      <div className="detail-photo"><img key={shown} className="product-gallery-image" src={shown} alt={alt} /></div>
      {images.length > 1 && (
        <div className="gallery-thumbs" aria-label="Product images">
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => setPicked({ src, variant: selectedImage })}
              aria-label={`View image ${i + 1}`} aria-pressed={src === shown}
              className={src === shown ? "active" : ""}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
