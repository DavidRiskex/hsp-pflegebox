"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FEATURED_PRODUCTS = [
  {
    id: "elastic",
    category: "Schwere Inkontinenz",
    name: "MoliCare® Premium Elastic",
    desc: "Inkontinenz-Slip mit elastischen Seitenteilen für optimale Anpassung und Sicherheit.",
    image: "/products/65804-138744_molicare_premium_bedmat_1_1920x1920.webp", // Higher quality new upload
    color: "bg-primary-container/20"
  },
  {
    id: "mobile",
    category: "Mittlere Inkontinenz",
    name: "MoliCare® Premium Mobile",
    desc: "Diskrete Einweghose (Pull-up), die wie normale Unterwäsche getragen wird.",
    image: "/products/molicare-textile.png",
    color: "bg-tertiary-fixed-dim/30"
  },
  {
    id: "form",
    category: "Mittlere Inkontinenz",
    name: "MoliCare® Premium Form",
    desc: "Anatomische Vorlagen mit auslaufsicheren Innenbündchen.",
    image: "/products/65804-138744_molicare_premium_bedmat_1_1920x1920.webp",
    color: "bg-secondary-container/20"
  }
];

export default function InkontinenzPage() {
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", timeSlot: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !file) {
      alert("Bitte füllen Sie alle Pflichtfelder aus und laden Sie ein Rezept hoch.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <div className="glass-panel rounded-[3rem] p-12 lg:p-20 text-center editorial-shadow border border-white/50 relative overflow-hidden bg-white/40">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight font-headline text-on-surface">Vielen Dank!</h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Ihre Rezept-Übermittlung und Daten sind bei uns eingegangen. Unsere Fachabteilung wird Ihr Rezept prüfen und sich zur persönlichen Beratung bei Ihnen melden.
            </p>
            <Link href="/" className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 inline-block">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="px-8 py-20 lg:py-32 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-tertiary font-bold tracking-widest uppercase text-sm mb-4 block">Individuelle Versorgung</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8 font-headline">
            Komfort & <span className="text-primary italic">Sicherheit.</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            Erleben Sie diskrete und hochwertige Inkontinenzversorgung mit Produkten der Marke HARTMANN. 
            Wir begleiten Sie von der Rezept-Einreichung bis zur monatlichen Lieferung.
          </p>
        </div>

        {/* Bento Grid: Form & Info */}
        <div className="grid lg:grid-cols-12 gap-10 items-start mb-32">
          {/* Main Form Area */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-10 lg:p-16 rounded-[3rem] editorial-shadow border border-white bg-white/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold mb-4 font-headline text-on-surface">Rezept übermitteln</h2>
                <p className="text-on-surface-variant mb-10">Füllen Sie das Formular aus und laden Sie ein Foto Ihres Rezepts hoch. Wir kümmern uns um den Rest.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* File Upload Placeholder */}
                  <div 
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className={`group border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer ${file ? "bg-primary/5 border-primary" : "border-surface-variant/20 hover:border-primary/50"}`}
                  >
                    <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-4xl text-primary">{file ? "task" : "add_a_photo"}</span>
                    </div>
                    <p className="text-xl font-bold text-on-surface mb-2">{file ? file.name : "Klicken zum Hochladen"}</p>
                    <p className="text-sm text-on-surface-variant uppercase tracking-widest font-bold">Rezept (Foto oder PDF)</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-2">Vollständiger Name*</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Max Mustermann"
                        className="w-full bg-surface-bright border-surface-variant/10 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-2">Telefonnummer*</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="Für Ihre Beratung"
                        className="w-full bg-surface-bright border-surface-variant/10 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-2">Wunsch-Zeitfenster (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="z.B. Vormittags 09:00 - 12:00 Uhr"
                      className="w-full bg-surface-bright border-surface-variant/10 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                  >
                    Anfrage & Beratung starten
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-emerald-900 text-white p-10 lg:p-12 rounded-[3rem] shadow-xl relative overflow-hidden">
               <span className="material-symbols-outlined text-6xl mb-8 opacity-20">mark_unread_chat_alt</span>
               <h3 className="text-2xl font-bold mb-4 font-headline">Warum HARTMANN?</h3>
               <p className="text-emerald-100 leading-relaxed mb-6">
                 HARTMANN steht für erstklassige Qualität und Hautfreundlichkeit. Die MoliCare® Produkte bieten maximale Diskretion und schützen die Haut aktiv durch pH-hautneutrale Materialien.
               </p>
               <div className="flex items-center gap-3 text-emerald-300 font-bold text-sm tracking-widest uppercase">
                 <span className="material-symbols-outlined">shield_check</span>
                 Medizinische Fachberatung
               </div>
            </div>

            <div className="glass-panel p-10 rounded-[3rem] editorial-shadow border border-white bg-tertiary-fixed-dim/20">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">info</span>
                 Wichtiger Hinweis
               </h3>
               <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                 Um die Versorgung mit Ihrer Krankenkasse abzurechnen, benötigen wir das **Original-Rezept** auf dem Postweg. Bitte senden Sie dieses nach der digitalen Übermittlung an:
               </p>
               <div className="bg-white/60 p-6 rounded-2xl border border-primary/10">
                 <p className="font-bold text-on-surface">HSP Pflegeshop GmbH</p>
                 <p className="text-on-surface-variant">Pyramidenweg 7</p>
                 <p className="text-on-surface-variant">25474 Ellerbek</p>
               </div>
            </div>
          </div>
        </div>

        {/* Product Showcase Selection */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold font-headline mb-4">Produktbeispiele</h2>
            <p className="text-on-surface-variant">Eine Auswahl aus dem umfangreichen HARTMANN Sortiment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURED_PRODUCTS.map((p) => (
              <div key={p.id} className="group relative glass-card rounded-[3rem] p-8 border border-white editorial-shadow transition-all hover:scale-105 bg-white/30">
                <div className={`aspect-square ${p.color} rounded-[2rem] mb-8 overflow-hidden flex items-center justify-center p-8 transition-transform group-hover:scale-95`}>
                  <Image src={p.image} alt={p.name} width={250} height={250} className="object-contain" />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 block">{p.category}</span>
                <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">{p.name}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {p.desc}
                </p>
                <div className="pt-6 border-t border-surface-variant/10 flex justify-between items-center text-primary font-bold text-sm uppercase tracking-widest">
                  Produktinfo
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-on-surface-variant italic max-w-2xl mx-auto opacity-60">
              "Dies ist nur eine kleine Auswahl. HARTMANN bietet über 100 spezialisierte Lösungen. 
              Wir finden im Gespräch genau das richtige Produkt für Ihre individuellen Bedürfnisse."
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
