import type {Metadata} from "next";import {ContactForm} from "@/components/ContactForm";export const metadata:Metadata={title:"Contact us"};
const faqs=[
  {q:"1. What type of fabric do you use for your apparel?",a:<>We use <strong>premium-quality fabrics</strong> selected for comfort, durability, and long-lasting wear. Our materials are soft, breathable, and suitable for everyday use while maintaining a stylish look.</>},
  {q:"2. Will the print fade after washing?",a:<>No. We use <strong>high-quality printing techniques</strong> designed to stay vibrant even after multiple washes. For best results, we recommend washing garments inside out with cold water.</>},
  {q:"3. Do you offer bulk or business orders?",a:<>Yes! We provide <strong>bulk and custom orders</strong> for businesses, events, teams, and brands. Whether you need branded apparel or promotional merchandise, Print Custom has you covered.</>},
  {q:"4. How long does it take to receive my order?",a:<>Order processing and printing typically take a few business days, followed by shipping. Delivery times may vary depending on location, but we always aim for <strong>fast and reliable delivery</strong>.</>},
  {q:"Where can I ship my order?",a:<>Shipping availability and delivery estimates depend on the destination and the product selected. Please contact us with your location and order details so we can confirm the available options before you order.</>},
  {q:"5. Can I customize my own design on your products?",a:<>Yes! At <strong>Print Custom</strong>, you can personalize t-shirts, hoodies, and hats with your own text, designs, or artwork. Our customization process is simple, allowing you to create fashion that truly reflects your style.</>}
];
export default function Contact(){return <section className="shell content">
  <h1>Contact Us</h1>
  <p className="eyebrow">INFORMATION QUESTIONS</p>
  <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
  <div className="faq">{faqs.map((f,i)=><details key={f.q} open={i===0}><summary>{f.q}</summary><p className="muted">{f.a}</p></details>)}</div>
  <p className="eyebrow">INFORMATION ABOUT US</p>
  <h2 className="faq-title">CONTACT US FOR ANY QUESTIONS</h2>
  <ContactForm/>
</section>}
