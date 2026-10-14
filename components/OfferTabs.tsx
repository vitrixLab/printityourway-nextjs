"use client";

import { useMemo, useState } from "react";
import { Catalog } from "@/components/Catalog";
import { products, type CategorySlug } from "@/data/products";

const tabs: { label: string; value: CategorySlug | "all" }[] = [
  { label: "All", value: "all" },
  { label: "T-Shirts", value: "shirt" },
  { label: "Hats", value: "front-hat" },
  { label: "Hoodies", value: "hoodie" },
  { label: "Bags", value: "bag" },
];

export function OfferTabs() {
  const [active, setActive] = useState<CategorySlug | "all">("all");
  const items = useMemo(
    () => active === "all" ? products : products.filter((product) => product.category === active),
    [active],
  );

  return (
    <div className="offer-tabs">
      <div className="offer-tablist" role="group" aria-label="Filter new offers">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" aria-pressed={active === tab.value}
            className="offer-tab" onClick={() => setActive(tab.value)}>
            {tab.label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        Showing {Math.min(items.length, 8)} of {items.length} products
      </p>
      <div id="offer-panel">
        <Catalog items={items.slice(0, 8)} />
        {items.length > 8 && (
          <div className="offer-more">
            <a className="button button-outline" href={active === "all" ? "/shop" : `/product-category/${active}`}>
              View all {active === "all" ? "products" : tabs.find((tab) => tab.value === active)?.label.toLowerCase()}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
