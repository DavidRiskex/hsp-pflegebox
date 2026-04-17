import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { CartState } from "../app/beantragen/page"; // We can redefine type locally to avoid circular

export async function generateOrderPdf(
  form: any, 
  cart: Record<string, { quantity: number; size?: string }>, 
  totalBudget: number,
  wantsBedMat: boolean | null,
  hasProvider: string,
  signatureBase64?: string | null,
  intervalType?: string | null
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
        
        // DRAW DOTS if it's an 8-box date field
        if (numBoxes === 8 && cleanText.length === 8) {
          const dotY = rect.y + (rect.height * 0.25);
          targetPage.drawText(".", { x: rect.x + (boxWidth * 2) - 1, y: dotY, size: 11 }); // After DD
          targetPage.drawText(".", { x: rect.x + (boxWidth * 4) - 1, y: dotY, size: 11 }); // After MM
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
  const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();
  const address1 = `${form.street || ""} ${form.streetNo || ""}`;
  const zipCity = `${form.zip || ""} ${form.city || ""}`;
  
  setTextField("Name Kunde", fullName);
  // Reformat YYYY-MM-DD to DDMMYYYY for combed field (fills both P2 and P5)
  const dobParts = (form.dob || "").split("-");
  const dobGerman = dobParts.length === 3 ? `${dobParts[2]}${dobParts[1]}${dobParts[0]}` : "";
  drawCombedText("Geburtsdatum", dobGerman, 8); 
  
  setTextField("Strasse", address1);
  setTextField("PLZ_Ort", zipCity);
  setTextField("Adresse", `${address1}, ${zipCity}`); // Fills both P2 and P5
  setTextField("absender", `${fullName}, ${address1}, ${zipCity}`); // Page 4
  setTextField("Telefon", form.phone || "");
  setTextField("pflegekasse", form.insurance || "");
  drawCombedText("Versicherten-Nummer", (form.insuranceNo || "").replace(/\s/g, ''), 10); // Fills both P2 and P5

  // If there's an old provider (we must only fill this if the user actually clicked "YES, I change provider")
  if (form.oldProvider && hasProvider === "yes") {
    // Page 4 & 5 mappings
    setTextField("Bisheriger Versorger", form.oldProvider);
    setTextField("Bisheriger Vorsorger", form.oldProvider);
    setTextField("bisheriger Versorger Straße", form.oldProviderStreet || "");
    setTextField("bisheriger Versorger PLZ", form.oldProviderZipCity || "");
    
    // Dates for Page 5
    if (form.oldContractEnd) {
      const endParts = form.oldContractEnd.split("-");
      if (endParts.length === 3) setTextField("kündigungsdatum", `${endParts[2]}.${endParts[1]}.${endParts[0]}`);
    }
    if (form.newContractStart) {
      const startParts = form.newContractStart.split("-");
      if (startParts.length === 3) setTextField("vertragsbeginn", `${startParts[2]}.${startParts[1]}.${startParts[0]}`);
    }
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

  // ── 4. Total Sum & Remarks ──
  setTextField("Summe", totalBudget.toFixed(2).replace('.', ','));

  if (intervalType) {
    const intervalText = intervalType === "quartal" ? "Quartalsweise" : "Monatlich";
    setTextField("Text2", `Gewünschtes Lieferintervall: ${intervalText}`);
  }

      // ── 5. Add Digital Signature ──
  if (signatureBase64) {
    try {
      const page2 = pages[2]; // Page 3 (0-indexed)
      
      // Remove base64 prefix if present
      const base64Data = signatureBase64.split(',')[1] || signatureBase64;
      const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, "base64"));
      
      // Draw signature on the right-hand line (Page 3) - LOWERED to hit the line
      page2.drawImage(signatureImage, {
        x: 300,
        y: 284, // Lowered from 290
        width: 180,
        height: 60,
      });

      // Draw signature also on the last page (Page 5) for provider change - LOWERED to hit the line
      const page4 = pages[4]; // Page 5 (0-indexed)
      page4.drawImage(signatureImage, {
        x: 300,
        y: 118, // Lowered from 125
        width: 180,
        height: 60,
      });

      // Draw today's date into the boxed area on Page 3 (Datum field)
      // Format: DD.MM.YYYY
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const todayTextShort = `${dd}${mm}${yyyy}`;
      
      drawCombedText("Datum", todayTextShort, 8);
      
      // Also fill the 'ort datum' boxed area on Page 5
      drawCombedText("ort datum", todayTextShort, 8);
    } catch (e) {
      console.warn("Could not embed signature into PDF", e);
    }
  }

  // DO NOT flatten the form! Flattening Comb fields (Versichertennummer, Geburtsdatum) in pdf-lib destroys character spacing.
  // pdfForm.flatten();

  return await pdfDoc.save();
}
