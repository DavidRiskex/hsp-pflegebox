import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="pt-24 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative px-8 py-20 lg:py-36 overflow-hidden max-w-7xl mx-auto">
        {/* Ambient blobs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Premium Pflegelösungen
            </div>

            <h1 className="text-5xl lg:text-[5.5rem] font-extrabold text-on-surface leading-[1.05] tracking-tight mb-8 font-headline">
              Würde in jedem{" "}
              <span className="relative inline-block">
                <span className="text-primary italic">wesentlichen</span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full" />
              </span>{" "}
              Detail.
            </h1>

            <p className="text-xl text-on-surface-variant max-w-xl mb-12 leading-relaxed">
              Hochwertige Pflegehilfsmittel <strong className="text-on-surface">direkt an Ihre Haustür</strong>, vollständig von Ihrer Pflegekasse übernommen. Professionelle Pflege zu Hause – ohne Bürokratie.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/beantragen"
                className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
                Jetzt beantragen
              </Link>
              <Link
                href="/produkte"
                className="px-10 py-5 rounded-2xl font-bold text-lg border-2 border-surface-variant/30 bg-surface-container-lowest hover:border-primary/40 hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2"
              >
                Produkte ansehen
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>

            {/* Social proof pills */}
            <div className="mt-12 flex flex-wrap gap-4">
              {[
                { icon: "verified", label: "50.000+ Familien" },
                { icon: "star", label: "Bewertung 4.9/5" },
                { icon: "health_and_safety", label: "Kassenzugelassen" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-surface-container-lowest border border-surface-variant/20 rounded-full px-4 py-2 text-sm font-semibold text-on-surface editorial-shadow">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden editorial-shadow bg-surface-container-lowest p-3 border border-surface-variant/10">
              <Image
                alt="Minimalistische Pflegebox"
                src="/paket.png"
                width={600}
                height={750}
                className="w-full aspect-[4/5] object-cover rounded-[2rem]"
                priority
              />
              {/* Floating testimonial card */}
              <div className="absolute bottom-8 left-6 right-6 glass-panel p-5 rounded-2xl editorial-shadow border border-white/60">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-on-surface font-semibold text-sm leading-snug mb-2">"Alles was wir brauchten, genau dann wenn wir es brauchten."</p>
                <p className="text-on-surface-variant text-xs">— Maria S., Berlin</p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-primary text-on-primary rounded-2xl p-4 shadow-xl shadow-primary/30 text-center min-w-[90px]">
              <p className="text-2xl font-extrabold leading-none">42€</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mt-1">Monatlich</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-on-surface py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8">
          {[
            { icon: "verified_user", label: "TÜV Zertifiziert" },
            { icon: "health_and_safety", label: "Kassen Zugelassen" },
            { icon: "local_shipping", label: "Gratis Versand" },
            { icon: "eco", label: "Nachhaltig" },
            { icon: "lock", label: "DSGVO Konform" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-surface/70 hover:text-surface transition-colors">
              <span className="material-symbols-outlined text-primary/80 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS SECTION ── */}
      <section className="py-32 px-8 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">So einfach geht&apos;s</span>
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight mt-3 mb-4 font-headline">Drei Schritte zur Entlastung</h2>
            <p className="text-on-surface-variant text-lg max-w-xl mx-auto">Wir kümmern uns um die Bürokratie, Sie konzentrieren sich aufs Wesentliche.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: "01", icon: "fact_check", title: "Anspruch prüfen", body: "Geben Sie einfach Ihre Versicherungsdaten ein. Die meisten Nutzer mit Pflegegrad qualifizieren sich für 100% Kostenübernahme." },
              { id: "02", icon: "inventory_2", title: "Box konfigurieren", body: "Wählen Sie die Hilfsmittel aus, die Sie am dringendsten benötigen. Wir bieten Sets oder volle Individualisierung." },
              { id: "03", icon: "local_shipping", title: "Monatliche Lieferung", body: "Ihre Pflegebox kommt jeden Monat direkt vor Ihre Tür. Jederzeit änderbar oder kündbar, komplett ohne Kosten." },
            ].map((step, idx) => (
              <div key={step.id} className="group relative bg-surface-container-lowest rounded-[2rem] p-10 border border-surface-variant/10 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 editorial-shadow">
                <span className="text-[7rem] font-extrabold text-surface-container-highest/50 absolute -top-6 right-6 select-none leading-none group-hover:text-primary/10 transition-colors">{step.id}</span>
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">{step.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{step.body}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-primary/30">
                    <span className="material-symbols-outlined text-4xl">arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURE GRID ── */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-headline">Warum HSP Pflegeshop?</h2>
            <p className="text-on-surface-variant text-lg">Qualität, Transparenz und echte Fürsorge – in jedem Detail.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Big card */}
            <div className="md:col-span-2 md:row-span-2 bg-on-surface text-surface rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold mb-5 font-headline">Klarheit im Design</h3>
                <p className="text-surface/70 text-lg leading-relaxed">Unsere Benutzeroberfläche wurde speziell für einfache Bedienbarkeit entwickelt. Große Texte, klare Symbole und ein linearer Prozess stellen sicher, dass niemand zurückgelassen wird.</p>
              </div>
              <div className="relative z-10 rounded-xl overflow-hidden bg-surface/5 border border-surface/10 p-4 mt-8">
                <Image alt="HSP Logo" src="/logo.jpg" width={400} height={200} className="w-full h-40 object-contain rounded-xl" />
              </div>
            </div>

            {/* Eco card */}
            <div className="md:col-span-2 bg-primary text-on-primary rounded-[2rem] p-10 flex flex-col justify-center shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
              <span className="material-symbols-outlined text-5xl mb-5 opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <h3 className="text-3xl font-bold mb-3 font-headline">Nachhaltige Pflege</h3>
              <p className="opacity-85 leading-relaxed">Alle unsere Hilfsmittel werden ethisch bezogen und wir setzen konsequent auf Plastikreduzierung in den Verpackungen.</p>
            </div>

            {/* Budget card */}
            <div className="md:col-span-1 bg-primary/10 border-2 border-primary/20 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-primary mb-2 font-headline">42€</span>
              <p className="text-primary font-bold text-sm uppercase tracking-widest">Monatlich</p>
              <p className="text-on-surface-variant text-sm mt-2">von der Kasse übernommen</p>
            </div>

            {/* DSGVO card */}
            <div className="md:col-span-1 bg-surface-container-lowest border border-surface-variant/15 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center editorial-shadow">
              <span className="material-symbols-outlined text-primary text-5xl mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="text-on-surface font-bold">DSGVO Konform</p>
              <p className="text-on-surface-variant text-sm mt-1">Ihre Daten sind sicher</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EINFACH. SICHER. KOSTENLOS. ── */}
      <section className="py-28 px-8 bg-surface-container-lowest relative overflow-hidden border-y border-surface-variant/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-on-surface mb-6 font-headline tracking-tight">
            Einfach. Sicher. Kostenlos.
          </h2>
          <p className="text-on-surface-variant text-xl leading-relaxed mb-16 max-w-2xl mx-auto">
            Wir freuen uns, Ihnen unsere Pflegebox vorzustellen. Sie erhalten hochwertige Pflegehilfsmittel im Wert von bis zu{" "}
            <span className="text-primary font-bold">42 Euro pro Monat</span>.
          </p>

          <div className="grid md:grid-cols-2 gap-5 text-left mb-12">
            {[
              {
                icon: "✨",
                title: "Maßgeschneidert",
                body: "Jeder Mensch hat einzigartige Anforderungen. Deshalb passen wir Ihre Box exakt an Ihre Bedürfnisse an. Ob Alltagshilfe oder spezielle Pflege – wir haben die Lösung.",
              },
              {
                icon: "📦",
                title: "Kostenfreier Versand mit DHL",
                body: "Der Versand erfolgt völlig kostenfrei und diskret. Konzentrieren Sie sich entspannt auf die Auswahl der Produkte, ohne Sorge vor versteckten Kosten.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-panel border border-surface-variant/15 rounded-[1.5rem] p-8 hover:border-primary/20 transition-all editorial-shadow">
                <span className="text-3xl mb-5 block">{item.icon}</span>
                <h3 className="text-on-surface font-bold text-xl mb-3 font-headline">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl px-8 py-6 max-w-3xl mx-auto">
            <p className="text-primary font-bold text-lg leading-relaxed">
              Nutzen Sie noch heute Ihren gesetzlichen Anspruch und erleben Sie, wie einfach erstklassige Unterstützung sein kann.
            </p>
          </div>
        </div>
      </section>

      {/* ── IHRE VORTEILE AUF EINEN BLICK ── */}
      <section className="py-28 px-8 bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-on-surface mb-6 font-headline tracking-tight">
            Ihre Vorteile auf einen <span className="text-primary italic">Blick</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-4 max-w-3xl mx-auto">
            Wir machen es Ihnen leicht, die passenden Pflegehilfsmittel zu finden. Unsere{" "}
            <span className="text-primary font-semibold">persönliche Telefonberatung</span> hilft Ihnen, die richtige Wahl zu treffen. Sie erhalten hochwertige, geprüfte Produkte und einen umfassenden Service, der Ihnen Zeit und Mühe spart.
          </p>
          <p className="text-tertiary font-bold uppercase tracking-widest text-sm mb-12">Was Sie von uns erwarten können:</p>

          <div className="grid md:grid-cols-2 gap-5 text-left">
            {[
              {
                icon: "📞",
                title: "Individuelle Telefonberatung",
                body: "Wir finden gemeinsam die besten Lösungen für Ihre Bedürfnisse. Persönlich, kompetent und verständlich.",
              },
              {
                icon: "🛡️",
                title: "Geprüfte Qualität",
                body: "Verlassen Sie sich auf hochwertige Markenprodukte von HARTMANN, die strengen Qualitätsstandards entsprechen.",
              },
              {
                icon: "💛",
                title: "Rundum-Sorglos-Service",
                body: "Wir kümmern uns um alles – von der Beantragung bei der Kasse bis zur pünktlichen Lieferung an Ihre Haustür.",
              },
              {
                icon: "🕐",
                title: "Zuverlässige Erreichbarkeit",
                body: "Wir sind für Sie da, wann immer Sie uns brauchen. Kurze Wartezeiten und direkte Ansprechpartner.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-surface-container-lowest border border-surface-variant/15 rounded-[1.5rem] p-8 hover:border-primary/30 transition-all group editorial-shadow hover:-translate-y-1">
                <span className="text-3xl mb-5 block">{item.icon}</span>
                <h3 className="text-on-surface font-bold text-xl mb-3 font-headline group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-8 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Jetzt starten
          </span>
          <h2 className="text-4xl lg:text-6xl font-extrabold mb-8 tracking-tight font-headline text-on-surface">
            Bereit für Ihre erste Pflegebox?
          </h2>
          <p className="text-on-surface-variant text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
            Es dauert weniger als 2 Minuten, um Ihren Anspruch zu prüfen. <br className="hidden md:block" />
            Kein Papierkram von Ihrer Seite nötig.
          </p>
          <Link
            href="/beantragen"
            className="inline-flex items-center gap-3 bg-primary text-on-primary px-14 py-6 rounded-[2rem] font-bold text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
            Kostenlosen Antrag starten
          </Link>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-on-surface-variant/60 font-medium">
            {[
              { icon: "verified", label: "TÜV Geprüft" },
              { icon: "security", label: "DSGVO Konform" },
              { icon: "payments", label: "100% Kostenfrei" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
