"use client";import{useState,FormEvent}from"react";
export function ContactForm(){const[sent,setSent]=useState(false);
  function onSubmit(e:FormEvent<HTMLFormElement>){e.preventDefault();setSent(true)}
  return <form className="contact-form" onSubmit={onSubmit} aria-label="Contact form">
    <div className="contact-row"><label>Your Name<input name="your-name" type="text" maxLength={400} required/></label><label>Your Email<input name="your-email" type="email" maxLength={400} required/></label></div>
    <div className="contact-row"><label>Phone Number<input name="tel-767" type="tel" maxLength={400}/></label><label>Company<input name="text-1" type="text" maxLength={400}/></label></div>
    <label>Your Message<textarea name="your-message" rows={10} maxLength={2000}/></label>
    <button className="button" type="submit">ASK A QUESTION</button>
    {sent&&<div className="notice" role="alert"><b>Not sent.</b> This form has no mail backend connected, so your message was not delivered. Nothing was submitted. Email <a href="mailto:Contact@printityourway.com">Contact@printityourway.com</a> to reach us directly.</div>}
  </form>
}
