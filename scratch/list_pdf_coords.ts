import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

async function listFieldsWithCoords() {
  const bytes = await fs.readFile('Antrag Pflegebox.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const pages = pdfDoc.getPages();

  console.log('PDF Fields with Coordinates and Page Indices:');
  fields.forEach(field => {
    const type = field.constructor.name;
    const name = field.getName();
    const widgets = field.acroField.getWidgets();
    if (widgets.length > 0) {
      const widget = widgets[0];
      const rect = widget.getRectangle();
      
      // Find page index
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

      console.log(`- ${name} (${type}) on Page:${pageIndex + 1} at X:${rect.x.toFixed(1)}, Y:${rect.y.toFixed(1)}, W:${rect.width.toFixed(1)}, H:${rect.height.toFixed(1)}`);
    } else {
      console.log(`- ${name} (${type}) [No Widgets]`);
    }
  });
}

listFieldsWithCoords().catch(console.error);
