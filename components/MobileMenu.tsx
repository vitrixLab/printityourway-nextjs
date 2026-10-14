"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="mobile-menu">
      <button ref={toggleRef} type="button" aria-expanded={open} aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}>Menu</button>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation">
        <Link href="/">Home</Link><Link href="/about-us">About us</Link>
        <Link href="/shop">Shop</Link><Link href="/contact-us">Contact us</Link>
      </nav>}
    </div>
  );
}
