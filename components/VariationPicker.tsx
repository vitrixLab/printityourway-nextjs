"use client";import{useState,type ReactNode}from"react";import type{ProductAttribute,ProductVariation}from"@/data/products";import{money}from"@/data/products";
export function VariationPicker({attributes,variations,basePrice,range}:{attributes:ProductAttribute[];variations?:ProductVariation[];basePrice:number;range?:[number,number]}){
  const[selected,setSelected]=useState<Record<string,string>>({});
  const complete=attributes.length>0&&attributes.every(a=>selected[a.key]);
  const match=complete&&variations?variations.find(v=>attributes.every(a=>v.attributes[a.key]===selected[a.key])):undefined;
  const base=range?`${money(range[0])} – ${money(range[1])}`:money(basePrice);
  let priceBlock:ReactNode;
  if(!variations)priceBlock=<div className="detail-price">{base}<p className="stock-note">Prices and stock by option are not present in the source data for this product.</p></div>;
  else if(match)priceBlock=<div className="detail-price">{money(match.price)}{match.regularPrice!==match.price&&<s> {money(match.regularPrice)}</s>}<p className={match.inStock?"stock-note":"stock-note out"}>{match.inStock?"In stock":"Out of stock"}</p></div>;
  else if(complete)priceBlock=<div className="detail-price">{base}<p className="stock-note">This combination is not present in the source variation matrix.</p></div>;
  else priceBlock=<div className="detail-price">{base}<p className="stock-note muted">Select all options to see the exact price.</p></div>;
  return <div>
    <div className="options">{attributes.map(a=><label key={a.key}>{a.label}<select value={selected[a.key]??""} onChange={e=>setSelected(s=>({...s,[a.key]:e.target.value}))}><option value="" disabled>Select {a.label.toLowerCase()}</option>{a.values.map(v=><option key={v} value={v}>{v}</option>)}</select></label>)}</div>
    {priceBlock}
  </div>
}
