import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/Navbar";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "HSP Pflegeshop | Premium Pflegehilfsmittel",
  description: "Ihr verlässlicher Partner für kostenfreie Pflegehilfsmittel. Jetzt Pflegebox kostenlos beantragen – schnell, einfach und direkt mit Ihrer Krankenkasse.",
  openGraph: {
    title: "HSP Pflegeshop | Premium Pflegehilfsmittel",
    description: "Jetzt Pflegebox kostenlos beantragen – schnell, einfach, direkt mit Ihrer Krankenkasse.",
    locale: "de_DE",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={manrope.variable}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-surface font-body text-on-surface antialiased">
        <Navbar />
        
        <main className="min-h-screen">
          {children}
        </main>

        <footer className="w-full bg-[#0d2d23] text-white/70 py-16 px-8 mt-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center p-[2px]">
                  <Image src="/logo-round.jpg" alt="HSP Pflegebox Logo" width={64} height={64} className="object-cover rounded-full" />
                </div>
              </div>
              <p className="max-w-xs leading-relaxed">
                Ihr verlässlicher Partner für hochwertige Pflegehilfsmittel. Teil der HSP Franchise und Kooperationspartner des BAD e.V.
              </p>
            </div>

            {/* Column 2: Legal (Rechtliches) */}
            <div>
              <h3 className="text-white font-bold text-xl mb-6 font-headline">Rechtliches</h3>
              <ul className="space-y-4">
                <li><Link href="/impressum" className="hover:text-primary transition-colors">Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-primary transition-colors">Datenschutzerklärung</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact (Kontakt) */}
            <div>
              <h3 className="text-white font-bold text-xl mb-6 font-headline">Kontakt</h3>
              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <span className="material-symbols-outlined text-[#a6f2d5] transition-transform group-hover:scale-110">location_on</span>
                  <div className="leading-tight">
                    <p className="text-white font-medium">HSP Pflegeshop GmbH</p>
                    <p>Oldesloer Straße 63</p>
                    <p>22457 Hamburg</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-[#a6f2d5] transition-transform group-hover:scale-110">call</span>
                  <p className="text-white">04101/696 10 90</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-white">mail</span>
                  <p className="text-white">kontakt@hsp-pflegeshop.de</p>
                </div>
              </div>
            </div>

          </div>
          
          <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60 relative z-10">
            <p>© 2024 HSP Pflegeshop. Alle Rechte vorbehalten.</p>
            <p>Premium Care Excellence</p>
          </div>
        </footer>
        {/* Floating WhatsApp CTA Removed */}
      </body>
    </html>
  );
}
