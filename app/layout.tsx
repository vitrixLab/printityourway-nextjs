import type {Metadata} from "next";import "./globals.css";import {Header,Footer} from "@/components/Shell";
export const metadata:Metadata={title:{default:"Print Custom — Make it personal",template:"%s | Print Custom"},description:"Personalized gifts, apparel, bags, and everyday essentials."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html>}
