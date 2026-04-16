"use client";

import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="glass-panel rounded-[2rem] p-8 lg:p-16 border border-white/40 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="relative z-10">
          <Link 
            href="/" 
            className="text-primary font-bold flex items-center gap-2 mb-8 hover:opacity-70 transition-all text-sm uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Zurück zur Startseite
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-12 tracking-tight font-headline">
            Impressum
          </h1>

          <div className="space-y-12 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Angaben gemäß § 5 DDG</h2>
              <p className="font-medium text-lg text-on-surface">
                HSP Pflegeshop GmbH<br />
                Oldesloer Straße 63<br />
                22457 Hamburg
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Registereintrag</h2>
              <p>
                Handelsregister: HRB 15114 PI<br />
                Registergericht: Amtsgericht Pinneberg
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Vertreten durch</h2>
              <p>Elias Farid Amin</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4 font-headline">Kontakt</h2>
              <div className="space-y-2">
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">call</span>
                  Telefon: 04101/696 10 90
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">print</span>
                  Telefax: 04101/696 10 91
                </p>
                <p className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-sm">mail</span>
                  E-Mail: <a href="mailto:kontakt@hsp-pflegeshop.de" className="text-primary hover:underline">kontakt@hsp-pflegeshop.de</a>
                </p>
              </div>
            </section>

            <section className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <h2 className="text-xl font-bold text-primary mb-4">Umsatzsteuer-ID</h2>
              <p className="text-sm">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                <span className="font-mono font-bold">018/291/25808</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">EU-Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>.
              </p>
              <p className="mt-2 text-sm italic">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
