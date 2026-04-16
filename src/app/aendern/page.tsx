"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./aendern.module.css";
import { PRODUCTS, TOTAL_BUDGET } from "../../lib/products";

const STEPS = ["Neue Auswahl", "Zusatzanspruch", "Bestätigung"];

export type CartState = Record<string, { quantity: number; size?: string }>;

export default function AendernPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>({});
  const [wantsBedMat, setWantsBedMat] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "", dob: "", phone: "", email: "",
  });

  // Group products
  const groupedProducts = PRODUCTS.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {} as Record<string, typeof PRODUCTS>);

  const currentBudget = Object.entries(cart).reduce((sum, [id, item]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    setCart((prev) => {
      const currentQty = prev[id]?.quantity || 0;
      const newQty = currentQty + delta;

      if (newQty < 0) return prev; 
      
      if (product.maxQuantity && newQty > product.maxQuantity) {
        alert(`Die maximale Bestellmenge für dieses Produkt liegt bei ${product.maxQuantity} Stück pro Box.`);
        return prev;
      }

      if (delta > 0 && currentBudget + product.price > TOTAL_BUDGET) {
        alert(`Das gesetzliche Monatsbudget von ${TOTAL_BUDGET.toFixed(2).replace('.', ',')} € wäre überschritten.`);
        return prev;
      }

      const nextCart = { ...prev };
      if (newQty === 0) {
        delete nextCart[id];
      } else {
        nextCart[id] = {
          quantity: newQty,
          size: nextCart[id]?.size || (product.hasSizes ? "M" : undefined),
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
      await fetch("/api/submit-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, cart, wantsBedMat }),
      });
    } catch { /* handled gracefully */ }
  };

  if (submitted) {
    return (
      <main className="container section-spacing">
        <div className={styles.card} style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "var(--space-lg)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--space-sm)" }}>✅</div>
          <h2>Änderung eingereicht!</h2>
          <p className="text-secondary" style={{ marginTop: 10 }}>Vielen Dank, <strong>{form.name}</strong>. Die Bestätigungsmail wurde an <strong>{form.email}</strong> gesendet.</p>
        </div>
      </main>
    );
  }

  const budgetPct = (currentBudget / TOTAL_BUDGET) * 100;

  return (
    <main className="container section-spacing">
      <div style={{ textAlign: "center", marginBottom: "var(--space-md)" }}>
        <h1>Änderung Ihrer bestehenden Pflegebox</h1>
        <p className="text-secondary">Wenn Sie bereits eine Pflegebox beziehen, können Sie den künftigen Inhalt hier ändern.</p>
        <p className="text-secondary" style={{ marginTop: 8 }}>Schritt {step} von {STEPS.length} – {STEPS[step - 1]}</p>
      </div>

      <div className={styles.stepper}>
        <div className={styles.stepperLine} style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
        {STEPS.map((label, idx) => {
          const n = idx + 1;
          return (
            <div key={n} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${step === n ? styles.stepActive : ""} ${step > n ? styles.stepDone : ""}`}>
                {step > n ? "✓" : n}
              </div>
              <span className={`${styles.stepLabel} ${step === n ? styles.stepLabelActive : ""}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.card}>
        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2>Neuen Inhalt auswählen</h2>
            <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>
              Bitte wählen Sie die gewünschten Mengen für Ihre nächste Lieferung. Budget: <strong>{TOTAL_BUDGET.toFixed(2).replace('.', ',')} €</strong>.
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
                            
                            <div className={styles.qtyControls}>
                              <button className={styles.qtyBtn} onClick={() => handleUpdateQuantity(p.id, -1)} disabled={qty === 0}>−</button>
                              <span className={styles.qtyDisplay}>{qty}</span>
                              <button className={styles.qtyBtn} onClick={() => handleUpdateQuantity(p.id, 1)}>+</button>
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

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2>Waschbare Bettschutzeinlagen</h2>
            <div className={styles.infoBox}>
               <p>Du kannst bei uns wiederverwendbare Bettschutzeinlagen kostenfrei mitbestellen. Wir beantragen die maximal mögliche Menge, ohne dass Ihnen gesetzliche Zuzahlungen anfallen.</p>
            </div>
            <div className={`${styles.productCard}`} style={{ marginBottom: "var(--space-md)" }}>
              <div className={styles.productHeader} style={{ cursor: "default" }}>
                <div style={{ flex: 1 }}>
                  <span className={styles.brandLine}>MoliCare® Bed Mat Textile – von HARTMANN</span>
                  <h3 className={styles.productCategory}>Waschbare Bettschutzeinlagen</h3>
                  <p className="text-secondary" style={{ marginTop: 8, fontSize: "1rem" }}>Bis zu 100 Mal waschbar. Wir prüfen Ihren Anspruch und beantragen automatisch die maximal mögliche Menge.</p>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button className={`btn ${wantsBedMat === true ? "btn-primary" : "btn-outline"}`} onClick={() => { setWantsBedMat(true); next(); }}>Ja, bitte prüfen</button>
              <button className="btn" style={{ border: "none", background: "none", color: "var(--clr-text-muted)" }} onClick={() => { setWantsBedMat(false); next(); }}>Nein, danke</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2>Kurze Bestätigung</h2>
            <p className="text-secondary" style={{ marginBottom: "var(--space-md)" }}>Da Ihre Daten bereits vorliegen, benötigen wir nur noch folgende Angaben zur Zuordnung:</p>
            <div className="form-group"><label>Vollständiger Name *</label><input className="form-control" placeholder="Max Mustermann" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Geburtsdatum *</label><input type="date" className="form-control" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></div>
            <div className="form-group"><label>Telefonnummer *</label><input type="tel" className="form-control" placeholder="Für Rückfragen" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="form-group"><label>E-Mail-Adresse *</label><input type="email" className="form-control" placeholder="Für die Bestätigung" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>

            <div className={styles.infoBox} style={{ marginTop: "var(--space-md)" }}>
              <strong>Wichtiger Hinweis zu Änderungsfristen:</strong>
              <p style={{ marginTop: 8 }}>Unsere Pflegeboxen versenden wir standardmäßig quartalsweise. Bitte reichen Sie Änderungen spätestens zwei Wochen vor Beginn eines neuen Quartals ein (z.B. bis 14. Dezember für das Q1 Januar–März). Bei monatlicher Belieferung bitte bis zum 14. des Vormonats übermitteln.</p>
            </div>

            <button className="btn btn-primary btn-full" style={{ padding: "24px", fontSize: "1.2rem", marginTop: 24 }} onClick={handleSubmit}>
              Änderung einreichen →
            </button>
          </div>
        )}

        {/* Footer */}
        <div className={styles.navFooter}>
          {step > 1 ? (
            <button className="btn btn-outline" style={{ border: "none" }} onClick={prev}>← Zurück</button>
          ) : <div />}
          {step !== 2 && step !== 3 && (
            <button className="btn btn-primary" onClick={next}>Weiter →</button>
          )}
        </div>
      </div>
    </main>
  );
}
