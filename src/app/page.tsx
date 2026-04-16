import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: "var(--clr-bg)", paddingTop: "var(--space-lg)", paddingBottom: "var(--space-md)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ maxWidth: 760, margin: "0 auto 20px auto" }}>
            Kostenlose Pflegebox,<br />jeden Monat.
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--clr-text-muted)", maxWidth: 560, margin: "0 auto 40px auto", lineHeight: 1.65 }}>
            Hochwertige Pflegehilfsmittel von HARTMANN direkt zu Ihnen nach Hause.
            Von der Krankenkasse übernommen – wir erledigen alles für Sie.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <Link href="/beantragen" className="btn btn-primary" style={{ padding: "18px 44px", fontSize: "1.1rem" }}>
              Jetzt beantragen
            </Link>
            <Link href="/produkte" className="btn btn-secondary" style={{ padding: "18px 44px", fontSize: "1.1rem" }}>
              Produkte ansehen
            </Link>
          </div>

          {/* Hero Image */}
          <div style={{
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(27,43,58,0.18)",
            background: "rgba(255,255,255,0.25)",
          }}>
            <Image
              src="/paket.png"
              alt="HSP Pflegebox"
              width={1080}
              height={520}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section style={{ background: "var(--clr-bg)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 48 }}>In drei einfachen Schritten</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { n: "01", title: "Antrag stellen", body: "Wählen Sie Ihre Pflegehilfsmittel aus und füllen Sie das Online-Formular in wenigen Minuten aus." },
              { n: "02", title: "Wir erledigen den Rest", body: "Unser Team stellt den Antrag bei Ihrer Pflegekasse – Sie müssen sich um nichts kümmern." },
              { n: "03", title: "Lieferung nach Hause", body: "Ihre Pflegebox kommt sicher und kostenlos per DHL direkt an Ihre Tür." },
            ].map((s) => (
              <div key={s.n} style={{ background: "var(--clr-surface)", borderRadius: "var(--radius-md)", padding: 40, boxShadow: "var(--shadow-card)" }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", color: "var(--clr-text-muted)", marginBottom: 16, textTransform: "uppercase" }}>{s.n}</span>
                <h3 style={{ marginBottom: 12, fontSize: "1.3rem" }}>{s.title}</h3>
                <p style={{ color: "var(--clr-text-muted)", marginBottom: 0, fontSize: "1rem", lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VORTEILE ─────────────────────────────────────── */}
      <section style={{ background: "rgba(27,43,58,0.05)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2>Warum HSP-Pflegebox?</h2>
            <p style={{ color: "var(--clr-text-muted)", maxWidth: 520, margin: "12px auto 0 auto" }}>
              Qualität, Einfachheit und Verlässlichkeit – für Sie und Ihre Familie.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "📦", title: "Kostenfreie Lieferung", body: "Versicherungsgedeckt – 0 € Eigenanteil für Sie." },
              { icon: "🛡️", title: "HARTMANN-Qualität", body: "Geprüfte Medizinprodukte vom deutschen Marktführer." },
              { icon: "🌿", title: "Nachhaltig", body: "Plastikfreie Tücher, CO₂-sparende Quartalslieferung." },
              { icon: "📄", title: "Kein Papierkram", body: "Wir übernehmen die komplette Abwicklung mit der Kasse." },
            ].map((f) => (
              <div key={f.title} style={{ background: "var(--clr-surface)", borderRadius: "var(--radius-md)", padding: "32px 28px", boxShadow: "var(--shadow-card)" }}>
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{f.icon}</div>
                <h4 style={{ marginBottom: 8, fontSize: "1.1rem" }}>{f.title}</h4>
                <p style={{ color: "var(--clr-text-muted)", marginBottom: 0, fontSize: "0.98rem", lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UMWELT ──────────────────────────────────────── */}
      <section style={{ background: "var(--clr-bg)", paddingTop: 80, paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 780, textAlign: "center" }}>
          <h2 style={{ marginBottom: 20 }}>Auch unsere Umwelt ist pflegebedürftig</h2>
          <p style={{ color: "var(--clr-text-muted)", lineHeight: 1.8, fontSize: "1.1rem", marginBottom: 0 }}>
            Die Umwelt verdient genauso Pflege wie unsere Kunden. Unsere quartalsweise Lieferung reduziert
            die Lieferhäufigkeit und den CO₂-Fußabdruck gezielt. Dazu bieten wir nun 100 % plastikfreie
            Flächendesinfektionstücher – ein weiterer Schritt in Richtung umweltfreundlicherer Lösungen.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────── */}
      <section style={{ background: "var(--clr-primary)", paddingTop: 80, paddingBottom: 80, textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 16 }}>Bereit für Ihre kostenlose Pflegebox?</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 40, fontSize: "1.1rem" }}>
            In wenigen Minuten fertig – wir kümmern uns um den Rest.
          </p>
          <Link href="/beantragen" className="btn btn-white" style={{ fontSize: "1.1rem", padding: "18px 48px" }}>
            Jetzt kostenlos beantragen →
          </Link>
        </div>
      </section>

    </main>
  );
}
