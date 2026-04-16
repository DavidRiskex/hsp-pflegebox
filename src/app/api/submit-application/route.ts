import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PRODUCTS, TOTAL_BUDGET } from "../../../lib/products";
import { generateOrderPdf } from "../../../lib/pdfGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, cart, wantsBedMat, deliveryType, intervalType, hasProvider } = body;

    // Calculate current budget
    const currentBudget = Object.entries(cart).reduce((sum, [id, item]: [string, any]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // ── Generate the Output PDF ──
    let pdfBuffer: Buffer | null = null;
    try {
      const pdfBytes = await generateOrderPdf(form, cart, currentBudget, wantsBedMat, hasProvider);
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (err) {
      console.error("Fehler bei der PDF Generierung:", err);
      // We continue to send the email even if PDF generation fails.
    }

    let selectedNamesHtml = "";
    if (cart && typeof cart === "object") {
      selectedNamesHtml = Object.entries(cart).map(([id, item]: [string, any]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        if (!product) return "";
        const sizeText = item.size ? ` (Gr. ${item.size})` : "";
        return `<li>${item.quantity}x ${product.category}${sizeText} – ${product.brandLine}</li>`;
      }).join("");
    }

    const bedMatLine = wantsBedMat
      ? "<li>Waschbare Bettschutzeinlagen (Maximaler Jahresanspruch) – MoliCare® Bed Mat Textile</li>"
      : "";

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1D1D1F;">
        <div style="background: #1C2722; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">HSP Pflegebox</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid rgba(27,43,58,0.1);">
          <p>Sehr geehrte/r ${form.name},</p>
          <p>vielen Dank für Ihre Bestellung! Wir haben Ihre Anfrage erfolgreich erhalten. Im Anhang dieser E-Mail finden Sie Ihren ausgefüllten Bestellbogen zur Ansicht.</p>
          <p>Bitte beachten Sie, dass die Bearbeitungszeit der Krankenkassen in der Regel zwischen 1 und 4 Wochen beträgt. Sobald wir die Genehmigung von Ihrer Krankenkasse erhalten haben, starten wir umgehend mit dem Versand Ihrer Pflegebox.</p>
          <p>Mit freundlichen Grüßen<br><strong>Ihr HSP-Pflegebox-Team</strong></p>
          <hr style="border: none; border-top: 1px solid rgba(27,43,58,0.1); margin: 32px 0;" />
          <h3 style="color: #1C2722;">Ihre ausgewählten Produkte:</h3>
          <ul style="line-height: 2; padding-left: 20px;">
            ${selectedNamesHtml}
            ${bedMatLine}
          </ul>
        </div>
      </div>
    `;

    const teamHtml = `
      <h2>Neuer Pflegebox-Antrag</h2>
      <p><strong>Name:</strong> ${form.name}</p>
      <p><strong>Geburtsdatum:</strong> ${form.dob}</p>
      <p><strong>Adresse:</strong> ${form.street} ${form.streetNo}, ${form.zip} ${form.city}</p>
      <p><strong>Versicherung:</strong> ${form.insurance} (${form.insuranceType}) / <strong>Versichertennummer:</strong> ${form.insuranceNo}</p>
      <p><strong>Telefon:</strong> ${form.phone}</p>
      <p><strong>E-Mail:</strong> ${form.email}</p>
      <hr />
      <p><strong>Lieferintervall:</strong> ${intervalType}</p>
      <p><strong>Lieferadresse:</strong> ${deliveryType === "family" ? `${form.familyName}, ${form.familyStreet} ${form.familyStreetNo}, ${form.familyZip} ${form.familyCity}` : "Kundenadresse"}</p>
      <p><strong>Altanbieter:</strong> ${hasProvider === "yes" ? form.oldProvider : "Kein"}</p>
      <hr />
      <h3>Bestellte Produkte:</h3>
      <ul>${selectedNamesHtml}${bedMatLine}</ul>
      <p><em>(Siehe angehängtes PDF für den ausgefüllten Bestellbogen)</em></p>
    `;

    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const attachments = pdfBuffer ? [{
        filename: `Bestellbogen_${form.name.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }] : [];

      try {
        await transporter.sendMail({
          from: '"HSP Pflegebox" <kontakt@hsp-pflegeshop.de>',
          to: form.email,
          subject: "Ihre Pflegebox-Bestellung – Bestätigung",
          html: customerHtml,
          attachments
        });

        await transporter.sendMail({
          from: '"HSP Pflegebox Website" <kontakt@hsp-pflegeshop.de>',
          to: "kontakt@hsp-pflegeshop.de",
          subject: `Neuer Antrag: ${form.name}`,
          html: teamHtml,
          attachments
        });
      } catch (mailErr) {
        console.error("SMTP Error: Konnte E-Mails nicht senden (falsche Zugangsdaten?). Mache trotzdem weiter.", mailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
