import type {Metadata} from "next";import Link from "next/link";import {products,categories} from "@/data/products";import {Catalog} from "@/components/Catalog";
export const metadata:Metadata={title:"Shop"};
const PER_PAGE=12;
export default async function Shop({searchParams}:{searchParams:Promise<{category?:string;product_cat?:string;q?:string;s?:string;orderby?:string;page?:string}>}){const p=await searchParams;
  const q=(p.s??p.q??"").trim().toLowerCase();
  const cat=p.product_cat??p.category??"";
  let list=products.filter(x=>(!cat||x.category===cat)&&(!q||x.name.toLowerCase().includes(q)));
  if(p.orderby==="price")list=[...list].sort((a,b)=>a.price-b.price);
  if(p.orderby==="price-desc")list=[...list].sort((a,b)=>b.price-a.price);
  const total=list.length;
  const pages=Math.max(1,Math.ceil(total/PER_PAGE));
  const page=Math.min(Math.max(1,parseInt(p.page??"1",10)||1),pages);
  const shown=list.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const baseQuery=(extra:Record<string,string>)=>{const sp=new URLSearchParams();const s=p.s??p.q;if(s)sp.set("s",s);if(cat)sp.set("product_cat",cat);if(p.orderby)sp.set("orderby",p.orderby);for(const[k,v]of Object.entries(extra))sp.set(k,v);const str=sp.toString();return str?`/shop?${str}`:"/shop"};
  const rangeLabel=total===0?`Showing 0 of ${products.length} results`:page===1&&total<=PER_PAGE?`Showing all ${total} results`:`Showing ${(page-1)*PER_PAGE+1}–${Math.min(page*PER_PAGE,total)} of ${total} results`;
  return <section className="shell"><div className="pagehead"><h1>Shop</h1></div>
  <form className="controls" action="/shop"><label>Search<input name="s" type="search" placeholder="Search for products" defaultValue={p.s??p.q}/></label><label>Category<select name="product_cat" defaultValue={cat}><option value="">All categories</option>{categories.map(c=><option key={c.slug} value={c.slug}>{c.sourceLabel}</option>)}</select></label><label>Shop order<select name="orderby" defaultValue={p.orderby??""}><option value="">Default sorting</option><option value="price">Sort by price: low to high</option><option value="price-desc">Sort by price: high to low</option></select></label><button className="button">Apply</button></form>
  <p className="muted" role="alert">{rangeLabel}. Prices are from the archived HTML mirror; no live stock or checkout is connected.</p>
  <Catalog items={shown}/>
  {pages>1&&<nav className="pagination" aria-label="Product Pagination">{Array.from({length:pages},(_,i)=>i+1).map(n=><Link key={n} href={baseQuery({page:String(n)})} aria-current={n===page?"page":undefined} className={n===page?"current":""}>{n}</Link>)}</nav>}
  </section>}
