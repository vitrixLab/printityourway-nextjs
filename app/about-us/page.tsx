import type {Metadata} from "next";import Link from "next/link";export const metadata:Metadata={title:"About us"};
const paras=[
  `Welcome to Print It Your Way, where creativity meets fashion and self-expression has no limits. We believe clothing is more than just fabric-it's a powerful way to tell your story, show your personality, and stand out from the crowd. With our tagline "Customize Your Design," we empower you to turn your ideas into wearable style.`,
  `At Print It Your Way, we specialize in custom T-shirts, hoodies, hats, and men's fashion essentials designed to fit your lifestyle. Whether you want a bold statement piece, a minimalist look, or a fully personalized design, we give you the freedom to create fashion exactly the way you imagine it.`,
  `Print It Your Way was created for individuals, creators, businesses, and trendsetters who value originality, quality, and choice. From minimal designs to bold statements, we make customization simple, accessible, and exciting.`,
  `From personal wear to corporate branding, team outfits, influencer merchandise, or special occasions.`,
  `We will print any of your images, photos, company logo, corporate identity or simply an inscription of your choice. Choose a model from our catalog or provide your own material to implement the idea`
];
export default function About(){return <section className="shell content">
  <h1>About Us</h1>
  <img className="about-img" src="https://printityourway.com/wp-content/uploads/2026/01/Fashion-store.png" alt="" width={480} height={480}/>
  {paras.map(p=><p key={p.slice(0,40)}>{p}</p>)}
  <p className="muted">Catalog preview: checkout, accounts, and live inventory are not connected. <Link href="/shop">Shop the collection</Link>.</p>
</section>}
