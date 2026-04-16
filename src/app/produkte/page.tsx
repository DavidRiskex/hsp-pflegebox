"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  group: string;
  title: string;
  desc: string;
  img: string;
  imgAlt: string;
  secondImg?: string;
  buttons: { label: string; href: string; external?: boolean }[];
}

interface Category {
  name: string;
  icon: string;
  products: Product[];
}

const categories: Category[] = [
  {
    name: "Hände- & Flächendesinfektion",
    icon: "sanitizer",
    products: [
      {
        group: "Sterillium® pure & Gel pure",
        title: "Händedesinfektionsmittel",
        desc: "Als Lösung (500 ml / 100 ml / 1 L) und als Gel pure (100 ml). Viruzid, bakterizid, fungizid. Ohne Parfüm, ohne Farbstoff.",
        img: "/products/sterillium-pure-group.png",
        imgAlt: "Sterillium pure Produktgruppe",
        buttons: [{ label: "VAH-Liste", href: "https://www.vah-liste.de/", external: true }],
      },
      {
        group: "Bacillol® AF",
        title: "Flächendesinfektionsmittel",
        desc: "Alkoholische Schnelldesinfektion für Flächen und Einrichtungen. Gebrauchsfertig, rückstandsfrei und schnell wirkend.",
        img: "/products/bacillol-af.png",
        imgAlt: "Bacillol AF Flächendesinfektion",
        buttons: [{ label: "Produktinfo", href: "#" }],
      },
      {
        group: "Sterillium® 2in1 wipes",
        title: "Handdesinfektionstücher",
        desc: "Praktische Tücher für Hände und kleine Flächen – ideal für unterwegs und den schnellen Einsatz im Pflegealltag.",
        img: "/products/sterillium-wipes.png",
        imgAlt: "Sterillium 2in1 wipes",
        buttons: [],
      },
      {
        group: "Sterillium® home",
        title: "Flächendesinfektionstücher",
        desc: "Hochwirksame Flächendesinfektion. 80 Stk., 100 % plastikfrei, VAH-zertifiziert für höchste Sicherheitsstandards.",
        img: "/products/sterillium-home-tuecher.png",
        imgAlt: "Sterillium home Tücher",
        buttons: [],
      },
      {
        group: "Bacillol® 30 Sensitive Green Tissues",
        title: "Flächendesinfektionstücher",
        desc: "100 % plastikfreie, materialschonende Tissues. 24 Stk., niedrigalkoholisch und extrem schnell wirkend.",
        img: "/products/bacillol-30-tissues.png",
        imgAlt: "Bacillol 30 Sensitive Green Tissues",
        buttons: [],
      },
    ]
  },
  {
    name: "Handschuhe & Schutzbekleidung",
    icon: "front_hand",
    products: [
      {
        group: "Peha-soft® Nitrile Blue / Latex Protect / Vinyl",
        title: "Untersuchungshandschuhe",
        desc: "In drei Sorten erhältlich: Nitril (Blau), Latex und Vinyl – alle puderfrei. Größen S bis XL. Sicherer Schutz bei der Pflege.",
        img: "/products/peha-soft-nitrile-blue.png",
        imgAlt: "Peha-soft Nitrile Blue Handschuhe",
        secondImg: "/products/peha-soft-latex-protect.png",
        buttons: [],
      },
      {
        group: "Vala®Comfort apron",
        title: "Einmal-Schutzschürze",
        desc: "PE-Einmalschutzschürzen, 70×135 cm, 100 Stk. Sicherer Schutz vor Flüssigkeiten und Verunreinigungen.",
        img: "/products/vala-comfort-apron.png",
        imgAlt: "Vala Comfort Apron",
        buttons: [],
      },
      {
        group: "Vala®Fit tape",
        title: "Einmal-Schutzlätzchen",
        desc: "Flüssigkeitsdichte Lätzchen mit Klebestreifen für einfache Handhabung und hygienische Sicherheit beim Essen.",
        img: "/products/hartmann-vala-fit-tape-packung_1280x1280.jpg",
        imgAlt: "Vala Fit Tape Schutzlätzchen",
        buttons: [],
      },
      {
        group: "Foliodress® Mask Loop",
        title: "Gesichtsmasken",
        desc: "FFP2-Masken und OP-Masken Typ IIR für maximalen Infektionsschutz für Pflegende und Patienten.",
        img: "/products/foliodress-mask-iir.png",
        imgAlt: "Foliodress Masken",
        buttons: [],
      },
    ]
  },
  {
    name: "Bettschutzeinlagen",
    icon: "bed",
    products: [
      {
        group: "MoliCare® Premium Bed Mat 5 Tropfen",
        title: "Einweg-Bettschutzeinlagen",
        desc: "60×90 cm, saugstarker Zellstoff-Kern. Zuverlässiger Schutz für Betten und Polstermöbel.",
        img: "/products/65804-138744_molicare_premium_bedmat_1_1920x1920.webp",
        imgAlt: "MoliCare Premium Bed Mat",
        buttons: [],
      },
      {
        group: "MoliCare® Bed Mat Textile",
        title: "Waschbare Bettschutzeinlagen",
        desc: "Atmungsaktiv und bis zu 100× waschbar. Umweltfreundliche Lösung für den langfristigen Bettschutz.",
        img: "/products/molicare-textile.png",
        imgAlt: "MoliCare Bed Mat Textile",
        buttons: [],
      },
    ]
  }
];

export default function ProduktePage() {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto overflow-x-hidden">
      <header className="mb-24 text-center max-w-3xl mx-auto">
        <span className="text-tertiary font-bold tracking-widest uppercase text-sm mb-4 block">QUALITÄTSVERSPRECHEN</span>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-8 font-headline">
          Reinheit & Schutz von <span className="text-primary italic">HARTMANN</span>
        </h1>
        <p className="text-xl text-on-surface-variant leading-relaxed">
          Alle Hilfsmittel unserer Pflegeboxen stammen vom deutschen Marktführer HARTMANN. 
          Geprüfte Medizinprodukte für höchste Sicherheit in der häuslichen Pflege.
        </p>
      </header>

      {categories.map((cat, catIdx) => (
        <section key={catIdx} className="mb-24 last:mb-0">
          <div className="flex items-center gap-4 mb-12 border-b border-surface-variant/20 pb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
            </div>
            <h2 className="text-3xl font-extrabold font-headline text-on-surface">{cat.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cat.products.map((p, i) => (
              <div key={i} className="glass-card rounded-[3rem] p-1 border border-surface-variant/10 editorial-shadow group transition-all duration-500 hover:-translate-y-2">
                <div className="bg-white rounded-[2.9rem] p-8 h-full flex flex-col">
                  {/* Image Area */}
                  <div 
                    onClick={() => setSelectedImg(p.img)}
                    className="w-full h-64 bg-surface-container-low rounded-[2rem] mb-8 overflow-hidden relative flex items-center justify-center cursor-zoom-in group-hover:bg-primary/5 transition-colors duration-500"
                  >
                    {p.secondImg ? (
                      <div className="flex w-full h-full p-4 gap-2">
                        <div className="relative flex-1">
                          <Image src={p.img} alt={p.imgAlt} fill className="object-contain p-2" />
                        </div>
                        <div className="relative flex-1">
                          <Image src={p.secondImg} alt="Sekundärbild" fill className="object-contain p-2" />
                        </div>
                      </div>
                    ) : (
                      <Image src={p.img} alt={p.imgAlt} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
                       <span className="material-symbols-outlined text-3xl bg-primary/40 p-3 rounded-full backdrop-blur-sm">zoom_in</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <span className="text-[10px] font-extrabold text-primary tracking-[0.2em] uppercase mb-2 block leading-snug">
                      {p.group}
                    </span>
                    <h3 className="text-2xl font-extrabold text-on-surface mb-4 font-headline leading-tight break-words hyphens-auto">
                      {p.title}
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed text-sm">
                      {p.desc}
                    </p>
                  </div>

                  {/* Document Buttons */}
                  {p.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-surface-variant/10">
                      {p.buttons.map((b, bi) => (
                        <Link
                          key={bi}
                          href={b.href}
                          target={b.external ? "_blank" : undefined}
                          rel={b.external ? "noopener noreferrer" : undefined}
                          className="px-4 py-2 bg-surface-container-low hover:bg-primary-container text-on-surface-variant hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-transparent hover:border-primary/20"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {b.href.includes('.pdf') || b.label.includes('DB') || b.label.includes('info') ? 'description' : 'open_in_new'}
                          </span>
                          {b.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Lightbox Modal: Neutral Blur Effect */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-white/10 backdrop-blur-[60px] flex items-center justify-center p-8 animate-in fade-in duration-500"
          onClick={() => setSelectedImg(null)}
        >
          <button 
            className="absolute top-8 right-8 text-on-surface p-4 hover:scale-110 transition-transform bg-surface-container-highest/20 rounded-full backdrop-blur-md"
            onClick={() => setSelectedImg(null)}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <div className="relative w-full max-w-5xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-white/20 rounded-[4rem] blur-2xl -z-10 animate-pulse"></div>
            <Image 
              src={selectedImg} 
              alt="Vergrößerte Ansicht" 
              fill 
              className="object-contain animate-in zoom-in-95 duration-500"
              priority
            />
          </div>
        </div>
      )}

      {/* Final CTA Box */}
      <div className="mt-24 glass-panel rounded-[4rem] p-12 lg:p-20 text-center editorial-shadow border border-white/50 relative overflow-hidden bg-primary/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight font-headline">Bereit für Ihre Versorgung?</h2>
          <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">
            Wählen Sie Ihre individuellen Premium-Produkte und wir kümmern uns um den Rest.
          </p>
          <Link 
            href="/beantragen" 
            className="bg-primary text-on-primary px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 inline-block"
          >
            Antrag in 2 Minuten starten
          </Link>
        </div>
      </div>
    </main>
  );
}
