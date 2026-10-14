"use client";

import { useEffect, useState } from "react";

export function ProductGallery({ images, alt, selectedImage }: { images: string[]; alt: string; selectedImage?: string }) {
  const [active, setActive] = useState(images[0]);

  useEffect(() => {
    if (selectedImage && images.includes(selectedImage)) setActive(selectedImage);
  }, [selectedImage, images]);

  return (
    <div>
      <div className="detail-photo"><img src={active} alt={alt} /></div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => setActive(src)} aria-label={`View image ${i + 1}`} className={src === active ? "active" : ""}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
