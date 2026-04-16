import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

async function listFields() {
  try {
    const templatePath = path.join(process.cwd(), "Antrag Pflegebox.pdf");
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log("PDF Fields:");
    fields.forEach(field => {
      const name = field.getName();
      const type = field.constructor.name;
      console.log(`- ${name} (${type})`);
    });
  } catch (e) {
    console.error("Error reading PDF fields:", e);
  }
}

listFields();
