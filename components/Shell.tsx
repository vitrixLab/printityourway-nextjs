import Link from "next/link";
import { categories } from "@/data/products";
import { MobileMenu } from "@/components/MobileMenu";
import { IconFacebook,IconTwitter,IconInstagram,IconYoutube,IconPinterest,IconTiktok } from "@/components/SocialIcons";
const logo="https://printityourway.com/wp-content/uploads/2025/11/Print-it-scaled.png";
const footerLogo="https://printityourway.com/wp-content/uploads/2025/10/Print-it-934x800.jpg";
const envelope="https://printityourway.com/wp-content/uploads/2021/10/grocery-envelope.svg";
const pointer="https://printityourway.com/wp-content/uploads/2021/10/grocery-pointer.svg";
export function Header(){return <header>
  <div className="topbar"><div className="shell topbar-inner">
    <div className="topbar-left">
      <span className="topbar-item"><img src={envelope} alt="" width={12} height={12}/>Contact@printityourway.com</span>
      <span className="topbar-item"><img src={pointer} alt="" width={12} height={12}/>United States America</span>
    </div>
    <div className="socials socials-top"><IconFacebook/><IconTwitter/><IconInstagram/><IconYoutube/><IconPinterest/></div>
  </div></div>
  <div className="shell nav">
    <Link className="brand" href="/"><img src={logo} alt="Print Custom" width={120} height={103}/></Link>
    <form className="head-search" action="/shop" method="get" role="search">
      <input type="text" name="s" placeholder="Search for products" aria-label="Search" required/>
      <select name="product_cat" aria-label="Select category"><option value="">Select category</option>{categories.map(c=><option key={c.slug} value={c.slug}>{c.sourceLabel}</option>)}</select>
      <button type="submit">Search</button>
    </form>
    <MobileMenu />
    <div className="tools"><Link href="/wishlist">Wishlist</Link><Link href="/compare">Compare <span className="count">0</span></Link><Link href="/cart">Cart <span className="count">0 items</span> $0.00</Link></div>
  </div>
  <div className="mainnav"><div className="shell mainnav-inner">
    <nav><Link href="/">Home</Link><Link href="/about-us">About us</Link><Link href="/shop">Shop</Link><Link href="/contact-us">Contact us</Link></nav>
    <Link className="button" href="/shop">Explore More</Link>
  </div></div>
</header>}
export function Footer(){return <footer>
  <div className="shell foot foot-cols">
    <div className="foot-brand"><img src={footerLogo} alt="Print Custom" width={170} height={146} loading="lazy"/><p><b>Print it Your Way</b> where fashion meets individuality.</p></div>
    <div><h4>Company</h4><Link href="/">Home</Link><Link href="/about-us">About Us</Link><Link href="/shop">Shop</Link><Link href="/contact-us">Contact Us</Link></div>
    <div><h4>Quick Links</h4><span className="qlink muted">FAQ</span><span className="qlink muted">Support</span><span className="qlink muted">Privacy Policy</span><span className="qlink muted">Terms &amp; Conditions</span></div>
    <div><h4>Contact</h4><p className="contact-line"><img src={envelope} alt="" width={14} height={14} loading="lazy"/><a href="mailto:Contact@printityourway.com">Contact@printityourway.com</a></p><p className="contact-line"><img src={pointer} alt="" width={14} height={14} loading="lazy"/>United States America</p><div className="socials"><IconFacebook/><IconInstagram/><IconTiktok/><IconYoutube/></div></div>
  </div>
  <div className="copyright">Developed By <a href="http://voxturrcreative.com"><strong>Voxturr</strong></a> © 2025 <Link href="/"><strong>Print Custom</strong></Link>.</div>
</footer>}
