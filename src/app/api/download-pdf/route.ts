import { NextResponse } from "next/server";
import { generateOrderPdf } from "../../../lib/pdfGenerator";
import { PRODUCTS } from "../../../lib/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, cart, wantsBedMat } = body;

    // Calculate current budget
    const currentBudget = Object.entries(cart).reduce((sum, [id, item]: [string, any]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // Generate PDF
    const pdfBytes = await generateOrderPdf(form, cart, currentBudget, wantsBedMat, hasProvider || "no");
    const pdfBuffer = Buffer.from(pdfBytes);

    // Return the PDF buffer directly with correct headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Bestellbogen_${(form.name || "Kunde").replace(/\s+/g, '_')}.pdf"`,
      },
    });

  } catch (err) {
    console.error("PDF Download Error:", err);
    return NextResponse.json({ error: "Could not generate PDF" }, { status: 500 });
  }
}
