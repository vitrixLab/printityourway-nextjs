import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/Shell";

const siteUrl = "https://printityourway.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Print Custom", template: "%s | Print Custom" },
  description: "Custom T-shirts, hoodies, hats, and bags — Print it Your Way.",
  openGraph: {
    type: "website",
    siteName: "Print Custom",
    title: "Print Custom",
    description: "Custom T-shirts, hoodies, hats, and bags — Print it Your Way.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
