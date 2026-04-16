"use client";

import { useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "MoliCare® Premium Elastic 7 Tropfen",
    brand: "von HARTMANN",
    type: "Inkontinenz-Slips",
    desc: "Inkontinenz-Slip mit elastischen Seitenteilen für schwere Inkontinenz. Maximale Sicherheit und Tragekomfort durch körpernahes Design und weiche Materialien.",
  },
  {
    id: 2,
    name: "MoliCare® Premium Mobile 6 Tropfen",
    brand: "von HARTMANN",
    type: "Pull-Ups",
    desc: "Einweg-Inkontinenzunterwäsche für mittlere bis schwere Inkontinenz. Lässt sich wie normale Unterwäsche an- und ausziehen – ideal für aktive Nutzende.",
  },
  {
    id: 3,
    name: "MoliCare® Premium Form 6 Tropfen",
    brand: "von HARTMANN",
    type: "Anatomische Vorlagen",
    desc: "Anatomisch geformte Inkontinenzvorlage für mittlere Inkontinenz. Wird mit einer Fixierhose kombiniert für optimalen Sitz und Schutz.",
  },
  {
    id: 4,
    name: "MoliCare® Premium Men Pad 3 Tropfen",
    brand: "von HARTMANN",
    type: "Einlagen (Herren)",
    desc: "Speziell für die männliche Anatomie entwickelte Einlage bei leichter Blasenschwäche. Diskret und sicher für den Alltag.",
  },
  {
    id: 5,
    name: "MoliCare® Premium Lady Pad 3 Tropfen",
    brand: "von HARTMANN",
    type: "Einlagen (Damen)",
    desc: "Anatomisch geformte Einlage für Damen bei leichter bis mittlerer Blasenschwäche. Exzellente Rückhaltewirkung und Hautfreundlichkeit.",
  },
];

export default function InkontinenzPage() {
  const [openInfoId, setOpenInfoId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", timeSlot: "" });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    setSubmitted(true);
    // API call would go here (multipart form-data with file + form data)
  };

  if (submitted) {
    return (
      <main className="container section-spacing">
        <div style={{ maxWidth: 700, margin: "0 auto", backgroundColor: "var(--clr-surface)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-hover)", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--space-sm)" }}>✅</div>
          <h2>Vielen Dank!</h2>
          <p className="text-secondary" style={{ marginTop: 10 }}>Ihre Rezept-Übermittlung und Daten sind bei uns eingegangen. Die Fachabteilung meldet sich in Kürze telefonisch bei Ihnen.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container section-spacing">
      <div style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
        <h1>Inkontinenzversorgung</h1>
        <p className="text-secondary" style={{ maxWidth: 680, margin: "0 auto" }}>
          Für ein Leben in Komfort und Sicherheit.
        </p>
      </div>

      {/* Info Block */}
      <div style={{ maxWidth: 800, margin: "0 auto var(--space-lg) auto", backgroundColor: "var(--clr-surface)", borderRadius: "var(--radius-md)", padding: "var(--space-md)", boxShadow: "var(--shadow-soft)" }}>
        <p style={{ lineHeight: 1.8 }}>
          Für ein Leben in Komfort und Sicherheit bieten wir Ihnen eine exklusive Auswahl an Inkontinenzprodukten der renommierten Marke <strong>HARTMANN</strong>. Diese Produkte vereinen höchste Ansprüche an Qualität, Diskretion und Hautverträglichkeit – damit Sie sich in jeder Situation rundum geschützt und wohl fühlen können.
        </p>
        <p style={{ lineHeight: 1.8, marginTop: 16 }}>
          Für die weitere Vorgehensweise benötigen wir Ihr Rezept. Sobald uns das originale Rezept vorliegt, wird sich die Fachabteilung umgehend mit Ihnen in Verbindung setzen, um eine individuelle Beratung durchzuführen und das passende Produkt auszuwählen. Selbstverständlich haben Sie auch die Möglichkeit, vorab Probematerial zu erhalten.
        </p>
        <div style={{ backgroundColor: "var(--clr-surface-light)", borderRadius: "var(--radius-sm)", padding: "16px 24px", marginTop: 20 }}>
          <p style={{ margin: 0 }}>
            Um eventuelle Verzögerungen oder Verluste auf dem Postweg zu vermeiden, bitten wir Sie, uns das Rezept zunächst als <strong>Foto oder Datei</strong> zu übermitteln und das Original im Anschluss postalisch zu senden an:<br />
            <strong>HSP Pflegeshop GmbH, Pyramidenweg 7, 25474 Ellerbek</strong>
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div style={{ maxWidth: 700, margin: "0 auto var(--space-xl) auto", backgroundColor: "var(--clr-surface)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", boxShadow: "var(--shadow-hover)" }}>
        <h2 style={{ marginBottom: "var(--space-md)" }}>Rezept einreichen & Rückruf anfragen</h2>

        {/* File Upload */}
        <div
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{ border: "2px dashed var(--clr-primary)", backgroundColor: file ? "#EEF5FF" : "transparent", borderRadius: "var(--radius-md)", padding: "var(--space-md)", textAlign: "center", cursor: "pointer", marginBottom: "var(--space-md)", transition: "background 0.2s" }}
        >
          <input id="fileInput" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📸</div>
          <p style={{ fontWeight: 600, color: "var(--clr-primary)", marginBottom: 4 }}>
            {file ? `✓ ${file.name}` : "Rezept hochladen"}
          </p>
          <p className="text-secondary" style={{ fontSize: "0.95rem", margin: 0 }}>Als Foto oder PDF (JPEG, PNG, PDF)</p>
        </div>

        <div className="form-group"><label>Vollständiger Name *</label><input className="form-control" placeholder="Vor- und Nachname" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div className="form-group"><label>Telefonnummer *</label><input type="tel" className="form-control" placeholder="Rückrufnummer" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
        <div className="form-group">
          <label>Bevorzugtes Rückruf-Zeitfenster (optional)</label>
          <input className="form-control" placeholder="z.B. Montag–Freitag, 10:00–14:00 Uhr" value={form.timeSlot} onChange={e => setForm(f => ({ ...f, timeSlot: e.target.value }))} />
        </div>

        <button className="btn btn-primary btn-full" style={{ padding: "20px", fontSize: "1.15rem", marginTop: 16 }} onClick={handleSubmit}>
          Jetzt einreichen & Rückruf anfragen
        </button>
      </div>

      {/* Example Products */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>Beliebte Produkte aus unserem Sortiment</h2>
        <p className="text-secondary" style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
          Dies ist nur eine kleine Auswahl – HARTMANN bietet über 100 Inkontinenzprodukte. Im persönlichen Beratungsgespräch finden wir das beste Produkt für Ihre individuelle Situation.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-md)" }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ backgroundColor: "var(--clr-surface)", borderRadius: "var(--radius-md)", padding: "var(--space-md)", boxShadow: "var(--shadow-soft)" }}>
              <div style={{ width: "100%", height: 180, backgroundColor: "var(--clr-surface-light)", borderRadius: "var(--radius-sm)", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--clr-text-muted)", fontSize: "0.9rem" }}>
                (Produktbild)
              </div>
              <span style={{ display: "block", color: "#16A34A", fontSize: "0.95rem", fontWeight: 600, marginBottom: 4 }}>{p.name} – <span style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.85em" }}>{p.brand}</span></span>
              <h4 style={{ marginBottom: 12, fontSize: "1.2rem" }}>{p.type}</h4>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setOpenInfoId(openInfoId === p.id ? null : p.id)}
                style={{ width: "100%" }}
              >
                ℹ️ Produktinfo {openInfoId === p.id ? "▲" : "▼"}
              </button>
              {openInfoId === p.id && (
                <p style={{ marginTop: 12, fontSize: "1rem", lineHeight: 1.6, color: "var(--clr-text-main)" }}>{p.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
