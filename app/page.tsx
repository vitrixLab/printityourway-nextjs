import Link from "next/link";
import { products, categories } from "@/data/products";
import { HeroSlider } from "@/components/HeroSlider";
import { OfferTabs } from "@/components/OfferTabs";

const base = "https://printityourway.com/wp-content/uploads";
const steps = [
  { icon: "grocery-1.svg", title: "Choose Product", copy: "Browse our collection and choose the apparel or accessory that fits your style." },
  { icon: "grocery-2.svg", title: "Upload Design", copy: "Bring your idea, artwork, or logo and make your selected product your own." },
  { icon: "grocery-3.svg", title: "Get Customized", copy: "Explore product options and create a look that feels uniquely yours." },
];
const printifyCopy = "Choose from our collection of T-shirts, hats, hoodies, and bags, then bring your own image, photo, company logo, or message to the design. Whether you are creating a personal statement, team apparel, or branded merchandise, Print It Your Way helps turn your idea into something you can wear and share.";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <section className="steps-wrap" aria-label="How it works">
        <div className="section shell steps">
          {steps.map((step, index) => (
            <article className="step" key={step.title}>
              <span className="step-number" aria-hidden="true">0{index + 1}</span>
              <img src={`${base}/2021/10/${step.icon}`} alt="" width={60} height={60} loading="lazy" />
              <h3>{step.title}</h3>
              <p className="muted">{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="heading">
          <div><span className="eyebrow">Fresh picks</span><h2>New Offers</h2></div>
          <Link className="text-link" href="/shop">Shop all products <span aria-hidden="true">→</span></Link>
        </div>
        <OfferTabs />
      </section>

      <section className="section brand-promo">
        <div className="shell promo-layout">
          <div className="promo-copy">
            <span className="eyebrow">Made personal</span>
            <h2>Make It Yours<br />Your Way</h2>
            <p>{printifyCopy}</p>
            <Link className="button" href="/contact-us?topic=custom">Start a custom order</Link>
          </div>
          <div className="promo-art">
            <img src={`${base}/2021/10/t-shirts-1.png`} alt="T-shirt ready for your custom design" width={520} height={520} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="heading">
          <div><span className="eyebrow">Find your fit</span><h2>Shop by Category</h2></div>
        </div>
        <div className="categories">
          {categories.map((category) => {
            const product = products.find((item) => item.category === category.slug);
            return (
              <Link
                className="tile"
                href={`/product-category/${category.slug}`}
                key={category.slug}
                style={product ? { backgroundImage: `linear-gradient(180deg, rgba(15, 20, 30, .04), rgba(15, 20, 30, .76)), url("${product.image}")` } : undefined}
              >
                <span>{products.filter((item) => item.category === category.slug).length} products</span>
                <b>{category.name}</b>
                <span className="tile-arrow" aria-hidden="true">↗</span>
              </Link>
            );
          })}
        </div>
      </section>

    </>
  );
}
