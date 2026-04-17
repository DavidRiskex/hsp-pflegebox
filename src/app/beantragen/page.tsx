"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, TOTAL_BUDGET } from "../../lib/products";
import SignaturePad from "@/components/SignaturePad";

const STEPS = ["Auswahl", "Zusatz", "Daten", "Check", "Versand", "Intervall", "Unterschrift", "Abschluss"];

export type CartState = Record<string, { quantity: number; size?: string }>;

export default function BeantragenPage() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartState>({});
  const [wantsBedMat, setWantsBedMat] = useState<boolean | null>(null);
  const [deliveryType, setDeliveryType] = useState("customer");
  const [intervalType, setIntervalType] = useState("quartal");
  const [hasProvider, setHasProvider] = useState("no");
  const [signature, setSignature] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form data
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", street: "", streetNo: "", zip: "", city: "",
    insurance: "", insuranceType: "gesetzlich", insuranceNo: "",
    phone: "", email: "",
    familyName: "", familyStreet: "", familyStreetNo: "", familyZip: "", familyCity: "",
    oldProvider: "",
    oldProviderStreet: "",
    oldProviderZipCity: "",
    oldContractEnd: "",
    newContractStart: "",
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

      if (newQty < 0) return prev;
      
      if (product.maxQuantity && newQty > product.maxQuantity) {
        return prev;
      }

      if (delta > 0 && currentBudget + product.price > TOTAL_BUDGET) {
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

  // Validate current step before advancing
  const validateStep = (): boolean => {
    setValidationError(null);
    const errors: Record<string, string> = {};
    
    if (step === 1 && Object.keys(cart).length === 0) {
      setValidationError("Bitte wählen Sie mindestens ein Produkt aus.");
      return false;
    }

    if (step === 3) {
      if (!form.firstName.trim()) errors.firstName = "Bitte Vorname eingeben";
      if (!form.lastName.trim()) errors.lastName = "Bitte Nachname eingeben";
      if (!form.dob) errors.dob = "Geburtsdatum fehlt";
      if (!form.street.trim()) errors.street = "Straße fehlt";
      if (!form.streetNo.trim()) errors.streetNo = "Nr.";
      if (!form.zip.trim()) errors.zip = "PLZ fehlt";
      if (!form.city.trim()) errors.city = "Ort fehlt";
      if (!form.phone.trim()) errors.phone = "Telefonnummer fehlt";
      if (form.email && !form.email.includes("@")) errors.email = "Ungültige E-Mail Adresse";
    }

    if (step === 4) {
      if (!form.insurance.trim()) errors.insurance = "Bitte Krankenkasse angeben";
      if (!form.insuranceNo.trim()) errors.insuranceNo = "Versichertennummer fehlt";
    }

    if (step === 5 && deliveryType === "family") {
      if (!form.familyName.trim()) errors.familyName = "Empfänger fehlt";
      if (!form.familyStreet.trim()) errors.familyStreet = "Straße fehlt";
      if (!form.familyStreetNo.trim()) errors.familyStreetNo = "Nr.";
      if (!form.familyZip.trim()) errors.familyZip = "PLZ fehlt";
      if (!form.familyCity.trim()) errors.familyCity = "Ort fehlt";
    }

    if (step === 7) {
      if (!signature) errors.signature = "Bitte unterschreiben Sie im Feld";
    }

    if (step === 8 && hasProvider === "yes") {
      if (!form.oldProvider.trim()) errors.oldProvider = "Name fehlt";
      if (!form.oldProviderStreet.trim()) errors.oldProviderStreet = "Straße/Nr. fehlt";
      if (!form.oldProviderZipCity.trim()) errors.oldProviderZipCity = "PLZ/Ort fehlt";
      if (!form.oldContractEnd) errors.oldContractEnd = "Datum fehlt";
      if (!form.newContractStart) errors.newContractStart = "Datum fehlt";
    }

    setFieldErrors(errors);
    
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      // For signature, we scroll to a container
      scrollToError(firstErrorField === "signature" ? "signatureContainer" : firstErrorField);
      return false;
    }

    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
    window.scrollTo(0, 0);
  };
  const prev = () => { setValidationError(null); setStep((s) => Math.max(s - 1, 1)); window.scrollTo(0, 0); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, cart, wantsBedMat, deliveryType, intervalType, hasProvider, signature }),
      });
      setSubmitted(true);
    } catch { /* ignored */ }
    finally { setIsSubmitting(false); }
  };

  const budgetPct = (currentBudget / TOTAL_BUDGET) * 100;
  const isBudgetExceeded = currentBudget > TOTAL_BUDGET;

  if (submitted) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="glass-panel rounded-[3rem] p-12 lg:p-20 text-center editorial-shadow border border-white/50 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-8 editorial-shadow">
              <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight font-headline text-on-surface">Antrag eingereicht!</h2>
            <p className="text-on-surface-variant text-xl mb-12 max-w-2xl mx-auto">
              Vielen Dank, <strong>{form.firstName} {form.lastName}</strong>. Wir haben Ihre Daten erhalten und kümmern uns nun um die Beantragung bei der Pflegekasse. Wir haben Ihnen eine Bestätigung per E-Mail gesendet.
            </p>
            <Link 
              href="/"
              className="bg-primary text-on-primary px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all inline-block"
            >
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header & Budget Indicator */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="text-tertiary font-semibold uppercase tracking-widest text-sm mb-2 block">Premium Pflegebox</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
            Pflegebox konfigurieren
          </h1>
          <p className="text-on-surface-variant mt-4 text-lg">
            Wählen Sie hochwertige Hilfsmittel aus – gedeckt durch Ihr monatliches Budget von <strong>{TOTAL_BUDGET.toFixed(2).replace('.', ',')} €</strong>.
          </p>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full md:w-80 bg-surface-container-low p-6 rounded-xl shadow-sm border border-surface-variant/10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-on-surface font-semibold">Monatsbudget</span>
            <span className="text-primary font-extrabold">{currentBudget.toFixed(2).replace('.', ',')} € / {TOTAL_BUDGET.toFixed(2).replace('.', ',')} €</span>
          </div>
          <div className="h-3 w-full care-progress-track rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(budgetPct, 100)}%` }}
            ></div>
          </div>
          <div className="mt-3 flex items-center text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm mr-1">info</span>
            {(TOTAL_BUDGET - currentBudget).toFixed(2).replace('.', ',')} € Restbudget verfügbar
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="mb-16 max-w-4xl mx-auto px-4">
        <div className="relative flex justify-between items-center">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-variant/30 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((label, idx) => {
            const n = idx + 1;
            const isActive = step === n;
            const isDone = step > n;
            return (
              <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 border-2
                  ${isDone ? "bg-primary border-primary text-on-primary" : 
                    isActive ? "bg-white border-primary text-primary shadow-lg shadow-primary/20" : 
                    "bg-white border-surface-variant text-on-surface-variant"}`}
                >
                  {isDone ? <span className="material-symbols-outlined text-sm">check</span> : n}
                </div>
                <span className={`hidden sm:block text-[8px] md:text-[10px] uppercase tracking-wider font-bold transition-colors ${isActive ? "text-primary" : "text-on-surface-variant/60"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-low/50 rounded-[2.5rem] p-8 lg:p-12 border border-surface-variant/10 editorial-shadow min-h-[500px] flex flex-col">
        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-error font-medium">{validationError}</p>
          </div>
        )}

        {/* Step 1: Produktwahl */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {Object.entries(groupedProducts).map(([groupName, items]) => (
                <div key={groupName} className="md:col-span-12">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-tertiary mb-6 mt-4">{groupName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((p) => {
                      const qty = cart[p.id]?.quantity || 0;
                      const isSelected = qty > 0;
                      return (
                        <div key={p.id} className={`glass-card rounded-[2rem] p-1 border-2 transition-all duration-300 ${isSelected ? "border-primary bg-primary/5" : "border-transparent"}`}>
                          <div className="bg-surface-container-lowest rounded-[1.8rem] p-6 h-full flex flex-col">
                            <div className="h-40 rounded-2xl overflow-hidden mb-6 relative bg-surface-container-low">
                              {p.img ? (
                                <Image src={p.img} alt={p.category} fill className="object-contain p-4" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-primary uppercase tracking-tighter mb-1">{p.brandLine}</h4>
                            <h3 className="text-xl font-extrabold text-on-surface mb-2 font-headline">{p.category}</h3>
                            <p className="text-on-surface-variant text-sm mb-6 flex-grow">{p.packSize}</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-lg font-bold text-primary">{p.price.toFixed(2).replace('.', ',')} €</span>
                              <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/10">
                                <button 
                                  onClick={() => handleUpdateQuantity(p.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-lowest text-primary hover:bg-primary-container transition-colors disabled:opacity-30"
                                  disabled={qty === 0}
                                >
                                  <span className="material-symbols-outlined text-sm">remove</span>
                                </button>
                                <span className="px-3 font-bold text-on-surface">{qty}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(p.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-dim transition-colors shadow-sm"
                                >
                                  <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                              </div>
                            </div>

                            {isSelected && p.hasSizes && (
                              <div className="mt-4 pt-4 border-t border-surface-variant/10">
                                <label className="text-[10px] font-bold uppercase text-on-surface-variant mb-2 block">Größe</label>
                                <div className="flex gap-2">
                                  {["S", "M", "L", "XL"].map(s => (
                                    <button
                                      key={s}
                                      onClick={() => handleUpdateSize(p.id, s)}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${cart[p.id]?.size === s ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Zusatz/Bettschutzeinlagen */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-4 font-headline text-center">Zusatzanspruch</h2>
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-12">
              <p className="text-on-surface italic text-lg leading-relaxed">
                "Wussten Sie schon? Sie können bei uns zusätzlich waschbare Bettschutzeinlagen kostenfrei mitbestellen. Wir übernehmen die Beantragung für Sie."
              </p>
            </div>
            
            <div className="glass-card rounded-[2.5rem] p-1 bg-surface-container-low mb-12">
              <div className="bg-surface-container-lowest rounded-[2.3rem] p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-surface-container-low rounded-2xl overflow-hidden relative">
                  <Image src="/products/molicare-textile.png" alt="MoliCare Bed Mat Textile" fill className="object-contain p-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">HARTMANN PREMIUM</h4>
                  <h3 className="text-2xl font-extrabold mb-4 font-headline">Waschbare Bettschutzeinlagen</h3>
                  <p className="text-on-surface-variant mb-6 text-sm">MoliCare® Bed Mat Textile – bis zu 100 Mal waschbar. Wir beantragen automatisch die höchstmögliche Menge für Sie.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => { setWantsBedMat(true); next(); }}
                className={`py-6 rounded-2xl font-bold text-lg transition-all ${wantsBedMat === true ? "bg-primary text-on-primary shadow-xl scale-105" : "bg-surface-container-lowest border border-outline-variant/20 hover:border-primary"}`}
              >
                Ja, bitte mitbestellen
              </button>
              <button 
                onClick={() => { setWantsBedMat(false); next(); }}
                className={`py-6 rounded-2xl font-bold text-lg transition-all ${wantsBedMat === false ? "bg-surface-dim text-on-surface shadow-xl scale-105" : "bg-surface-container-lowest border border-outline-variant/20 hover:border-primary"}`}
              >
                Nein, danke
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Daten */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center">Persönliche Angaben</h2>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Vorname</label>
                  <input 
                    id="firstName"
                    type="text" 
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.firstName ? 'border-red-500' : 'border-surface-variant/20'}`}
                    placeholder="Max"
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
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.lastName ? 'border-red-500' : 'border-surface-variant/20'}`}
                    placeholder="Mustermann"
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
                  className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.dob ? 'border-red-500' : 'border-surface-variant/20'}`}
                  value={form.dob}
                  onChange={e => {
                    setForm(f => ({ ...f, dob: e.target.value }));
                    if (fieldErrors.dob) setFieldErrors(prev => ({ ...prev, dob: "" }));
                  }}
                />
                {fieldErrors.dob && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.dob}</p>}
              </div>

              <div className="flex flex-row gap-3">
                <div className="flex-[3]">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Straße</label>
                  <input 
                    id="street"
                    type="text" 
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.street ? 'border-red-500' : 'border-surface-variant/20'}`}
                    value={form.street}
                    onChange={e => {
                      setForm(f => ({ ...f, street: e.target.value }));
                      if (fieldErrors.street) setFieldErrors(prev => ({ ...prev, street: "" }));
                    }}
                  />
                  {fieldErrors.street && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.street}</p>}
                </div>
                <div className="flex-[1]">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Nr.</label>
                  <input 
                    id="streetNo"
                    type="text" 
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.streetNo ? 'border-red-500' : 'border-surface-variant/20'}`}
                    value={form.streetNo}
                    onChange={e => {
                      setForm(f => ({ ...f, streetNo: e.target.value }));
                      if (fieldErrors.streetNo) setFieldErrors(prev => ({ ...prev, streetNo: "" }));
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-3">
                <div className="w-1/3 sm:flex-[1]">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">PLZ</label>
                  <input 
                    id="zip"
                    type="text" 
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.zip ? 'border-red-500' : 'border-surface-variant/20'}`}
                    value={form.zip}
                    onChange={e => {
                      setForm(f => ({ ...f, zip: e.target.value }));
                      if (fieldErrors.zip) setFieldErrors(prev => ({ ...prev, zip: "" }));
                    }}
                  />
                  {fieldErrors.zip && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.zip}</p>}
                </div>
                <div className="w-2/3 sm:flex-[3]">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Ort</label>
                  <input 
                    id="city"
                    type="text" 
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.city ? 'border-red-500' : 'border-surface-variant/20'}`}
                    value={form.city}
                    onChange={e => {
                      setForm(f => ({ ...f, city: e.target.value }));
                      if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: "" }));
                    }}
                  />
                  {fieldErrors.city && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.city}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Telefonnummer</label>
                  <input 
                    id="phone"
                    type="tel" 
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.phone ? 'border-red-500' : 'border-surface-variant/20'}`}
                    placeholder="Für Rückfragen"
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
                    className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.email ? 'border-red-500' : 'border-surface-variant/20'}`}
                    placeholder="Bestätigungsmail"
                    value={form.email}
                    onChange={e => {
                      setForm(f => ({ ...f, email: e.target.value }));
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
                    }}
                  />
                  {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.email}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Krankenkasse */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center">Krankenkasse</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Name der Krankenkasse</label>
                <input 
                  id="insurance"
                  type="text" 
                  className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.insurance ? 'border-red-500' : 'border-surface-variant/20'}`}
                  placeholder="z.B. AOK, Barmer, TK..."
                  value={form.insurance}
                  onChange={e => {
                    setForm(f => ({ ...f, insurance: e.target.value }));
                    if (fieldErrors.insurance) setFieldErrors(prev => ({ ...prev, insurance: "" }));
                  }}
                />
                {fieldErrors.insurance && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.insurance}</p>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Versicherungsart</label>
                <div className="flex gap-4">
                  {["gesetzlich", "privat"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setForm(f => ({ ...f, insuranceType: opt }))}
                      className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 ${form.insuranceType === opt ? "bg-primary text-on-primary border-primary" : "bg-white border-surface-variant/20 text-on-surface-variant"}`}
                    >
                      {opt === "gesetzlich" ? "Gesetzlich" : "Privat"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Versichertennummer</label>
                <input 
                  id="insuranceNo"
                  type="text" 
                  className={`w-full bg-surface-container-lowest border-2 rounded-xl px-4 py-4 focus:border-primary focus:ring-0 transition-all font-medium ${fieldErrors.insuranceNo ? 'border-red-500' : 'border-surface-variant/20'}`}
                  placeholder="Z.B. A123456789"
                  value={form.insuranceNo}
                  onChange={e => {
                    setForm(f => ({ ...f, insuranceNo: e.target.value }));
                    if (fieldErrors.insuranceNo) setFieldErrors(prev => ({ ...prev, insuranceNo: "" }));
                  }}
                />
                {fieldErrors.insuranceNo && <p className="text-red-500 text-[10px] mt-1 font-bold">{fieldErrors.insuranceNo}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Versand */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center">Versandoptionen</h2>
            <p className="text-on-surface-variant text-center mb-8">Wohin soll die Pflegebox geliefert werden?</p>
            
            <div className="space-y-4 mb-12">
              <button 
                onClick={() => setDeliveryType("customer")}
                className={`w-full py-5 rounded-2xl flex items-center justify-between px-8 border-2 transition-all ${deliveryType === "customer" ? "bg-primary/5 border-primary" : "bg-white border-surface-variant/20 opacity-60"}`}
              >
                <div className="text-left">
                  <span className="font-bold block">Kundenadresse</span>
                  <span className="text-sm opacity-70 italic text-on-surface-variant">Wie in Schritt 3 angegeben</span>
                </div>
                <span className={`material-symbols-outlined ${deliveryType === "customer" ? "text-primary transition-all" : "text-surface-variant opacity-20"}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </button>

              <button 
                onClick={() => setDeliveryType("family")}
                className={`w-full py-5 rounded-2xl flex items-center justify-between px-8 border-2 transition-all ${deliveryType === "family" ? "bg-primary/5 border-primary" : "bg-white border-surface-variant/20 opacity-60"}`}
              >
                <div className="text-left">
                  <span className="font-bold block">Abweichende Adresse</span>
                  <span className="text-sm opacity-70 italic text-on-surface-variant">Angehörige oder Betreuer</span>
                </div>
                <span className={`material-symbols-outlined ${deliveryType === "family" ? "text-primary transition-all" : "text-surface-variant opacity-20"}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </button>
            </div>

            {deliveryType === "family" && (
              <div className="flex flex-col gap-4 p-8 glass-panel rounded-3xl animate-in zoom-in-95 duration-300 border border-primary/10 bg-white/40 shadow-xl">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block ml-2">Name des Empfängers</label>
                  <input 
                    id="familyName"
                    className={`form-input w-full p-4 rounded-xl border-2 transition-all ${fieldErrors.familyName ? 'border-red-500' : 'border-surface-variant/20'}`} 
                    value={form.familyName} 
                    onChange={e => {
                      setForm(f => ({ ...f, familyName: e.target.value }));
                      if (fieldErrors.familyName) setFieldErrors(prev => ({ ...prev, familyName: "" }));
                    }} 
                  />
                  {fieldErrors.familyName && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.familyName}</p>}
                </div>
                <div className="flex flex-row gap-3">
                  <div className="flex-[3]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block ml-2">Straße</label>
                    <input 
                      id="familyStreet"
                      className={`form-input w-full p-4 rounded-xl border-2 transition-all ${fieldErrors.familyStreet ? 'border-red-500' : 'border-surface-variant/20'}`} 
                      value={form.familyStreet} 
                      onChange={e => {
                        setForm(f => ({ ...f, familyStreet: e.target.value }));
                        if (fieldErrors.familyStreet) setFieldErrors(prev => ({ ...prev, familyStreet: "" }));
                      }} 
                    />
                    {fieldErrors.familyStreet && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.familyStreet}</p>}
                  </div>
                  <div className="flex-[1]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block ml-2">Nr.</label>
                    <input 
                      id="familyStreetNo"
                      className={`form-input w-full p-4 rounded-xl border-2 transition-all ${fieldErrors.familyStreetNo ? 'border-red-500' : 'border-surface-variant/20'}`} 
                      value={form.familyStreetNo} 
                      onChange={e => {
                        setForm(f => ({ ...f, familyStreetNo: e.target.value }));
                        if (fieldErrors.familyStreetNo) setFieldErrors(prev => ({ ...prev, familyStreetNo: "" }));
                      }} 
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-3">
                  <div className="flex-[1]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block ml-2">PLZ</label>
                    <input 
                      id="familyZip"
                      className={`form-input w-full p-4 rounded-xl border-2 transition-all ${fieldErrors.familyZip ? 'border-red-500' : 'border-surface-variant/20'}`} 
                      value={form.familyZip} 
                      onChange={e => {
                        setForm(f => ({ ...f, familyZip: e.target.value }));
                        if (fieldErrors.familyZip) setFieldErrors(prev => ({ ...prev, familyZip: "" }));
                      }} 
                    />
                    {fieldErrors.familyZip && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.familyZip}</p>}
                  </div>
                  <div className="flex-[3]">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block ml-2">Ort</label>
                    <input 
                      id="familyCity"
                      className={`form-input w-full p-4 rounded-xl border-2 transition-all ${fieldErrors.familyCity ? 'border-red-500' : 'border-surface-variant/20'}`} 
                      value={form.familyCity} 
                      onChange={e => {
                        setForm(f => ({ ...f, familyCity: e.target.value }));
                        if (fieldErrors.familyCity) setFieldErrors(prev => ({ ...prev, familyCity: "" }));
                      }} 
                    />
                    {fieldErrors.familyCity && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.familyCity}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Intervall */}
        {step === 6 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center uppercase tracking-tight">Lieferintervall</h2>
            <div className="bg-primary/5 p-8 rounded-3xl mb-12 border border-primary/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                </div>
                <h3 className="text-xl font-bold text-primary">Empfehlung für Sie</h3>
              </div>
              <p className="text-on-surface leading-relaxed italic">
                Wir empfehlen die <strong>quartalsweise Lieferung per DHL</strong>. Dies spart erheblich CO₂, reduziert Verpackungsmüll und sorgt für einen soliden Vorrat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button 
                onClick={() => { setIntervalType("quartal"); next(); }}
                className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center ${intervalType === "quartal" ? "border-primary bg-primary/10 scale-105 shadow-xl" : "border-surface-variant/20 bg-white opacity-60 hover:opacity-100"}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${intervalType === "quartal" ? "bg-primary text-on-primary shadow-lg" : "bg-surface-variant/20 text-surface-variant"}`}>
                  <span className="material-symbols-outlined text-3xl">inventory</span>
                </div>
                <span className="font-extrabold text-xl block mb-2 italic">Quartalsweise</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-primary">Unsere Empfehlung</span>
              </button>

              <button 
                onClick={() => { setIntervalType("monat"); next(); }}
                className={`p-10 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center ${intervalType === "monat" ? "border-primary bg-primary/10 scale-105 shadow-xl" : "border-surface-variant/20 bg-white opacity-60 hover:opacity-100"}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${intervalType === "monat" ? "bg-primary text-on-primary shadow-lg" : "bg-surface-variant/20 text-surface-variant"}`}>
                  <span className="material-symbols-outlined text-3xl">calendar_month</span>
                </div>
                <span className="font-extrabold text-xl block mb-2">Monatlich</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Standard</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Unterschrift */}
        {step === 7 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <h2 className="text-3xl font-extrabold mb-4 font-headline uppercase tracking-tight">Digitale Unterschrift</h2>
            <p className="text-on-surface-variant mb-12">Bitte unterschreiben Sie im Feld unten, um den Antrag abzuschließen.</p>
            
            <div id="signatureContainer" className={`p-1 rounded-[2.5rem] transition-all ${fieldErrors.signature ? 'bg-red-50 border-2 border-red-500' : ''}`}>
              {!signature ? (
                <>
                  <SignaturePad onSave={(s) => { 
                    setSignature(s); 
                    setFieldErrors(prev => ({ ...prev, signature: "" }));
                    next(); 
                  }} />
                  {fieldErrors.signature && <p className="text-red-500 font-bold mt-4">{fieldErrors.signature}</p>}
                </>
              ) : (
              <div className="bg-primary/5 rounded-3xl p-8 border-2 border-primary animate-in zoom-in-95 duration-300">
                <p className="text-primary font-bold mb-4 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Unterschrift erfolgreich erfasst
                </p>
                <div className="relative h-40 w-full mb-6 bg-white rounded-xl flex items-center justify-center">
                   <img src={signature} alt="Gespeicherte Unterschrift" className="max-h-full max-w-full" />
                </div>
                <button 
                  onClick={() => setSignature(null)}
                  className="text-on-surface-variant text-sm font-bold hover:text-primary transition-colors underline"
                >
                  Unterschrift zurücksetzen
                </button>
              </div>
            }
          </div>
        </div>
      )}

        {/* Step 8: Altanbieter & Abschluss */}
        {step === 8 && (
          <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 font-headline text-center">Bisheriger Versorger</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">In der Vergangenheit</label>
                <select 
                  className="w-full bg-surface-container-lowest border-2 border-surface-variant/20 rounded-xl px-4 py-4 focus:border-primary transition-all font-medium appearance-none"
                  value={hasProvider} onChange={e => setHasProvider(e.target.value)}
                >
                  <option value="no">Nein, das ist mein erster Antrag</option>
                  <option value="yes">Ja, ich hatte bereits einen Anbieter</option>
                </select>
              </div>

              {hasProvider === "yes" && (
                <div className="animate-in zoom-in-95 duration-300 space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Name des Altanbieters</label>
                    <input 
                      id="oldProvider"
                      className={`form-input w-full p-4 border-2 rounded-xl transition-all ${fieldErrors.oldProvider ? 'border-red-500' : 'border-surface-variant/20'}`} 
                      placeholder="Name eintragen" 
                      value={form.oldProvider} 
                      onChange={e => {
                        setForm(f => ({ ...f, oldProvider: e.target.value }));
                        if (fieldErrors.oldProvider) setFieldErrors(prev => ({ ...prev, oldProvider: "" }));
                      }} 
                    />
                    {fieldErrors.oldProvider && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.oldProvider}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Straße & Nr. des Altanbieters</label>
                       <input 
                         id="oldProviderStreet"
                         className={`form-input w-full p-4 border-2 rounded-xl transition-all ${fieldErrors.oldProviderStreet ? 'border-red-500' : 'border-surface-variant/20'}`} 
                         placeholder="Musterstraße 123" 
                         value={form.oldProviderStreet} 
                         onChange={e => {
                           setForm(f => ({ ...f, oldProviderStreet: e.target.value }));
                           if (fieldErrors.oldProviderStreet) setFieldErrors(prev => ({ ...prev, oldProviderStreet: "" }));
                         }} 
                       />
                       {fieldErrors.oldProviderStreet && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.oldProviderStreet}</p>}
                    </div>
                    <div>
                       <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">PLZ & Ort des Altanbieters</label>
                       <input 
                         id="oldProviderZipCity"
                         className={`form-input w-full p-4 border-2 rounded-xl transition-all ${fieldErrors.oldProviderZipCity ? 'border-red-500' : 'border-surface-variant/20'}`} 
                         placeholder="12345 Musterstadt" 
                         value={form.oldProviderZipCity} 
                         onChange={e => {
                           setForm(f => ({ ...f, oldProviderZipCity: e.target.value }));
                           if (fieldErrors.oldProviderZipCity) setFieldErrors(prev => ({ ...prev, oldProviderZipCity: "" }));
                         }} 
                       />
                       {fieldErrors.oldProviderZipCity && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.oldProviderZipCity}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                       <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Kündigungsdatum (Altvertrag)</label>
                       <input 
                         id="oldContractEnd"
                         type="date" 
                         className={`form-input w-full p-4 border-2 rounded-xl transition-all ${fieldErrors.oldContractEnd ? 'border-red-500' : 'border-surface-variant/20'}`} 
                         value={form.oldContractEnd} 
                         onChange={e => {
                           setForm(f => ({ ...f, oldContractEnd: e.target.value }));
                           if (fieldErrors.oldContractEnd) setFieldErrors(prev => ({ ...prev, oldContractEnd: "" }));
                         }} 
                       />
                       {fieldErrors.oldContractEnd && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.oldContractEnd}</p>}
                    </div>
                    <div>
                       <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Versorgungsbeginn (Neu)</label>
                       <input 
                         id="newContractStart"
                         type="date" 
                         className={`form-input w-full p-4 border-2 rounded-xl transition-all ${fieldErrors.newContractStart ? 'border-red-500' : 'border-surface-variant/20'}`} 
                         value={form.newContractStart} 
                         onChange={e => {
                           setForm(f => ({ ...f, newContractStart: e.target.value }));
                           if (fieldErrors.newContractStart) setFieldErrors(prev => ({ ...prev, newContractStart: "" }));
                         }} 
                       />
                       {fieldErrors.newContractStart && <p className="text-red-500 text-[10px] mt-1 font-bold ml-2">{fieldErrors.newContractStart}</p>}
                    </div>
                  </div>

                  <div className="bg-error-container/10 border border-error/20 p-6 rounded-2xl flex gap-4 mt-6">
                    <span className="material-symbols-outlined text-error text-3xl">warning</span>
                    <div>
                      <h4 className="font-bold text-error mb-1">Kündigung erforderlich</h4>
                      <p className="text-sm text-on-surface-variant">Sie müssen Ihren alten Anbieter kündigen, um eine Doppelabrechnung zu vermeiden. Gerne schicken wir Ihnen dafür eine Vorlage.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-12">
                {validationError && step === 8 && (
                  <div className="mb-4 p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-error text-sm">error</span>
                    <p className="text-error text-sm font-medium">{validationError}</p>
                  </div>
                )}
                <button 
                  onClick={handleSubmit}
                  disabled={!signature || isSubmitting}
                  className="w-full bg-primary text-on-primary py-6 rounded-3xl font-bold text-xl shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Wird eingereicht...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                      Antrag kostenfrei einreichen
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-4 opacity-60">
                  Mit Klick auf den Button bestätigen Sie die Richtigkeit Ihrer Angaben. Dieser Service ist für Sie kostenfrei.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-auto pt-12 flex justify-between items-center border-t border-surface-variant/10">
          <button 
            onClick={prev}
            className={`flex items-center gap-2 font-bold text-on-surface-variant hover:text-primary transition-colors ${step === 1 ? "invisible" : "visible"}`}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Zurück
          </button>
          
          <div className="flex items-center gap-1 md:gap-2">
            {[1,2,3,4,5,6,7,8].map(s => (
              <div key={s} className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-300 ${step === s ? "w-6 md:w-8 bg-primary" : "bg-surface-variant"}`} />
            ))}
          </div>

          <button 
            onClick={next}
            className={`flex items-center gap-2 font-bold text-primary hover:opacity-80 transition-opacity ${step === 2 || step === 7 || step === 8 ? "invisible" : "visible"}`}
          >
            Weiter
            <span className="material-symbols-outlined">arrow_forward</span>
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
