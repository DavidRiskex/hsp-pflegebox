# HSP Pflegebox Web-App 🏥

Eine hochwertige, benutzerfreundliche Webanwendung zur Beantragung und Verwaltung von zuzahlungsfreien Pflegehilfsmitteln (42 € Budget).

## 🌟 Features

- **Interaktiver Bestell-Assistent**: Editorial Design mit Fokus auf Barrierefreiheit und Premium-Haptik.
- **Echtzeit-Budget-Kalkulator**: Automatische Berechnung des 42,00 € Limits mit visueller Rückmeldung.
- **Dynamische Produktgruppen**: Kategorisierte Auswahl von Handschuhen (Nitril, Latex, Vinyl) bis hin zu Desinfektionsmitteln und Masken.
- **Automatisierte PDF-Generierung**: Erstellt millimetergenaue, offizielle Bestellbögen (PDF) basierend auf den Nutzereingaben.
- **E-Mail-Workflows**: Automatische Versand von Bestätigungen inkl. PDF-Anhang an Kunden und das HSP-Team.

## 🛠 Technologie-Stack

- **Framework**: Next.js 15+ (App Router)
- **Logik**: TypeScript / React
- **Design**: Vanilla CSS Modules (Fokus auf Performance und sauberen Code)
- **PDF-Handling**: `pdf-lib` für präzises Mapping in offizielle Formulare
- **Backend-Dienste**: NodeMailer für sichere E-Mail-Kommunikation

## 🚀 Installation & Entwicklung

1.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```

2.  **Umgebungsvariablen einrichten:**
    Erstelle eine `.env.local` Datei für die SMTP-Konfiguration:
    ```env
    SMTP_HOST=your-smtp-host
    SMTP_PORT=465
    SMTP_USER=your-user
    SMTP_PASS=your-password
    ```

3.  **Entwicklungsserver starten:**
    ```bash
    npm run dev
    ```

## 📄 Lizenz

Proprietäre Software für HSP Pflegeshop. Alle Rechte vorbehalten.
