import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { CartState } from "../app/beantragen/page"; // We can redefine type locally to avoid circular

export async function generateOrderPdf(
  form: any, 
  cart: Record<string, { quantity: number; size?: string }>, 
  totalBudget: number,
  wantsBedMat: boolean | null,
  hasProvider: string
): Promise<Uint8Array> {
  // Load the template from the root of the project
  const templatePath = path.join(process.cwd(), "Antrag Pflegebox.pdf");
  const templateBytes = await fs.readFile(templatePath);
  
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pdfForm = pdfDoc.getForm();
  const pages = pdfDoc.getPages();
  const page0 = pages[0];

  // Helper to safely set text fields
  const setTextField = (fieldName: string, value: string) => {
    try {
      const field = pdfForm.getTextField(fieldName);
      field.setMaxLength(200); // Prevent ExceededMaxLengthError if the PDF has a low limit
      if (typeof field.disableCombing === 'function') {
        field.disableCombing(); // Fix garbled clustered text in Comb fields!
      }
      field.setText(value);
    } catch (e) {
      console.warn(`Could not set PDF field: ${fieldName}`);
    }
  };

  // Helper to draw text precisely in comb fields (1 character per box)
  const drawCombedText = (fieldName: string, text: string, numBoxes: number) => {
    try {
      const field = pdfForm.getTextField(fieldName);
      const widgets = field.acroField.getWidgets();
      if (!widgets || widgets.length === 0) return;
      
      const cleanText = text.replace(/[\.\-\/\s]/g, '').substring(0, numBoxes);

      // Clean the field's actual text content
      field.setText('');
      if (typeof field.disableCombing === 'function') field.disableCombing();

      for (let w = 0; w < widgets.length; w++) {
        const widget = widgets[w];
        const rect = widget.getRectangle();
        
        // Find which page this widget belongs to
        let targetPage = null;
        for (const p of pages) {
          const annots = p.node.Annots();
          if (annots) {
            const arr = annots.asArray();
            for (let i = 0; i < arr.length; i++) {
              if (pdfDoc.context.lookup(arr[i]) === widget.dict) {
                targetPage = p;
                break;
              }
            }
          }
          if (targetPage) break;
        }
        
        // Fallback: Check 'P' entry in widget dict
        if (!targetPage) {
          const pageRef = widget.dict.get(pdfDoc.context.obj('P'));
          if (pageRef) {
            const pageNode = pdfDoc.context.lookup(pageRef);
            targetPage = pages.find(p => p.node === pageNode);
          }
        }

        if (!targetPage) continue;

        const boxWidth = rect.width / numBoxes;
        for (let i = 0; i < cleanText.length; i++) {
          const char = cleanText[i];
          targetPage.drawText(char, {
            x: rect.x + (i * boxWidth) + (boxWidth * 0.25), 
            y: rect.y + (rect.height * 0.25),
            size: 11,
          });
        }
      }
    } catch (e) {
      console.warn(`Could not draw combed text for field: ${fieldName}`, e);
    }
  };

  // Helper to safely set checkboxes
  const setCheckBox = (fieldName: string, check: boolean) => {
    try {
      const field = pdfForm.getCheckBox(fieldName);
      if (check) {
        field.check();
      } else {
        field.uncheck();
      }
    } catch (e) {
      console.warn(`Could not set PDF checkbox: ${fieldName}`);
    }
  };

  // ── 1. Map Form Data ──
  const fullName = form.name || "";
  const address1 = `${form.street || ""} ${form.streetNo || ""}`;
  const zipCity = `${form.zip || ""} ${form.city || ""}`;
  
  setTextField("Name Kunde", fullName);
  drawCombedText("Geburtsdatum", form.dob || "", 8); // Precise comb drawing
  setTextField("Strasse", address1);
  setTextField("PLZ_Ort", zipCity);
  setTextField("Adresse", `${address1}, ${zipCity}`); 
  setTextField("Telefon", form.phone || "");
  setTextField("pflegekasse", form.insurance || "");
  drawCombedText("Versicherten-Nummer", form.insuranceNo || "", 10); // Precise comb drawing

  // If there's an old provider (we must only fill this if the user actually clicked "YES, I change provider")
  if (form.oldProvider && hasProvider === "yes") {
    setTextField("Bisheriger Versorger", form.oldProvider);
    setTextField("Bisheriger Vorsorger", form.oldProvider);
  }

  // ── 2. Bed Mat ──
  if (wantsBedMat) {
    setCheckBox("Bettschutz wiederverwendbar", true);
  }

  // ── 3. Map Products ──
  // Calculate specific mapping from cart to PDF field names
  
  Object.entries(cart).forEach(([id, item]) => {
    if (item.quantity <= 0) return;
    const qtyStr = item.quantity.toString();

    switch (id) {
      case "gloves-nitril":
        setTextField(`Nitril ${item.size || "M"}`, qtyStr);
        break;
      case "gloves-latex":
        setTextField(`Latex ${item.size || "M"}`, qtyStr);
        break;
      case "gloves-vinyl":
        setTextField(`Vinyl ${item.size || "M"}`, qtyStr);
        break;
      case "bibs":
        setTextField("schutz_binden", qtyStr);
        break;
      case "apron":
        setTextField("Schuerzen", qtyStr);
        break;
      case "sterillium-2in1":
        setTextField("Desinfektionstuecher", qtyStr);
        break;
      case "bacillol-24":
        setTextField("Flaeche 24", qtyStr);
        break;
      case "bacillol-120":
        setTextField("Flaeche 120", qtyStr);
        break;
      case "sterillium-home-80":
        setTextField("Flaeche 80", qtyStr);
        break;
      case "mask-op":
        setTextField("mund_10", qtyStr);
        break;
      case "mask-ffp2":
        setTextField("ffp_1", qtyStr);
        break;
      case "bedmat-25":
        setTextField("bett_25", qtyStr);
        break;
      case "bedmat-30":
        setTextField("bett_30", qtyStr);
        break;
      case "sterillium-gel-100":
        setTextField("Hand Gel", qtyStr);
        break;
      case "sterillium-fluessig-100":
        setTextField("Hand norm", qtyStr);
        break;
      case "sterillium-fluessig-500":
        setTextField("Hand 500", qtyStr);
        break;
      case "bacillol-af-500":
        setTextField("Flaeche", qtyStr);
        break;
      default:
        console.warn(`Product ID ${id} not mapped to PDF.`);
    }
  });

  // ── 4. Total Sum ──
  setTextField("Summe", totalBudget.toFixed(2).replace('.', ','));

  // DO NOT flatten the form! Flattening Comb fields (Versichertennummer, Geburtsdatum) in pdf-lib destroys character spacing.
  // pdfForm.flatten();

  return await pdfDoc.save();
}
