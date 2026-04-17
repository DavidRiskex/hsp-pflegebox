import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const timeSlot = formData.get("timeSlot") as string;
    const file = formData.get("file") as File;

    if (!file || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

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

      const mailOptions = {
        from: `"HSP Pflegeshop Website" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Inkontinenz Rezept-Upload: ${name}`,
        html: `
          <h2>Neuer Inkontinenz-Rezept-Upload</h2>
          <p><strong>Name des Kunden:</strong> ${name}</p>
          <p><strong>Telefonnummer für Beratung:</strong> ${phone}</p>
          <p><strong>Gewünschtes Zeitfenster:</strong> ${timeSlot || "Nicht angegeben"}</p>
          <p>Das hochgeladene Rezept ist dieser E-Mail als Anhang beigefügt.</p>
        `,
        attachments: [
          {
            filename: file.name,
            content: buffer,
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error submitting inkontinenz form:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
