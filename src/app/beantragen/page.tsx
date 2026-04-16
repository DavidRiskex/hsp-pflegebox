"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./beantragen.module.css";
import { PRODUCTS, TOTAL_BUDGET } from "../../lib/products";

const STEPS = ["Produkte", "Zusatz", "Ihre Daten", "Zusammenfassung", "Lieferung", "Lieferintervall", "Abschluss"];

export type CartState = Record<string, { quantity: number; size?: string }>;

export default function BeantragenPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>({});
  const [wantsBedMat, setWantsBedMat] = useState<boolean | null>(null);
  const [deliveryType, setDeliveryType] = useState("customer");
  const [intervalType, setIntervalType] = useState("quartal");
  const [hasProvider, setHasProvider] = useState("no");
  const [submitted, setSubmitted] = useState(false);

  // Form data
  const [form, setForm] = useState({
    name: "", dob: "", street: "", streetNo: "", zip: "", city: "",
    insurance: "", insuranceType: "gesetzlich", insuranceNo: "",
    phone: "", email: "",
    familyName: "", familyStreet: "", familyStreetNo: "", familyZip: "", familyCity: "",
    oldProvider: "",
  });

  const currentBudget = Object.entries(cart).reduce((sum, [id, item]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  // Group products
  const groupedProducts = PRODUCTS.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {} as Record<string, typeof PRODUCTS>);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    setCart((prev) => {
      const currentQty = prev[id]?.quantity || 0;
      const newQty = currentQty + delta;

      if (newQty < 0) return prev; // Cannot go below zero
      
      // Check maximum limit
      if (product.maxQuantity && newQty > product.maxQuantity) {
        alert(`Die maximale Bestellmenge für dieses Produkt liegt bei ${product.maxQuantity} Stück pro Box.`);
        return prev;
      }

      // Check budget limit
      if (delta > 0 && currentBudget + product.price > TOTAL_BUDGET) {
        alert(`Das gesetzliche Monatsbudget von ${TOTAL_BUDGET.toFixed(2)} € wäre überschritten.`);
        return prev;
      }

      const nextCart = { ...prev };
      if (newQty === 0) {
        delete nextCart[id];
      } else {
        nextCart[id] = {
          quantity: newQty,
          size: nextCart[id]?.size || (product.hasSizes ? "M" : undefined), // Default size if needed
        };
      }
      return nextCart;
    });
  };

  const handleUpdateSize = (id: string, size: string) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], size },
      };
    });
  };

  const next = () => { setStep((s) => Math.min(s + 1, STEPS.length)); window.scrollTo(0, 0); };
  const prev = () => { setStep((s) => Math.max(s - 1, 1)); window.scrollTo(0, 0); };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, cart, wantsBedMat, deliveryType, intervalType, hasProvider }),
      });
    } catch { /* handled gracefully */ }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch("/api/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, cart, wantsBedMat }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Antrag_Pflegebox_${form.name || "Kunde"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF Download fehlgeschlagen", e);
      alert("Das PDF konnte leider nicht generiert werden.");
    }
  };

  const budgetPct = (currentBudget / TOTAL_BUDGET) * 100;

  /* ─── Completed ─── */
  if (submitted) {
    return (
      <main className="container section-spacing">
        <div className={styles.card} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "var(--space-lg)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--space-sm)" }}>✅</div>
          <h2>Antrag erfolgreich eingereicht!</h2>
          <p className="text-secondary" style={{ marginTop: 10, marginBottom: "var(--space-md)" }}>
            Vielen Dank, <strong>{form.name}</strong>. Eine Bestätigungsmail mit dem Antrag wurde an <strong>{form.email}</strong> gesendet.
          </p>
          <button className="btn btn-outline" onClick={handleDownloadPdf} style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "1.2rem" }}>📄</span> Ausgefüllten Bestellbogen als PDF herunterladen
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container section-spacing">
      <div style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
        <h1>Pflegebox beantragen</h1>
        <p className="text-secondary">Schritt {step} von {STEPS.length} – {STEPS[step - 1]}</p>
      </div>

      <div className={styles.stepper}>
        <div className={styles.stepperLine} style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
        {STEPS.map((label, idx) => {
          const n = idx + 1;
          const isActive = step === n;
          const isDone = step > n;
          return (
            <div key={n} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${isActive ? styles.stepActive : ""} ${isDone ? styles.stepDone : ""}`}>
                {isDone ? "✓" : n}
              </div>
              <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ""}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.card}>
        {/* ── STEP 1: Produktauswahl ── */}
        {step === 1 && (
          <div>
            <h2>Stellen Sie Ihre Pflegebox zusammen</h2>
            <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>
              Wählen Sie die gewünschte Stückzahl aus. Das gesetzliche Monatsbudget beträgt <strong>{TOTAL_BUDGET.toFixed(2).replace('.', ',')} €</strong>.
            </p>

            <div className={styles.budgetBar}>
              <div className={styles.budgetLabel}>
                <span>Budget</span>
                <strong style={{ color: budgetPct > 95 ? "#FF3B30" : "var(--clr-primary)" }}>
                  {currentBudget.toFixed(2).replace('.', ',')} / {TOTAL_BUDGET.toFixed(2).replace('.', ',')} €
                </strong>
              </div>
              <div className={styles.budgetTrack}>
                <div className={styles.budgetFill} style={{ width: `${Math.min(budgetPct, 100)}%`, backgroundColor: budgetPct > 95 ? "#FF3B30" : "var(--clr-primary)" }} />
              </div>
            </div>

            <div>
              {Object.entries(groupedProducts).map(([groupName, items]) => (
                <div key={groupName} style={{ marginBottom: "var(--space-md)" }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--clr-text-muted)", marginBottom: 16, borderBottom: "1px solid rgba(28,39,34,0.1)", paddingBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {groupName}
                  </h3>
                  <div className={styles.productList}>
                    {items.map(p => {
                      const qty = cart[p.id]?.quantity || 0;
                      const size = cart[p.id]?.size;
                      const isSelected = qty > 0;

                      return (
                        <div key={p.id} className={`${styles.productCard} ${isSelected ? styles.productSelected : ""}`}>
                          <div className={styles.productHeader}>
                            {p.img && (
                              <div style={{ width: 72, height: 72, flexShrink: 0, position: "relative", borderRadius: 8, overflow: "hidden", backgroundColor: "#fff", marginRight: 16 }}>
                                <Image src={p.img} alt={p.category} fill style={{ objectFit: "contain", padding: 4 }} />
                              </div>
                            )}
                            {!p.img && (
                              <div style={{ width: 72, height: 72, flexShrink: 0, borderRadius: 8, backgroundColor: "#EAE6DF", marginRight: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "1.5rem", opacity: 0.8 }}>📦</span>
                              </div>
                            )}
                            <div className={styles.productText} style={{ flex: 1 }}>
                              <span className={styles.brandLine}>{p.brandLine}</span>
                              <h3 className={styles.productCategory}>{p.category}</h3>
                              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--clr-text-muted)" }}>
                                Inhalt: {p.packSize} • {p.price.toFixed(2).replace('.', ',')} €
                              </p>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className={styles.qtyControls}>
                              <button className={styles.qtyBtn} onClick={() => handleUpdateQuantity(p.id, -1)} aria-label="Weniger" disabled={qty === 0}>−</button>
                              <span className={styles.qtyDisplay}>{qty}</span>
                              <button className={styles.qtyBtn} onClick={() => handleUpdateQuantity(p.id, 1)} aria-label="Mehr">+</button>
                            </div>
                          </div>

                          {isSelected && p.hasSizes && (
                            <div className={styles.productBody}>
                              <div className={styles.allergyBox}>
                                <label>Bitte Größe auswählen:</label>
                                <select className="form-control" value={size || "M"} onChange={(e) => handleUpdateSize(p.id, e.target.value)}>
                                  <option value="S">Größe S</option>
                                  <option value="M">Größe M</option>
                                  <option value="L">Größe L</option>
                                  <option value="XL">Größe XL</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Bettschutzeinlagen ── */}
        {step === 2 && (
          <div>
            <h2>Waschbare Bettschutzeinlagen</h2>
            <div className={styles.infoBox}>
              <p>Du kannst bei uns wiederverwendbare Bettschutzeinlagen kostenfrei mitbestellen. Wir beantragen die maximal mögliche Menge, ohne dass Ihnen gesetzliche Zuzahlungen anfallen.</p>
            </div>
            <div className={styles.productCard} style={{ marginBottom: "var(--space-md)" }}>
              <div className={styles.productText} style={{ padding: "var(--space-md)" }}>
                <span className={styles.brandLine}>MoliCare® Bed Mat Textile – von HARTMANN</span>
                <h3 className={styles.productCategory}>Waschbare Bettschutzeinlagen</h3>
                <p className="text-secondary" style={{ marginTop: 8, marginBottom: 0 }}>Bis zu 100 Mal waschbar. Jahresanspruch variiert je nach Krankenkasse (meist 1 bis 4 Stück).</p>
              </div>
            </div>
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Möchten Sie waschbare Bettschutzeinlagen mitbestellen?</p>
            <div className={styles.yesNoRow}>
              <button className={`btn ${wantsBedMat === true ? "btn-primary" : "btn-outline"}`} onClick={() => { setWantsBedMat(true); next(); }}>Ja, bitte</button>
              <button className={`btn ${wantsBedMat === false ? "btn-secondary" : "btn-outline"}`} style={{ border: "none" }} onClick={() => { setWantsBedMat(false); next(); }}>Nein, danke</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Kundendaten ── */}
        {step === 3 && (
          <div>
            <h2>Ihre Daten</h2>
            <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>Bitte geben Sie die Daten der zu pflegenden Person an.</p>
            <div className={styles.formGrid}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label>Vollständiger Name *</label><input className="form-control" placeholder="Vorname und Nachname" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label>Geburtsdatum *</label><input type="date" className="form-control" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 2 }}><label>Straße *</label><input className="form-control" placeholder="Straßenname" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}><label>Nr. *</label><input className="form-control" placeholder="42a" value={form.streetNo} onChange={e => setForm(f => ({ ...f, streetNo: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}><label>PLZ *</label><input className="form-control" placeholder="12345" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 2 }}><label>Ort *</label><input className="form-control" placeholder="Stadt" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 2 }}><label>Krankenkasse *</label><input className="form-control" placeholder="z.B. AOK, TK, Barmer…" value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Versicherungsart *</label>
                <select className="form-control" value={form.insuranceType} onChange={e => setForm(f => ({ ...f, insuranceType: e.target.value }))}>
                  <option value="gesetzlich">Gesetzlich versichert</option>
                  <option value="privat">Privat versichert</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label>Versichertennummer *</label><input className="form-control" placeholder="Z.B. A123456789" value={form.insuranceNo} onChange={e => setForm(f => ({ ...f, insuranceNo: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}><label>Telefonnummer *</label><input type="tel" className="form-control" placeholder="Für Rückfragen" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}><label>E-Mail-Adresse *</label><input type="email" className="form-control" placeholder="Für die Bestätigung" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Zusammenfassung ── */}
        {step === 4 && (
          <div>
            <h2>Zusammenfassung</h2>
            <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>Bitte überprüfen Sie Ihre Auswahl.</p>
            <div className={styles.summaryBox}>
              <h4>Ausgewählte Produkte</h4>
              <ul className={styles.summaryList}>
                {Object.entries(cart).map(([id, item]) => {
                  const product = PRODUCTS.find((p) => p.id === id);
                  if (!product) return null;
                  const sizeText = item.size ? ` (Gr. ${item.size})` : "";
                  return (
                    <li key={id}>
                      <span className={styles.check}>{item.quantity}×</span> 
                      {product.category}{sizeText} – <em>{product.brandLine.split("–")[0].trim()}</em>
                    </li>
                  );
                })}
                {wantsBedMat && <li><span className={styles.check}>✓</span> Waschbare Bettschutzeinlagen (Max. Anspruch) – <em>MoliCare® Bed Mat Textile</em></li>}
              </ul>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(27,43,58,0.1)", fontWeight: 600 }}>
                Budget-Auslastung: {currentBudget.toFixed(2).replace('.', ',')} € / {TOTAL_BUDGET.toFixed(2).replace('.', ',')} €
              </div>
              <hr className={styles.divider} />
              <h4>Ihre Angaben</h4>
              <p><strong>{form.name}</strong>, {form.dob}</p>
              <p>{form.street} {form.streetNo}, {form.zip} {form.city}</p>
              <p>{form.insurance} ({form.insuranceType === "privat" ? "Privat" : "Gesetzlich"})</p>
            </div>
          </div>
        )}

        {/* ── STEP 5: Lieferadresse ── */}
        {step === 5 && (
          <div>
            <h2>Lieferadresse</h2>
             <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>Wohin soll Ihre Pflegebox geliefert werden? Der Versand erfolgt per <strong>DHL</strong>.</p>
            <div className={styles.yesNoRow} style={{ marginBottom: "var(--space-md)" }}>
              <button className={`btn ${deliveryType === "customer" ? "btn-primary" : "btn-outline"}`} onClick={() => setDeliveryType("customer")}>An meine Adresse</button>
              <button className={`btn ${deliveryType === "family" ? "btn-primary" : "btn-outline"}`} onClick={() => setDeliveryType("family")}>An Familienangehörigen / Pflegeperson</button>
            </div>

            {deliveryType === "family" && (
               <div className={styles.familyForm}>
                <p style={{ fontWeight: 600, marginBottom: 16 }}>Bitte geben Sie die Lieferadresse an:</p>
                <div style={{ display: "flex", gap: 16 }}>
                  <div className="form-group" style={{ flex: 1 }}><label>Vorname und Nachname *</label><input className="form-control" value={form.familyName} onChange={e => setForm(f => ({ ...f, familyName: e.target.value }))} /></div>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div className="form-group" style={{ flex: "1 1 200px" }}><label>Straße *</label><input className="form-control" value={form.familyStreet} onChange={e => setForm(f => ({ ...f, familyStreet: e.target.value }))} /></div>
                  <div className="form-group" style={{ flex: "0 0 100px" }}><label>Hausnr. *</label><input className="form-control" value={form.familyStreetNo} onChange={e => setForm(f => ({ ...f, familyStreetNo: e.target.value }))} /></div>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div className="form-group" style={{ flex: "0 0 100px" }}><label>PLZ *</label><input className="form-control" value={form.familyZip} onChange={e => setForm(f => ({ ...f, familyZip: e.target.value }))} /></div>
                  <div className="form-group" style={{ flex: "1 1 200px" }}><label>Ort *</label><input className="form-control" value={form.familyCity} onChange={e => setForm(f => ({ ...f, familyCity: e.target.value }))} /></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 6: Lieferintervall ── */}
        {step === 6 && (
          <div>
            <h2>Lieferintervall</h2>
            <div className={styles.infoBox}>
              <p>Unsere Pflegeboxen liefern wir standardmäßig <strong>quartalsweise per DHL</strong> aus. Das schont die Umwelt, verhindert Engpässe und erspart Ihnen häufige Paketannahmen. Sie erhalten ein Paket, das den exakten Inhalt für drei Monate abdeckt.</p>
              <p style={{ marginTop: 12 }}>Falls eine monatliche Lieferung für Sie zwingend erforderlich ist, richten wir dies ebenfalls ein.</p>
            </div>
            <div className={styles.yesNoRow}>
              <button className={`btn ${intervalType === "quartal" ? "btn-primary" : "btn-outline"}`} onClick={() => setIntervalType("quartal")}>📦 Quartalsweise (Empfohlen)</button>
              <button className={`btn ${intervalType === "monat" ? "btn-primary" : "btn-outline"}`} onClick={() => setIntervalType("monat")}>📅 Monatlich</button>
            </div>
          </div>
        )}

        {/* ── STEP 7: Altanbieter & Abschluss ── */}
        {step === 7 && (
          <div>
            <h2>Fast geschafft!</h2>
            <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
              <label>Haben Sie bisher Pflegehilfsmittel von einem anderen Anbieter bezogen?</label>
              <select className="form-control" value={hasProvider} onChange={e => setHasProvider(e.target.value)}>
                <option value="no">Nein, das ist mein erster Antrag</option>
                <option value="yes">Ja, ich hatte bereits einen Anbieter</option>
              </select>
            </div>

            {hasProvider === "yes" && (
              <div style={{ marginBottom: "var(--space-md)" }}>
                <div className="form-group">
                  <label>Name des Altanbieters *</label>
                  <input className="form-control" placeholder="z.B. Curabox, Sanicare…" value={form.oldProvider} onChange={e => setForm(f => ({ ...f, oldProvider: e.target.value }))} />
                </div>
                <div className={`${styles.infoBox} ${styles.infoWarning}`}>
                  <strong>⚠️ Wichtiger Hinweis: Kündigung erforderlich</strong>
                  <p style={{ marginTop: 8 }}>Sie müssen Ihren bisherigen Anbieter kündigen, um Doppelversorgungen zu vermeiden. Wir empfehlen zudem, Ihrer Krankenkasse den Wechsel kurz telefonisch mitzuteilen.</p>
                  <a href="/kuendigungsvorlage.pdf" download className="btn btn-sm btn-outline" style={{ marginTop: 12, display: "inline-block" }}>📄 Kündigungsvorlage herunterladen</a>
                </div>
              </div>
            )}

            <button className="btn btn-primary btn-full" style={{ padding: "24px", fontSize: "1.2rem", marginTop: 24 }} onClick={handleSubmit}>
              Kostenfrei Beantragen (0,00 €) →
            </button>
            <p className="text-secondary" style={{ textAlign: "center", marginTop: 12, fontSize: "0.95rem" }}>
              Eine Bestätigungsmail geht nach dem Absenden an {form.email || "Ihre E-Mail-Adresse"}.
            </p>
          </div>
        )}

        {/* ── NAV FOOTER ── */}
        <div className={styles.navFooter}>
          {step > 1 ? (
            <button className="btn btn-outline" style={{ border: "none" }} onClick={prev}>← Zurück</button>
           ) : <div />}

          {step !== 2 && step !== 7 && (
            <button className="btn btn-primary" onClick={next}>Weiter →</button>
          )}
        </div>
      </div>
    </main>
  );
}
