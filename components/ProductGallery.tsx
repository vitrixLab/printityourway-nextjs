"use client";

import { useState } from "react";

export function ProductGallery({ images, alt, selectedImage }: { images: string[]; alt: string; selectedImage?: string }) {
  const [active, setActive] = useState(images[0]);
  const shown = selectedImage && images.includes(selectedImage) ? selectedImage : active;

  return (
    <div>
      <div className="detail-photo"><img key={shown} className="product-gallery-image" src={shown} alt={alt} /></div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => setActive(src)} aria-label={`View image ${i + 1}`} className={src === shown ? "active" : ""}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
