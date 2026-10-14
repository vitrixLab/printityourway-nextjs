import type {Metadata} from "next";import Link from "next/link";import {notFound} from "next/navigation";import {categories,products} from "@/data/products";import {Catalog} from "@/components/Catalog";
export function generateStaticParams(){return categories.map(c=>({slug:c.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;return {title:categories.find(c=>c.slug===slug)?.sourceLabel??"Category"}}
export default async function Category({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{orderby?:string}>}){const {slug}=await params;const {orderby}=await searchParams;const category=categories.find(c=>c.slug===slug);if(!category)notFound();let list=products.filter(p=>p.category===category.slug);if(orderby==="price")list=[...list].sort((a,b)=>a.price-b.price);if(orderby==="price-desc")list=[...list].sort((a,b)=>b.price-a.price);
  return <section className="shell">
    <p className="muted breadcrumb"><Link href="/">Home</Link> / {category.sourceLabel}</p>
    <div className="pagehead"><h1>{category.sourceLabel}</h1></div>
    <form className="controls" action={`/product-category/${category.slug}`}><label>Shop order<select name="orderby" defaultValue={orderby??""}><option value="">Default sorting</option><option value="price">Sort by price: low to high</option><option value="price-desc">Sort by price: high to low</option></select></label><button className="button">Apply</button></form>
    <p className="muted" role="alert">Showing all {list.length} results</p>
    <Catalog items={list}/>
  </section>}
