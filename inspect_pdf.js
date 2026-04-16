const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function inspect() {
  try {
    const existingPdfBytes = fs.readFileSync('Antrag Pflegebox.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    if (fields.length === 0) {
      console.log("NO_FIELDS: PDF does not contain interactive AcroForm fields. We will need to draw coordinates.");
    } else {
      console.log(`Found ${fields.length} form fields:`);
      fields.forEach(field => {
        const type = field.constructor.name;
        const name = field.getName();
        console.log(`- ${name} (${type})`);
      });
    }
  } catch (err) {
    console.error("Error loading PDF:", err);
  }
}

inspect();
