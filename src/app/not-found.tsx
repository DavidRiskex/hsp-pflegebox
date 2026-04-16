import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pt-40 pb-20 px-6 max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
      <div className="glass-panel rounded-[2rem] p-12 border border-white/40 shadow-2xl relative overflow-hidden backdrop-blur-xl w-full">
        <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-primary text-5xl">search_off</span>
        </div>
        <h1 className="text-6xl font-extrabold text-primary font-headline mb-4">404</h1>
        <h2 className="text-2xl font-bold text-on-surface mb-4">Seite nicht gefunden</h2>
        <p className="text-on-surface-variant mb-10 text-lg leading-relaxed">
          Die Seite, die Sie suchen, existiert leider nicht oder wurde verschoben. Kein Grund zur Sorge – wir helfen Ihnen weiter.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 justify-center"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Zur Startseite
          </Link>
          <Link
            href="/beantragen"
            className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold text-base hover:bg-primary/5 transition-all flex items-center gap-2 justify-center"
          >
            <span className="material-symbols-outlined text-sm">assignment</span>
            Pflegebox beantragen
          </Link>
        </div>
      </div>
    </main>
  );
}
