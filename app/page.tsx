import Link from "next/link";import {products,categories} from "@/data/products";import {Catalog} from "@/components/Catalog";
const base="https://printityourway.com/wp-content/uploads";
const slides=[
  {title:["Trendsetting","T-Shirts Drop"],copy:"Discover bold new T-shirt styles created to elevate every casual outfit.",href:"/product-category/shirt",img:`${base}/2021/10/t-shirts-1.png`},
  {title:["Shade in","Your Perfect Hat"],copy:"Discover versatile hat collections designed to match every mood and occasion.",href:"/product-category/front-hat",img:`${base}/2021/10/hats.png`},
  {title:["Stay Cozy","Essential Hoodie"],copy:"Versatile hoodie collection perfect for layering and elevating your casual look.",href:"/product-category/hoodie",img:`${base}/2021/10/hoodies.png`}
];
const steps=[
  {icon:"grocery-1.svg",title:"Choose Product",copy:"Browse our collection and choose the apparel or accessory that fits your style."},
  {icon:"grocery-2.svg",title:"Upload Design",copy:"Bring your idea, artwork, or logo and make your selected product your own."},
  {icon:"grocery-3.svg",title:"Get Customized",copy:"Explore product options and create a look that feels uniquely yours."}
];
const shirts=products.filter(p=>p.category==="shirt");
const hats=products.filter(p=>p.category==="front-hat");
const printifyCopy=`Choose from our collection of T-shirts, hats, hoodies, and bags, then bring your own image, photo, company logo, or message to the design. Whether you are creating a personal statement, team apparel, or branded merchandise, Print It Your Way helps turn your idea into something you can wear and share.`;
export default function Home(){return <>
  <section className="hero-slider"><div className="shell hero-slides">{slides.map((s,i)=><div className="hero-slide" key={s.title.join(" ")} style={{animationDelay:`${i*5}s`}}><div><h1>{s.title[0]}<br/>{s.title[1]}</h1><p>{s.copy}</p><Link className="button" href={s.href}>Shop Now</Link></div><div className="hero-art"><img src={s.img} alt="" width={340} height={340}/></div></div>)}</div></section>
  <section className="section shell steps">{steps.map(s=><div className="step" key={s.title}><img src={`${base}/2021/10/${s.icon}`} alt="" width={60} height={60} loading="lazy"/><h4>{s.title}</h4><p className="muted">{s.copy}</p></div>)}</section>
  <section className="section shell"><div className="heading"><h2>T SHIRTS</h2></div><Catalog items={shirts}/></section>
  <section className="section soft"><div className="shell printify"><h2>Make It Yours<br/> Your Way</h2><p className="muted">{printifyCopy}</p></div></section>
  <section className="section shell"><div className="heading"><h2>HATS</h2></div><Catalog items={hats}/></section>
  <section className="section soft"><div className="shell">
    <div className="banners">
      <div className="banner" style={{backgroundImage:`url(${base}/2026/01/2CBAA3.png)`}}><small>NEW PRODUCTS</small><h3>New T-Shirts</h3><p>Modern designs crafted for everyday comfort and effortless style all day.</p><Link className="button" href="/product-category/shirt">Shop Now</Link></div>
      <div className="banner" style={{backgroundImage:`url(${base}/2025/11/Bg-2.jpg)`}}><small>Hoodies</small><h3>Stay Cozy</h3><p>Soft, premium hoodies designed to keep you warm, comfortable, and stylish.</p><Link className="button" href="/product-category/hoodie">BUY NOW</Link></div>
    </div>
    <Catalog items={products}/>
  </div></section>
  <section className="section shell"><div className="heading"><h2>POPULAR CATEGORIES</h2></div><div className="categories">{categories.map(c=><Link className="tile" href={`/product-category/${c.slug}`} key={c.slug}><span>{products.filter(p=>p.category===c.slug).length} products</span><b>{c.sourceLabel}</b></Link>)}</div></section>
</>}
