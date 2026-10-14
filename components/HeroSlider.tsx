"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const slides = [
  { title: ["Trendsetting", "T-Shirts Drop"], copy: "Discover bold new T-shirt styles created to elevate every casual outfit.", href: "/product-category/shirt", image: "https://printityourway.com/wp-content/uploads/2021/10/t-shirts-1.png", alt: "T-shirt collection" },
  { title: ["Shade in", "Your Perfect Hat"], copy: "Discover versatile hat collections designed to match every mood and occasion.", href: "/product-category/front-hat", image: "https://printityourway.com/wp-content/uploads/2021/10/hats.png", alt: "Hat collection" },
  { title: ["Stay Cozy", "Essential Hoodie"], copy: "Versatile hoodie collection perfect for layering and elevating your casual look.", href: "/product-category/hoodie", image: "https://printityourway.com/wp-content/uploads/2021/10/hoodies.png", alt: "Hoodie collection" },
];

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const previous = () => setActive((index) => (index + slides.length - 1) % slides.length);
  const next = () => setActive((index) => (index + 1) % slides.length);

  return (
    <section className="hero-slider" aria-label="Featured collections">
      <div className="shell hero-slides" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}>
        {slides.map((slide, index) => (
          <div className="hero-slide" key={slide.href} hidden={index !== active} aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
            <div>
              {index === 0 ? <h1>{slide.title[0]}<br />{slide.title[1]}</h1> : <h2>{slide.title[0]}<br />{slide.title[1]}</h2>}
              <p>{slide.copy}</p>
              <Link className="button" href={slide.href}>Shop Now</Link>
            </div>
            <div className="hero-art"><img src={slide.image} alt={slide.alt} width={340} height={340} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} /></div>
          </div>
        ))}
        <div className="hero-controls" aria-label="Carousel controls">
          <button type="button" onClick={previous} aria-label="Previous featured collection">‹</button>
          <span aria-live="polite">{active + 1} / {slides.length}</span>
          <button type="button" onClick={next} aria-label="Next featured collection">›</button>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play automatic slides" : "Pause automatic slides"}>{paused ? "Play" : "Pause"}</button>
        </div>
      </div>
    </section>
  );
}
