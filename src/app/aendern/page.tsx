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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", phone: "", email: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const scrollToError = (fieldId: string) => {
    setTimeout(() => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }, 100);
  };

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

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    if (step === 3) {
      if (!form.firstName.trim()) errors.firstName = "Vorname fehlt";
      if (!form.lastName.trim()) errors.lastName = "Nachname fehlt";
      if (!form.dob) errors.dob = "Geburtsdatum fehlt";
      if (!form.phone.trim()) errors.phone = "Telefonnummer fehlt";
      if (form.email && !form.email.includes("@")) errors.email = "Ungültige E-Mail";
    }

    if (step === 4) {
      if (!signature) errors.signature = "Bitte unterschreiben Sie";
    }

    setFieldErrors(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      scrollToError(firstError === "signature" ? "signatureContainer" : firstError);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    if (step < 4) {
      next();
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/submit-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, cart, wantsBedMat, signature }),
      });
      setSubmitted(true);
    } catch { /* ignored */ }
    finally { setIsSubmitting(false); }
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
              Vielen Dank, <strong>{form.firstName} {form.lastName}</strong>. Wir haben Ihre neue Zusammenstellung erhalten und passen Ihre Lieferungen zum nächstmöglichen Termin an.
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
                            {p.img ? (
                              <Image 
                                src={p.img} 
                                alt={p.category} 
                                fill 
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain p-4" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                            )}
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
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center uppercase tracking-tight text-on-surface">Daten prüfen</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Vorname</label>
                  <input 
                    id="firstName"
                    type="text" 
                    className={`w-full bg-white border-2 rounded-xl px-4 py-4 transition-all ${fieldErrors.firstName ? 'border-red-500' : 'border-surface-variant/20'}`} 
                    value={form.firstName} 
                    onChange={e => {
                      setForm(f => ({ ...f, firstName: e.target.value }));
                      if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: "" }));
                    }} 
                  />
                  {fieldErrors.firstName && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.firstName}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Nachname</label>
                  <input 
                    id="lastName"
                    type="text" 
                    className={`w-full bg-white border-2 rounded-xl px-4 py-4 transition-all ${fieldErrors.lastName ? 'border-red-500' : 'border-surface-variant/20'}`} 
                    value={form.lastName} 
                    onChange={e => {
                      setForm(f => ({ ...f, lastName: e.target.value }));
                      if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: "" }));
                    }} 
                  />
                   {fieldErrors.lastName && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Geburtsdatum</label>
                <input 
                  id="dob"
                  type="date" 
                  className={`w-full bg-white border-2 rounded-xl px-4 py-4 transition-all ${fieldErrors.dob ? 'border-red-500' : 'border-surface-variant/20'}`} 
                  value={form.dob} 
                  onChange={e => {
                    setForm(f => ({ ...f, dob: e.target.value }));
                    if (fieldErrors.dob) setFieldErrors(prev => ({ ...prev, dob: "" }));
                  }} 
                />
                 {fieldErrors.dob && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.dob}</p>}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Telefonnummer</label>
                  <input 
                    id="phone"
                    type="tel" 
                    className={`w-full bg-white border-2 rounded-xl px-4 py-4 transition-all ${fieldErrors.phone ? 'border-red-500' : 'border-surface-variant/20'}`} 
                    value={form.phone} 
                    onChange={e => {
                      setForm(f => ({ ...f, phone: e.target.value }));
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: "" }));
                    }} 
                  />
                  {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.phone}</p>}
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">E-Mail</label>
                  <input 
                    id="email"
                    type="email" 
                    className={`w-full bg-white border-2 rounded-xl px-4 py-4 transition-all ${fieldErrors.email ? 'border-red-500' : 'border-surface-variant/20'}`} 
                    value={form.email} 
                    onChange={e => {
                      setForm(f => ({ ...f, email: e.target.value }));
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
                    }} 
                  />
                   {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.email}</p>}
                </div>
              </div>
              
              <button 
                onClick={handleSubmit} 
                className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold text-xl shadow-xl mt-8 hover:scale-[1.02] transition-transform active:scale-95"
              >
                Bestätigen & zur Unterschrift
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Unterschrift */}
        {step === 4 && (
          <div className="max-w-xl mx-auto w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <h2 className="text-3xl font-extrabold mb-4 font-headline uppercase tracking-tight text-on-surface">Digitale Unterschrift</h2>
            <p className="text-on-surface-variant mb-12">Bitte bestätigen Sie die Änderung mit Ihrer Unterschrift.</p>
            
            <div id="signatureContainer" className={`p-1 rounded-[2.5rem] transition-all ${fieldErrors.signature ? 'bg-red-50 border-2 border-red-500' : ''}`}>
              {!signature ? (
                <>
                  <SignaturePad onSave={(s) => { 
                    setSignature(s); 
                    setFieldErrors(prev => ({ ...prev, signature: "" }));
                  }} />
                  {fieldErrors.signature && <p className="text-red-500 font-bold mt-4">{fieldErrors.signature}</p>}
                </>
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
                    disabled={isSubmitting}
                    className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20"
                  >
                    {isSubmitting ? "Wird gespeichert..." : "Änderung jetzt speichern"}
                  </button>
                </div>
              )}
            </div>
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

      {/* Floating Checkout Summary for Step 1 */}
      {step === 1 && currentBudget > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-on-surface text-surface py-5 px-10 rounded-full shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold opacity-60 tracking-widest leading-none mb-1">Aktuelles Budget</span>
              <span className="text-xl font-extrabold">{currentBudget.toFixed(2).replace('.', ',')} €</span>
            </div>
            <button 
              onClick={next}
              className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold flex items-center gap-2 scale-100 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
            >
              Weiter
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
