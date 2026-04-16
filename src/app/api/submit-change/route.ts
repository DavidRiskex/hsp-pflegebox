import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PRODUCTS } from "../../../lib/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, cart, wantsBedMat } = body;

    let selectedNamesHtml = "";
    // Generate PDF (wantsBedMat is available, assume hasProvider="no" for box changes)
    let pdfBuffer: Buffer | null = null;
    try {
      const currentBudget = Object.entries(cart).reduce((sum, [id, item]: [string, any]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      const pdfBytes = await generateOrderPdf(form, cart, currentBudget, wantsBedMat, "no");
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (e) {
      console.warn("Could not generate PDF for change request", e);
    }

    const bedMatLine = wantsBedMat
      ? "<li>Waschbare Bettschutzeinlagen (Maximaler Jahresanspruch) – MoliCare® Bed Mat Textile</li>"
      : "";

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1D1D1F;">
        <div style="background: #1B2B3A; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">HSP Pflegebox</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; border: 1px solid rgba(27,43,58,0.1);">
          <p>Sehr geehrte/r ${form.name},</p>
          <p>Ihre Auswahländerung für die kommende Lieferung der Pflegebox ist bei uns eingegangen.</p>
          <p>Wir haben Ihr Kundenprofil entsprechend aktualisiert. Bitte beachten Sie unsere Änderungsfristen (spätestens zwei Wochen vor Quartals- bzw. Monatsbeginn), damit die Änderung direkt für die nächste Lieferung greifen kann.</p>
          <p>Mit freundlichen Grüßen<br><strong>Ihr HSP-Pflegebox-Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid rgba(27,43,58,0.1); margin: 32px 0;" />
          
          <h3 style="color: #1B2B3A;">Ihre neue Produktauswahl:</h3>
          <ul style="line-height: 2; padding-left: 20px;">
            ${selectedNamesHtml}
            ${bedMatLine}
          </ul>
        </div>
      </div>
    `;

    const teamHtml = `
      <h2>Pflegebox-Änderung eingegangen</h2>
      <p><strong>Name:</strong> ${form.name}</p>
      <p><strong>Geburtsdatum:</strong> ${form.dob}</p>
      <p><strong>Telefon:</strong> ${form.phone}</p>
      <p><strong>E-Mail:</strong> ${form.email}</p>
      <hr />
      <h3>Neu ausgewählte Produkte:</h3>
      <ul>${selectedNamesHtml}${bedMatLine}</ul>
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

      await transporter.sendMail({
        from: '"HSP Pflegebox" <kontakt@hsp-pflegeshop.de>',
        to: form.email,
        subject: "Änderung Ihrer Pflegebox – Bestätigung",
        html: customerHtml,
      });

      await transporter.sendMail({
        from: '"HSP Pflegebox Website" <kontakt@hsp-pflegeshop.de>',
        to: "kontakt@hsp-pflegeshop.de",
        subject: `Änderung Pflegebox: ${form.name}`,
        html: teamHtml,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
