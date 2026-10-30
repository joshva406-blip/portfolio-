import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/ui/Header';
import Cursor from '@/components/ui/Cursor';
import { Experience } from '@/components/providers/Experience';
import { PageWipeProvider } from '@/components/fx/PageWipe';
import { siteUrl } from '@/lib/site';
const general = localFont({src:[{path:'../public/fonts/general-0.woff2',weight:'400'},{path:'../public/fonts/general-1.woff2',weight:'600'},{path:'../public/fonts/general-2.woff2',weight:'700'}],variable:'--font-general',display:'swap'});
const canonical=siteUrl();
export const metadata: Metadata={...(canonical?{metadataBase:new URL(canonical)}:{}),title:'Joshva — Full Stack Developer',description:'Joshva is a full-stack developer in Coimbatore building thoughtful web and AI-powered products.',openGraph:{title:'Joshva — Full Stack Developer',description:'Thoughtful work, full stack. Web and AI-powered products from Coimbatore.',type:'website'}};
const person={'@context':'https://schema.org','@type':'Person',name:'Joshva',jobTitle:'Full Stack Developer',email:'mailto:joshvajoshva406@gmail.com',address:{'@type':'PostalAddress',addressLocality:'Coimbatore',addressRegion:'Tamil Nadu',addressCountry:'IN'},sameAs:['https://github.com/joshva406-blip','https://linkedin.com/in/joshva-i-05a9a4373'],...(canonical?{url:canonical}:{})};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en" className={general.variable}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(person).replace(/</g,"\\u003c")}}/><a className="skip-link" href="#main">Skip to content</a><PageWipeProvider><Experience/><Header/><Cursor/>{children}</PageWipeProvider></body></html>}
