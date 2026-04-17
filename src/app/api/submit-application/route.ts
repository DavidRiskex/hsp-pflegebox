import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PRODUCTS, TOTAL_BUDGET } from "../../../lib/products";
import { generateOrderPdf } from "../../../lib/pdfGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, cart, wantsBedMat, deliveryType, intervalType, hasProvider, signature } = body;

    // Calculate current budget
    const currentBudget = Object.entries(cart).reduce((sum, [id, item]: [string, any]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // ── Generate the Output PDF ──
    let pdfBuffer: Buffer | null = null;
    try {
      const pdfBytes = await generateOrderPdf(form, cart, currentBudget, wantsBedMat, hasProvider, signature, intervalType);
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .email-container { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1D1D1F; line-height: 1.6; }
          .header { background: #0d2d23; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; }
          .logo-text { color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; }
          .content { background: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; }
          .greeting { font-size: 18px; font-weight: 700; margin-bottom: 24px; color: #0d2d23; }
          .section-title { font-size: 16px; font-weight: 700; margin: 24px 0 12px; color: #1b6b54; text-transform: uppercase; letter-spacing: 1px; }
          .info-box { background: #f0f7f4; border-left: 4px solid #1b6b54; padding: 20px; border-radius: 8px; margin: 24px 0; }
          .button { display: inline-block; background: #1b6b54; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 24px 0; }
          .product-item { padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
          .footer { padding: 40px 20px; text-align: center; font-size: 13px; color: #6b7280; }
          .highlight { color: #1b6b54; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="logo-text">HSP <span style="opacity: 0.8">PFLEGESHOP</span></h1>
          </div>
          <div class="content">
            <p class="greeting">Sehr geehrte/r ${form.firstName} ${form.lastName},</p>
            <p>vielen Dank für Ihre Bestellung der Pflegebox auf unserer Website! Wir haben Ihre Anfrage erfolgreich erhalten und möchten uns herzlich für Ihr Vertrauen in uns bedanken.</p>
            
            <div class="info-box">
              <p style="margin: 0">Die Bearbeitungszeit bei den Krankenkassen liegt in der Regel zwischen <strong>1 und 4 Wochen</strong>. Sobald wir die Genehmigung Ihrer Krankenkasse erhalten haben, werden wir den Versand Ihrer Pflegebox umgehend veranlassen.</p>
            </div>

            <p>Sollten Sie zuvor einen anderen Versorger gehabt haben, wäre es sehr hilfreich, wenn Sie Ihre Krankenkasse noch heute anrufen, um diese über den kommenden Wechsel zu informieren. Dies beschleunigt den Vorgang erheblich.</p>
            
            <p>Bitte informieren Sie uns kurz per E-Mail oder Telefon, sobald Sie eine Genehmigung direkt von Ihrer Kasse erhalten haben.</p>

            <h3 class="section-title">Änderungen an Ihrer Pflegebox</h3>
            <p>Sie können Ihre Pflegebox jederzeit flexibel anpassen:</p>
            <a href="https://hsp-pflegebox.vercel.app/aendern" class="button">Produktauswahl ändern</a>
            <p style="font-size: 13px; color: #6b7280;">Alternativ per E-Mail an kontakt@hsp-pflegeshop.de oder telefonisch unter 040 999 99 62 90.</p>

            <h3 class="section-title">Wichtiger Hinweis zum Versand</h3>
            <p>Unsere Pflegeboxen versenden wir standardmäßig <span class="highlight">quartalsweise</span>. Damit Änderungen greifen, müssen diese spätestens zwei Wochen vor Quartalsbeginn (bis zum 14. des Vormonats) bei uns sein.</p>

            <h3 class="section-title">Ihre ausgewählte Box</h3>
            <div style="margin-top: 10px;">
              ${selectedNamesHtml}
              ${bedMatLine ? `<div class="product-item">1x Waschbare Bettschutzeinlagen (MoliCare® Bed Mat)</div>` : ""}
            </div>

            <p style="margin-top: 40px;">Mit freundlichen Grüßen<br><strong>Ihr HSP-Pflegeshop-Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 HSP Pflegeshop | 040 999 99 62 90 | kontakt@hsp-pflegeshop.de</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const teamHtml = `
      <h2>Neuer Pflegebox-Antrag</h2>
      <p><strong>Name:</strong> ${form.firstName} ${form.lastName}</p>
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
      const port = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const attachments = pdfBuffer ? [{
        filename: `Bestellbogen_${fullName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }] : [];

      try {
        console.log("Versuche E-Mails zu senden...");
        // SEND TO CUSTOMER (No PDF)
        await transporter.sendMail({
          from: `"HSP Pflegebox" <${process.env.SMTP_USER}>`,
          to: form.email,
          subject: "Bestellbestätigung Ihrer HSP-Pflegebox",
          html: customerHtml,
        });
        console.log("✅ Bestätigungsmail an Kunde gesendet.");

        // SEND TO ADMIN (With PDF)
        await transporter.sendMail({
          from: `"HSP Pflegebox Website" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: `Neuer Antrag: ${fullName}`,
          html: teamHtml,
          attachments
        });
        console.log("✅ Benachrichtigung an Admin gesendet.");
      } catch (mailErr: any) {
        console.error("❌ SMTP Fehler Details:", mailErr.message);
        console.error("Code:", mailErr.code);
        console.error("Command:", mailErr.command);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
