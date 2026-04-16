import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HSP-Pflegebox",
  description: "Ihre monatliche Pflegebox. Kostenfrei beantragen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <header className="top-nav">
          <div className="container nav-container">
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Image
                src="/logo.jpg"
                alt="HSP Pflegebox Logo"
                width={160}
                height={56}
                style={{ objectFit: "contain", height: "48px", width: "auto" }}
                priority
              />
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link">
                Startseite
              </Link>
              <Link href="/beantragen" className="nav-link">
                Beantragen
              </Link>
              <Link href="/produkte" className="nav-link">
                Produkte
              </Link>
              <Link href="/inkontinenz" className="nav-link">
                Inkontinenz
              </Link>
              <Link href="/aendern" className="nav-link">
                Box ändern
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
