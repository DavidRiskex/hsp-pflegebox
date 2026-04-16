import Image from "next/image";
import Link from "next/link";

const products = [
  {
    group: "Peha-soft® Nitrile Blue / Latex Protect / vinyl – von HARTMANN",
    title: "Untersuchungshandschuhe",
    desc: "In drei Sorten erhältlich: Nitril, Latex und Vinyl – alle puderfrei. Größen S bis XL. Für professionellen Schutz bei der Pflege.",
    img: "/products/peha-soft-nitrile-blue.png",
    imgAlt: "Peha-soft Nitrile Blue Handschuhe",
    secondImg: "/products/peha-soft-latex-protect.png",
    buttons: [],
  },
  {
    group: "Sterillium® pure & Gel pure – von HARTMANN",
    title: "Händedesinfektionsmittel",
    desc: "Als Lösung (500 ml / 100 ml / 1 L) und als Gel pure (100 ml). Viruzid, bakterizid, fungizid. Ohne Parfüm, ohne Farbstoff.",
    img: "/products/sterillium-pure-group.png",
    imgAlt: "Sterillium pure Produktgruppe 500ml, 100ml und 1L",
    buttons: [
      { label: "Produktinformation", href: "/docs/sterillium-pure-info.pdf" },
      { label: "Sicherheitsdatenblatt", href: "/docs/sterillium-pure-sds.pdf" },
      { label: "VAH-Liste", href: "https://www.vah-liste.de/suche/details/730/", external: true },
    ],
  },
  {
    group: "Bacillol® AF – von HARTMANN",
    title: "Flächendesinfektionsmittel",
    desc: "Alkoholische Schnelldesinfektion für Flächen und Einrichtungen. Gebrauchsfertig, nur 500 ml.",
    img: null,
    imgAlt: "",
    imgPlaceholder: "(Bild folgt – Bacillol AF 500ml)",
    buttons: [
      { label: "Produktinformation", href: "/docs/bacillol-af-info.pdf" },
      { label: "Sicherheitsdatenblatt", href: "/docs/bacillol-af-sds.pdf" },
      { label: "VAH-Liste", href: "https://www.vah-liste.de/suche/details/224/", external: true },
    ],
  },
  {
    group: "Sterillium® 2in1 wipes – von HARTMANN",
    title: "Handdesinfektionstücher",
    desc: "Für Hände und kleine Flächen – praktisch für unterwegs und im Pflegealltag.",
    img: null,
    imgAlt: "",
    imgPlaceholder: "(Bild folgt)",
    buttons: [
      { label: "Produktinformation", href: "/docs/sterillium-2in1-info.pdf" },
      { label: "Sicherheitsdatenblatt", href: "/docs/sterillium-2in1-sds.pdf" },
    ],
  },
  {
    group: "Sterillium® home – von HARTMANN",
    title: "Flächendesinfektionstücher",
    desc: "Hochwirksame Flächendesinfektion. 80 Stk., 100 % plastikfrei, VAH-zertifiziert.",
    img: "/products/sterillium-home-tuecher.png",
    imgAlt: "Sterillium home Flächendesinfektionstücher 80 Stk.",
    buttons: [
      { label: "Produktinformation", href: "/docs/sterillium-home-info.pdf" },
      { label: "VAH-Liste", href: "https://www.vah-liste.de/suche/details/1526/", external: true },
    ],
  },
  {
    group: "Bacillol® 30 Sensitive Green Tissues – von HARTMANN",
    title: "Flächendesinfektionstücher",
    desc: "100 % plastikfreie, materialschonende Desinfektionstücher. 24 Stk., niedrigalkohol, schnell wirkend.",
    img: "/products/bacillol-30-tissues.png",
    imgAlt: "Bacillol 30 Sensitive Green Tissues",
    buttons: [
      { label: "Produktinformation", href: "/docs/bacillol-30-info.pdf" },
      { label: "Sicherheitsdatenblatt", href: "/docs/bacillol-30-sds.pdf" },
      { label: "VAH-Liste", href: "https://www.vah-liste.de/suche/details/1440/", external: true },
    ],
  },
  {
    group: "MoliCare® Premium Bed Mat 5 Tropfen – von HARTMANN",
    title: "Einweg-Bettschutzeinlagen",
    desc: "60×90 cm, 25er oder 30er Packung. Saugstark, zuverlässiger Matratzen- und Bettschutz.",
    img: null,
    imgAlt: "",
    imgPlaceholder: "(Bild folgt)",
    buttons: [],
  },
  {
    group: "MoliCare® Bed Mat Textile – von HARTMANN",
    title: "Waschbare Bettschutzeinlagen",
    desc: "Bis zu 100× waschbar, 75×85 cm. Separat beantragbar – Jahresanspruch 1–4 Stk. je nach Krankenkasse.",
    img: "/products/molicare-bed-mat-textile-product.png",
    imgAlt: "MoliCare Bed Mat Textile waschbare Bettschutzeinlage",
    buttons: [],
  },
  {
    group: "Vala®Comfort apron – von HARTMANN",
    title: "Einmal-Schutzschürze",
    desc: "PE-Einmalschutzschürzen, 70×135 cm, 100 Stk. Weiß, hygienisch zuverlässig.",
    img: "/products/vala-comfort-apron.png",
    imgAlt: "Vala Comfort Apron Einmal-Schutzschürze",
    buttons: [],
  },
  {
    group: "Vala®Fit tape – von HARTMANN",
    title: "Einmal-Schutzlätzchen",
    desc: "Weiches Schutzlätzchen mit Klebestreifen, flüssigkeitsdicht. Einfaches An- und Ablegen.",
    img: null,
    imgAlt: "",
    imgPlaceholder: "(Bild folgt)",
    buttons: [],
  },
  {
    group: "Foliodress® Mask Loop FFP2 / Type IIR – von HARTMANN",
    title: "Gesichtsmasken",
    desc: "FFP2-Maske (1 Stk.) für hohen Atemschutz. OP-Maske Typ IIR (10 Stk.) mit Spritzschutz, 3-lagig.",
    img: "/products/foliodress-mask-iir.png",
    imgAlt: "Foliodress Mask Loop Type IIR",
    buttons: [],
  },
];

export default function ProduktePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{ backgroundColor: "var(--clr-surface)", borderBottom: "1px solid var(--clr-secondary)" }}>
        <div className="container" style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)", textAlign: "center" }}>
          <h1>Unsere Produkte</h1>
          <p className="text-secondary" style={{ maxWidth: 660, margin: "0 auto" }}>
            Alle Produkte in der HSP-Pflegebox stammen von{" "}
            <strong style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>HARTMANN</strong> – einem der führenden Hersteller für Medizin- und Pflegeprodukte weltweit.
          </p>
        </div>
      </section>

      <div className="container section-spacing">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-md)" }}>
          {products.map((p, i) => (
            <div key={i} style={{
              backgroundColor: "var(--clr-surface)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-md)",
              boxShadow: "var(--shadow-soft)",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}>

              {/* Image Area - single or dual */}
              <div style={{
                width: "100%",
                height: 220,
                backgroundColor: "var(--clr-surface-light)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "var(--space-sm)",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {p.img ? (
                  p.secondImg ? (
                    /* Dual image for gloves (Nitril + Latex side by side) */
                    <div style={{ display: "flex", width: "100%", height: "100%" }}>
                      <div style={{ flex: 1, position: "relative" }}>
                        <Image src={p.img} alt={p.imgAlt} fill style={{ objectFit: "contain", padding: "12px" }} />
                      </div>
                      <div style={{ flex: 1, position: "relative" }}>
                        <Image src={p.secondImg} alt="Peha-soft Latex Protect" fill style={{ objectFit: "contain", padding: "12px" }} />
                      </div>
                    </div>
                  ) : (
                    <Image src={p.img} alt={p.imgAlt} fill style={{ objectFit: "contain", padding: "16px" }} />
                  )
                ) : (
                  <span style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem", textAlign: "center", padding: 16 }}>
                    {p.imgPlaceholder}
                  </span>
                )}
              </div>

              {/* Brand line in green */}
              <span style={{ color: "#16A34A", fontSize: "0.88rem", fontWeight: 600, display: "block", marginBottom: 6, lineHeight: 1.4 }}>
                {p.group}
              </span>

              {/* Title */}
              <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>{p.title}</h3>
              <p className="text-secondary" style={{ flex: 1, fontSize: "1rem", marginBottom: p.buttons.length > 0 ? "var(--space-sm)" : 0 }}>
                {p.desc}
              </p>

              {/* Action Buttons */}
              {p.buttons.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {p.buttons.map((b, bi) => (
                    <Link
                      key={bi}
                      href={b.href}
                      target={b.external ? "_blank" : undefined}
                      rel={b.external ? "noopener noreferrer" : undefined}
                      style={{
                        display: "inline-block",
                        padding: "9px 14px",
                        borderRadius: 8,
                        border: "1px solid var(--clr-secondary)",
                        color: "var(--clr-text-main)",
                        fontSize: "0.88rem",
                        textDecoration: "none",
                        fontWeight: 500,
                        backgroundColor: "var(--clr-surface-light)",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                      }}
                    >
                      {b.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "var(--space-xl)", padding: "var(--space-lg)", backgroundColor: "var(--clr-surface)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-soft)" }}>
          <h2>Bereit für Ihre persönliche Pflegebox?</h2>
          <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>
            Wählen Sie Ihre Produkte aus und wir beantragen alles kostenfrei für Sie.
          </p>
          <Link href="/beantragen" className="btn btn-primary" style={{ fontSize: "1.15rem", padding: "18px 40px" }}>
            Jetzt beantragen →
          </Link>
        </div>
      </div>
    </main>
  );
}
