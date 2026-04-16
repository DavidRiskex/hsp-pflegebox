"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Startseite", href: "/" },
    { name: "Beantragen", href: "/beantragen" },
    { name: "Produkte", href: "/produkte" },
    { name: "Inkontinenz", href: "/inkontinenz" },
    { name: "Ändern", href: "/aendern" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/40 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-white/40"
          : "bg-white/20 backdrop-blur-xl border-b border-white/20"
      }`}>
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-on-primary font-black text-sm">H</span>
          </div>
          <span className="text-xl font-bold text-on-surface tracking-tight font-headline">
            HSP <span className="text-primary font-extrabold">Pflegeshop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/8 font-bold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA & Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/beantragen"
            className="hidden sm:flex bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
            Beantragen
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-surface-container-low transition-colors"
            aria-label="Menü öffnen"
          >
            <span className={`w-5 h-0.5 bg-on-surface transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-on-surface transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-on-surface transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/30 backdrop-blur-2xl border-t border-white/30 px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium mb-1 transition-colors ${
                pathname === link.href ? "bg-primary/10 text-primary font-bold" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/beantragen"
            onClick={() => setMobileOpen(false)}
            className="mt-3 w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-primary/20"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
            Pflegebox beantragen
          </Link>
        </div>
      )}
    </nav>
    </>
  );
}
