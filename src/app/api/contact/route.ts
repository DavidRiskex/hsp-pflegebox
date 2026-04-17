import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    const teamHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1D1D1F;">
        <h2 style="color: #1B2B3A;">Neue Kontaktanfrage</h2>
        <p>Es ist eine neue Nachricht über das Website-Kontaktformular eingegangen:</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || "Nicht angegeben"}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Nachricht:</strong></p>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1D1D1F;">
        <h2 style="color: #1B2B3A;">Vielen Dank für Ihre Nachricht</h2>
        <p>Hallo ${name},</p>
        <p>vielen Dank für Ihre Nachricht an den HSP Pflegeshop. Wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Ihre Kopie der Nachricht:</strong></p>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p>Mit freundlichen Grüßen,<br>Ihr HSP Pflegeshop Team</p>
      </div>
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

      // Send to team
      await transporter.sendMail({
        from: `"HSP Website" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Kontaktanfrage von ${name}`,
        html: teamHtml,
      });

      // Send confirmation to customer
      await transporter.sendMail({
        from: `"HSP Pflegeshop" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Bestätigung: Ihre Nachricht an den HSP Pflegeshop",
        html: customerHtml,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
