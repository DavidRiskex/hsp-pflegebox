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
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-1">
                  <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="object-contain" />
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
        {/* Floating WhatsApp CTA */}
        <a
          href="https://wa.me/4941016961090"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Jetzt per WhatsApp kontaktieren"
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-4 rounded-full shadow-2xl shadow-green-500/40 hover:scale-105 hover:shadow-green-400/50 transition-all duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.79L2 22l5.46-1.43c1.36.73 2.91 1.15 4.58 1.15 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 14.12c-.23.65-1.35 1.24-1.85 1.32-.5.08-1.13.12-1.82-.12-.42-.14-.96-.33-1.66-.65C9.91 15.7 7.88 13.16 7.72 12.95c-.16-.2-1.3-1.73-1.3-3.3s.82-2.35 1.12-2.67c.3-.32.65-.4.87-.4h.62c.2 0 .47-.08.74.56.28.65.95 2.32 1.03 2.49.08.16.13.35.03.56-.1.2-.15.32-.3.5-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.2.32.87 1.43 1.87 2.32 1.28 1.14 2.37 1.5 2.7 1.67.32.16.5.13.68-.08.17-.2.72-.85.91-1.14.2-.3.4-.25.67-.15.28.1 1.77.84 2.07.99.3.15.5.23.57.35.08.12.08.66-.15 1.31z"/>
          </svg>
          <span className="font-bold text-sm">WhatsApp</span>
        </a>
      </body>
    </html>
  );
}
