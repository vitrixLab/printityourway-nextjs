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
      <div className="offer-tablist" role="tablist" aria-label="Browse new offers">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`offer-tab-${tab.value}`}
            aria-selected={active === tab.value}
            aria-controls="offer-panel"
            className="offer-tab"
            onClick={() => setActive(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id="offer-panel" role="tabpanel" aria-labelledby={`offer-tab-${active}`}>
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
