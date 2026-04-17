import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PRODUCTS } from "../../../lib/products";
import { generateOrderPdf } from "../../../lib/pdfGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, cart, wantsBedMat, signature } = body;

    let selectedNamesHtml = Object.entries(cart as Record<string, { quantity: number; size?: string }>)
      .map(([id, item]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return `<li>${item.quantity}x ${product?.category}${item.size ? ` (Größe ${item.size})` : ""}</li>`;
      })
      .join("");

    // Generate PDF
    let pdfBuffer: Buffer | null = null;
    try {
      const currentBudget = Object.entries(cart).reduce((sum, [id, item]: [string, any]) => {
        const product = PRODUCTS.find((p) => p.id === id);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      const pdfBytes = await generateOrderPdf(form, cart, currentBudget, wantsBedMat, "no", signature);
      pdfBuffer = Buffer.from(pdfBytes);
    } catch (e) {
      console.warn("Could not generate PDF for change request", e);
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
            <p>vielen Dank für die Einreichung der Änderung Ihrer Pflegebox. Wir haben Ihre Anfrage erhalten und werden diese umgehend bearbeiten.</p>
            
            <div class="info-box">
              <p style="margin: 0"><strong class="highlight">Wichtiger Hinweis:</strong> Unsere Pflegeboxen versenden wir standardmäßig quartalsweise. Änderungen müssen spätestens <span class="highlight">zwei Wochen</span> vor Quartals- oder Monatsbeginn (bis zum 14. des Vormonats) eingereicht werden.</p>
            </div>

            <p>Für weitere Fragen oder Wünsche stehen wir Ihnen gerne jederzeit zur Verfügung. Sie erreichen uns per E-Mail unter kontakt@hsp-pflegeshop.de oder telefonisch unter 040 999 99 62 90 (Mo–Fr, 09:00–16:00 Uhr).</p>

            <h3 class="section-title">Ihre neue Produktauswahl:</h3>
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
      <h2>Änderung Pflegebox-Antrag</h2>
      <p><strong>Name:</strong> ${form.firstName} ${form.lastName}</p>
      <p><strong>Geburtsdatum:</strong> ${form.dob}</p>
      <p><strong>Telefon:</strong> ${form.phone}</p>
      <p><strong>E-Mail:</strong> ${form.email}</p>
      <hr />
      <h3>Neu ausgewählte Produkte:</h3>
      <ul>${selectedNamesHtml}${bedMatLine}</ul>
    `;

    if (process.env.SMTP_HOST) {
      const port = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        pool: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
      });

      const adminEmail = process.env.ADMIN_EMAIL || 'hsppflegetest@gmail.com';

      // Send to customer
      try {
        await transporter.sendMail({
          from: `"HSP Pflegebox" <${process.env.SMTP_USER}>`,
          to: form.email,
          subject: "Änderungsbestätigung Ihrer HSP-Pflegebox",
          html: customerHtml,
        });
        console.log(`✅ Änderungsbestätigung an Kunde (${form.email}) gesendet.`);
      } catch (e: any) {
        console.error(`❌ Fehler beim Senden (Kunde-Änderung) an ${form.email}:`, e.message);
      }

      // Send to admin
      try {
        await transporter.sendMail({
          from: `"HSP Pflegebox Website" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `Änderung Pflegebox: ${form.firstName} ${form.lastName}`,
          html: teamHtml,
        });
        console.log(`✅ Änderungs-Benachrichtigung an Admin (${adminEmail}) gesendet.`);
      } catch (e: any) {
        console.error(`❌ Fehler beim Senden (Admin-Änderung) an ${adminEmail}:`, e.message);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
