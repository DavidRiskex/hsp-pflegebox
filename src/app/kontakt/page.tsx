"use client";

import { useState } from "react";
import Link from "next/link";

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="pt-32 pb-24 px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <span className="text-tertiary font-bold tracking-widest uppercase text-sm mb-4 block">KONTAKT</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-8 font-headline">
            Wir sind für Sie <span className="text-primary italic">da.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Haben Sie Fragen zu unseren Pflegeboxen oder benötigen Sie Hilfe bei Ihrem Antrag? 
            Unser Team berät Sie gerne persönlich und unverbindlich.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Form Card */}
          <div className="lg:col-span-8 relative">
            <div className="glass-panel p-10 lg:p-16 rounded-[3rem] editorial-shadow border border-white h-full bg-white/40">
              <h2 className="text-3xl font-bold mb-10 font-headline">Schreiben Sie uns</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface/60 ml-2 uppercase tracking-wide">Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ihr voller Name"
                      className="w-full bg-surface-bright border-surface-variant/20 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface/60 ml-2 uppercase tracking-wide">E-Mail</label>
                    <input 
                      required
                      type="email" 
                      placeholder="ihre@email.de"
                      className="w-full bg-surface-bright border-surface-variant/20 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface/60 ml-2 uppercase tracking-wide">Telefon (optional)</label>
                  <input 
                    type="tel" 
                    placeholder="Für Rückfragen"
                    className="w-full bg-surface-bright border-surface-variant/20 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface/60 ml-2 uppercase tracking-wide">Ihre Nachricht</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Wie können wir Ihnen helfen?"
                    className="w-full bg-surface-bright border-surface-variant/20 rounded-2xl py-5 px-6 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button 
                  disabled={status === "loading"}
                  type="submit"
                  className="w-full bg-primary text-on-primary py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                >
                  {status === "loading" ? "Wird gesendet..." : (
                    <>
                      Nachricht absenden
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
              </form>

              {/* Success/Error Overlays */}
              {status === "success" && (
                <div className="absolute inset-x-4 inset-y-4 glass-panel bg-white/95 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300 z-20">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 font-headline text-on-surface">Nachricht gesendet!</h3>
                  <p className="text-on-surface-variant text-lg max-w-xs mb-8">Vielen Dank für Ihre Anfrage. Wir melden uns in Kürze bei Ihnen.</p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="text-primary font-bold hover:underline"
                  >
                    Weitere Nachricht senden
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards Sidebar */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
            
            {/* Hotline Card */}
            <div className="bg-primary p-10 rounded-[3rem] text-on-primary shadow-xl flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl mb-8 opacity-40">headset_mic</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70">Hotline</h3>
                <p className="text-2xl font-bold font-headline mb-2">040 999 99 62 90</p>
                <p className="text-sm opacity-80 leading-relaxed">Persönlich erreichbar:<br />Mo. - Fr. 09:00 - 17:00 Uhr</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-tertiary-fixed-dim p-10 rounded-[3rem] text-on-tertiary-container editorial-shadow flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl mb-8 text-tertiary opacity-40">mail</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-tertiary">Schreiben Sie uns</h3>
                <p className="text-xl font-bold font-headline mb-4">kontakt@hsp-pflegeshop.de</p>
                <p className="text-sm text-tertiary font-medium">Wir antworten in der Regel innerhalb von 24 Stunden.</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-surface-container-lowest p-10 rounded-[3rem] editorial-shadow border border-surface-variant/10 flex flex-col justify-between">
              <span className="material-symbols-outlined text-5xl mb-8 text-on-surface-variant opacity-20">location_on</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-on-surface-variant">Zentrale</h3>
                <p className="font-bold text-on-surface mb-1">HSP Pflegeshop GmbH</p>
                <p className="text-on-surface-variant leading-relaxed">
                  Oldesloer Straße 63<br />
                  22457 Hamburg
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
