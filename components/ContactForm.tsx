"use client";

import { useMemo, useState, type FormEvent } from "react";

type Fields = { name: string; email: string; phone: string; company: string; message: string };
const empty: Fields = { name: "", email: "", phone: "", company: "", message: "" };

export function ContactForm({ initialMessage = "" }: { initialMessage?: string }) {
  const [fields, setFields] = useState<Fields>({ ...empty, message: initialMessage });
  const [attempted, setAttempted] = useState(false);
  const update = (key: keyof Fields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const mailto = useMemo(() => {
    const body = [
      `Name: ${fields.name}`, `Email: ${fields.email}`, `Phone: ${fields.phone}`,
      `Company: ${fields.company}`, "", fields.message,
    ].join("\n").slice(0, 1500);
    return `mailto:Contact@printityourway.com?subject=${encodeURIComponent("Print It Your Way inquiry")}&body=${encodeURIComponent(body)}`;
  }, [fields]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
  }

  return <form className="contact-form" onSubmit={onSubmit} aria-label="Contact form">
    <div className="contact-row">
      <label>Your Name<input name="your-name" type="text" maxLength={400} required value={fields.name} onChange={(e) => update("name", e.target.value)} /></label>
      <label>Your Email<input name="your-email" type="email" maxLength={400} required value={fields.email} onChange={(e) => update("email", e.target.value)} /></label>
    </div>
    <div className="contact-row">
      <label>Phone Number<input name="tel-767" type="tel" maxLength={400} value={fields.phone} onChange={(e) => update("phone", e.target.value)} /></label>
      <label>Company<input name="text-1" type="text" maxLength={400} value={fields.company} onChange={(e) => update("company", e.target.value)} /></label>
    </div>
    <label>Your Message<textarea name="your-message" rows={10} maxLength={1500} value={fields.message} onChange={(e) => update("message", e.target.value)} /></label>
    <button className="button" type="submit">Continue with email</button>
    {attempted && <div className="notice" role="status">
      <b>Not sent yet.</b> Your message has not been delivered by this website. <a href={mailto}>Open in email app</a> to review and send it from your own email client.
    </div>}
    {!attempted && <a className="text-link" href={mailto}>Open in email app</a>}
  </form>;
}
