"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SignaturePad from "@/components/SignaturePad";
import { PRODUCTS, TOTAL_BUDGET } from "../../lib/products";

const STEPS = ["Auswahl", "Zusatz", "Check", "Unterschrift"];

export type CartState = Record<string, { quantity: number; size?: string }>;

export default function AendernPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>({});
  const [wantsBedMat, setWantsBedMat] = useState<boolean | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "", dob: "", phone: "", email: "",
  });

  const currentBudget = Object.entries(cart).reduce((sum, [id, item]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

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
      if (newQty < 0) return prev; 
      if (product.maxQuantity && newQty > product.maxQuantity) return prev;
      if (delta > 0 && currentBudget + product.price > TOTAL_BUDGET) return prev;

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
      return { ...prev, [id]: { ...prev[id], size } };
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
        body: JSON.stringify({ form, cart, wantsBedMat, signature }),
      });
    } catch { /* ignored */ }
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="glass-panel rounded-[3rem] p-12 lg:p-20 text-center editorial-shadow border border-white/50 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-8 editorial-shadow">
              <span className="material-symbols-outlined text-primary text-5xl">auto_fix_high</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight font-headline">Änderung erhalten!</h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">
              Vielen Dank, <strong>{form.name}</strong>. Wir haben Ihre neue Zusammenstellung erhalten und passen Ihre Lieferungen zum nächstmöglichen Termin an.
            </p>
            <Link href="/" className="bg-primary text-on-primary px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all inline-block">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const budgetPct = (currentBudget / TOTAL_BUDGET) * 100;

  return (
    <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="text-tertiary font-semibold uppercase tracking-widest text-sm mb-2 block">Bestehende Box ändern</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight font-headline">
            Inhalt anpassen
          </h1>
          <p className="text-on-surface-variant mt-4 text-lg">
            Sie beziehen bereits eine Pflegebox? Hier können Sie Ihre monatlichen Hilfsmittel neu zusammenstellen.
          </p>
        </div>

        <div className="w-full md:w-80 bg-surface-container-low p-6 rounded-xl shadow-sm border border-surface-variant/10">
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="text-on-surface font-semibold">Budgetlimit</span>
            <span className="text-primary font-extrabold">{currentBudget.toFixed(2).replace('.', ',')} € / {TOTAL_BUDGET.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="h-2 w-full care-progress-track rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(budgetPct, 100)}%` }} />
          </div>
        </div>
      </header>

      <div className="bg-surface-container-low/50 rounded-[2.5rem] p-8 lg:p-12 border border-surface-variant/10 editorial-shadow min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(groupedProducts).map(([groupName, items]) => (
              <div key={groupName} className="mb-12">
                <h3 className="text-xs font-bold tracking-widest uppercase text-tertiary mb-6">{groupName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((p) => {
                    const qty = cart[p.id]?.quantity || 0;
                    const isSelected = qty > 0;
                    return (
                      <div key={p.id} className={`glass-card rounded-[2rem] p-1 border-2 transition-all duration-300 ${isSelected ? "border-primary bg-primary/5" : "border-transparent"}`}>
                        <div className="bg-white rounded-[1.8rem] p-6 h-full flex flex-col">
                          <div className="h-32 rounded-2xl overflow-hidden mb-4 relative bg-surface-container-low">
                            {p.img ? <Image src={p.img} alt={p.category} fill className="object-contain p-4" /> : <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>}
                          </div>
                          <h4 className="text-[10px] font-bold text-primary uppercase tracking-tighter mb-1">{p.brandLine}</h4>
                          <h3 className="text-lg font-extrabold text-on-surface mb-4 font-headline leading-tight">{p.category}</h3>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-md font-bold text-primary">{p.price.toFixed(2).replace('.', ',')} €</span>
                            <div className="flex items-center bg-surface-container-low rounded-full p-1">
                              <button onClick={() => handleUpdateQuantity(p.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-primary hover:bg-primary-container disabled:opacity-30" disabled={qty === 0}>
                                <span className="material-symbols-outlined text-xs">remove</span>
                              </button>
                              <span className="px-3 font-bold text-sm text-on-surface">{qty}</span>
                              <button onClick={() => handleUpdateQuantity(p.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-dim">
                                <span className="material-symbols-outlined text-xs">add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="max-w-xl mx-auto w-full py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <span className="material-symbols-outlined text-6xl text-primary mb-6">bed</span>
            <h2 className="text-3xl font-extrabold mb-4 font-headline">Waschbare Bettschutzeinlagen</h2>
            <p className="text-on-surface-variant mb-12">Möchten Sie Ihren Anspruch auf waschbare Einlagen (MoliCare® Bed Mat) ebenfalls prüfen oder anpassen?</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setWantsBedMat(true); next(); }}
                className={`py-5 rounded-2xl font-bold transition-all ${wantsBedMat === true ? "bg-primary text-on-primary" : "bg-white border border-outline-variant/20 hover:border-primary"}`}
              >
                Ja, bitte prüfen
              </button>
              <button 
                onClick={() => { setWantsBedMat(false); next(); }}
                className={`py-5 rounded-2xl font-bold transition-all ${wantsBedMat === false ? "bg-surface-dim text-on-surface" : "bg-white border border-outline-variant/20 hover:border-primary"}`}
              >
                Nein, danke
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bestätigung */}
        {step === 3 && (
          <div className="max-w-xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center uppercase tracking-tight">Bestätigung</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Vollständiger Name</label>
                <input type="text" className="w-full bg-white border-2 border-surface-variant/20 rounded-xl px-4 py-4" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Geburtsdatum</label>
                <input type="date" className="w-full bg-white border-2 border-surface-variant/20 rounded-xl px-4 py-4" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">E-Mail für Bestätigung</label>
                <input type="email" className="w-full bg-white border-2 border-surface-variant/20 rounded-xl px-4 py-4" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <button onClick={next} className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold text-xl shadow-xl mt-8">Weiter zur Unterschrift</button>
            </div>
          </div>
        )}

        {/* Step 4: Unterschrift */}
        {step === 4 && (
          <div className="max-w-xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <h2 className="text-3xl font-extrabold mb-4 font-headline uppercase tracking-tight">Digitale Unterschrift</h2>
            <p className="text-on-surface-variant mb-12">Bitte bestätigen Sie die Änderung mit Ihrer Unterschrift.</p>
            
            {!signature ? (
              <SignaturePad onSave={(s) => { setSignature(s); }} />
            ) : (
              <div className="bg-primary/5 rounded-3xl p-8 border-2 border-primary animate-in zoom-in-95 duration-300">
                <p className="text-primary font-bold mb-4 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Erfolgreich unterschrieben
                </p>
                <div className="relative h-32 w-full mb-6 bg-white rounded-xl flex items-center justify-center">
                   <img src={signature} alt="Gespeicherte Unterschrift" className="max-h-full max-w-full" />
                </div>
                <button 
                  onClick={() => setSignature(null)}
                  className="text-on-surface-variant text-sm font-bold hover:text-primary transition-colors underline mb-8 block mx-auto"
                >
                  Zurücksetzen
                </button>
                <button 
                  onClick={handleSubmit}
                  className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20"
                >
                  Änderung jetzt speichern
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-10 flex justify-between items-center border-t border-surface-variant/10">
          <button onClick={prev} className={`flex items-center gap-2 font-bold text-on-surface-variant ${step === 1 ? "invisible" : ""}`}>
            <span className="material-symbols-outlined">arrow_back</span> Zurück
          </button>
          <div className="flex gap-2">
            {[1,2,3,4].map(s => <div key={s} className={`w-1.5 h-1.5 rounded-full ${step === s ? "w-6 bg-primary" : "bg-surface-variant"}`} />)}
          </div>
          <button onClick={next} className={`flex items-center gap-2 font-bold text-primary ${step >= 3 ? "invisible" : ""}`}>
            Weiter <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </main>
  );
}
