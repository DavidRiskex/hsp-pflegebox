const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const path = require('path');

async function createTestPdf() {
  const templatePath = path.join(process.cwd(), "Antrag Pflegebox.pdf");
  const templateBytes = fs.readFileSync(templatePath);
  
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pdfForm = pdfDoc.getForm();
  const pages = pdfDoc.getPages();

  // Custom Comb drawing helper for ALL instances (pages) of a field
  const drawCombedText = (fieldName, text, numBoxes) => {
    const field = pdfForm.getTextField(fieldName);
    const widgets = field.acroField.getWidgets();
    if (!widgets || widgets.length === 0) return;

    field.setText('');
    if (typeof field.disableCombing === 'function') field.disableCombing();

    const cleanText = text.replace(/[\.\-\/\s]/g, '').substring(0, numBoxes);

    for (let w = 0; w < widgets.length; w++) {
      const widget = widgets[w];
      const rect = widget.getRectangle();
      
      // Find the page for this widget
      let targetPage = null;
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const annots = page.node.Annots();
        if (annots && annots.array) {
          // annots.array contains PDFRefs to the widget dicts
          // We can check if the widget's ref is in this page's annots
          const widgetRefRef = pdfDoc.context.getObjectRef(widget.dict);
          // actually, checking object equality is enough or comparing refs
          for (let j = 0; j < annots.array.length; j++) {
            if (annots.array[j] === widget.dict || annots.array[j] === widgetRefRef) {
              targetPage = page;
              break;
            }
          }
        }
        if (targetPage) break;
      }
      
      // fallback to extracting from widget.dict.get('P')
      if (!targetPage) {
        const pageRef = widget.dict.get('P');
        if (pageRef) {
          const pageNode = pdfDoc.context.lookup(pageRef);
          targetPage = pages.find(p => p.node === pageNode);
        }
      }

      // fallback to page 0 if somehow not found
      if (!targetPage) targetPage = pages[0];

      const boxWidth = rect.width / numBoxes;

      for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        targetPage.drawText(char, {
          x: rect.x + (i * boxWidth) + (boxWidth * 0.25), 
          y: rect.y + (rect.height * 0.25),
          size: 11,
          color: rgb(0, 0, 0),
        });
      }
    }
  };

  drawCombedText("Geburtsdatum", "01.01.1940", 8);
  drawCombedText("Versicherten-Nummer", "K123456789", 10);

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), "TEst_Bestellbogen_Ausgefuellt.pdf");
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Test-PDF wurde gespeichert unter: ${outputPath}`);
}

createTestPdf().catch(console.error);
