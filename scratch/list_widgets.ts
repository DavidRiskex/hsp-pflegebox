import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

async function listAllWidgets() {
  const bytes = await fs.readFile('Antrag Pflegebox.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const pages = pdfDoc.getPages();

  console.log('Detailed Widget List:');
  fields.forEach(field => {
    const name = field.getName();
    const widgets = field.acroField.getWidgets();
    widgets.forEach((widget, index) => {
      const rect = widget.getRectangle();
      let pageIndex = -1;
      for (let i = 0; i < pages.length; i++) {
        const annots = pages[i].node.Annots();
        if (annots) {
          const arr = annots.asArray();
          for (let j = 0; j < arr.length; j++) {
            if (pdfDoc.context.lookup(arr[j]) === widget.dict) {
              pageIndex = i;
              break;
            }
          }
        }
        if (pageIndex !== -1) break;
      }
      console.log(`Field: ${name} [Widget ${index}], Page: ${pageIndex + 1}, Pos: X:${rect.x.toFixed(1)} Y:${rect.y.toFixed(1)}`);
    });
  });
}

listAllWidgets().catch(console.error);
