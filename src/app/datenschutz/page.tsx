"use client";

import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="glass-panel rounded-[2rem] p-8 lg:p-16 border border-white/40 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="relative z-10">
          <Link 
            href="/" 
            className="text-primary font-bold flex items-center gap-2 mb-8 hover:opacity-70 transition-all text-sm uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Zurück zur Startseite
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-12 tracking-tight font-headline">
            Datenschutzerklärung
          </h1>

          <div className="space-y-12 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Verantwortliche Stelle</h2>
              <p className="font-medium text-lg text-on-surface">
                Swetlana Winter<br />
                HSP Hilfe zur Selbstpflege GmbH<br />
                Oldesloer Straße 63<br />
                22457 Hamburg<br />
                <a href="mailto:swetlana.winter@ccd-mail.de" className="text-primary hover:underline">swetlana.winter@ccd-mail.de</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Erfassung allgemeiner Informationen</h2>
              <p>
                Wenn Sie auf unsere Webseite zugreifen, werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten etwa die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres Internet Service Providers und Ähnliches. Hierbei handelt es sich ausschließlich um Informationen, welche keine Rückschlüsse auf Ihre Person zulassen. Diese Informationen sind technisch notwendig, um von Ihnen angeforderte Inhalte von Webseiten korrekt auszuliefern und fallen bei Nutzung des Internets zwingend an. Anonyme Informationen dieser Art werden von uns statistisch ausgewertet, um unseren Internetauftritt und die dahinterstehende Technik zu optimieren.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Kontaktformular</h2>
              <p>
                Treten Sie per E-Mail oder Kontaktformular mit uns in Kontakt, werden die von Ihnen gemachten Angaben zum Zwecke der Bearbeitung der Anfrage sowie für mögliche Anschlussfragen gespeichert.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Löschung bzw. Sperrung der Daten</h2>
              <p>
                Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern Ihre personenbezogenen Daten daher nur so lange, wie dies zur Erreichung der hier genannten Zwecke erforderlich ist oder wie es die vom Gesetzgeber vorgesehenen vielfältigen Speicherfristen vorsehen. Nach Fortfall des jeweiligen Zweckes bzw. Ablauf dieser Fristen werden die entsprechenden Daten routinemäßig und entsprechend den gesetzlichen Vorschriften gesperrt oder gelöscht.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface mb-4">Änderung unserer Datenschutzbestimmungen</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung gelegentlich anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z. B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
            </section>

            <section className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <h2 className="text-xl font-bold text-primary mb-4">Fragen an den Datenschutzbeauftragten</h2>
              <p>
                Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt an unseren Datenschutzbeauftragten:
              </p>
              <p className="mt-4 font-bold text-on-surface">
                Swetlana Winter<br />
                E-Mail: <a href="mailto:swetlana.winter@ccd-mail.de" className="text-primary hover:underline">swetlana.winter@ccd-mail.de</a>
              </p>
            </section>

            <p className="text-xs opacity-50 italic mt-8">
              Die Datenschutzerklärung wurde mit dem Datenschutzerklärungs-Generator der activeMind AG erstellt.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
