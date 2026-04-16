export type ProductId = string;

export interface ProductConfig {
  id: ProductId;
  group: string; // Used for UI categorization
  category: string;
  brandLine: string;
  packSize: string;
  price: number; 
  img: string | null;
  hasSizes?: boolean;
  maxQuantity?: number; 
}

export const PRODUCTS: ProductConfig[] = [
  // ── Handschuhe ──
  {
    id: "gloves-nitril",
    group: "Handschuhe & Schutzbekleidung",
    category: "Einmalhandschuhe Nitril",
    brandLine: "Peha-soft® Nitrile Blue – von HARTMANN",
    packSize: "100 St.",
    price: 10.71,
    img: "/products/peha-soft-nitrile-blue.png",
    hasSizes: true, // S, M, L, XL
  },
  {
    id: "gloves-latex",
    group: "Handschuhe & Schutzbekleidung",
    category: "Einmalhandschuhe Latex",
    brandLine: "Peha-soft® Latex Protect – von HARTMANN",
    packSize: "100 St.",
    price: 10.71,
    img: "/products/peha-soft-latex-protect.png",
    hasSizes: true,
  },
  {
    id: "gloves-vinyl",
    group: "Handschuhe & Schutzbekleidung",
    category: "Einmalhandschuhe Vinyl",
    brandLine: "Untersuchungshandschuhe Vinyl – puderfrei",
    packSize: "100 St.",
    price: 10.71,
    img: "/products/peha-soft-nitrile-blue.png", // Vinyl typically looks similar or using blue as placeholder
    hasSizes: true,
  },

  // ── Schutzbekleidung ──
  {
    id: "bibs",
    group: "Handschuhe & Schutzbekleidung",
    category: "Einmal-Schutzlätzchen (Zum Binden)",
    brandLine: "Vala®Fit tape – von HARTMANN",
    packSize: "100 St.",
    price: 11.90,
    img: "/products/hartmann-vala-fit-tape-packung_1280x1280.jpg",
  },
  {
    id: "apron",
    group: "Handschuhe & Schutzbekleidung",
    category: "Einmal-Schutzschürze",
    brandLine: "Vala®Comfort apron – von HARTMANN",
    packSize: "100 St.",
    price: 13.09,
    img: "/products/vala-comfort-apron.png",
  },

  // ── Desinfektionstücher ──
  {
    id: "sterillium-2in1",
    group: "Desinfektion (Hände & Flächen)",
    category: "Hand- und Flächendesinfektionstücher 2in1",
    brandLine: "Sterillium® 2in1 wipes – von HARTMANN",
    packSize: "15 St.",
    price: 2.86,
    img: "/products/sterillium-wipes.png",
  },
  {
    id: "bacillol-24",
    group: "Desinfektion (Hände & Flächen)",
    category: "Flächendesinfektionstücher (Bacillol®)",
    brandLine: "Bacillol® 30 Sensitive Green Tissues",
    packSize: "24 St.",
    price: 4.57,
    img: "/products/bacillol-30-tissues.png",
  },
  {
    id: "bacillol-120",
    group: "Desinfektion (Hände & Flächen)",
    category: "Flächendesinfektionstücher (Bacillol®)",
    brandLine: "Bacillol® 30 Sensitive Tissues (Dose/Flowpack)",
    packSize: "120 St.",
    price: 22.85,
    img: "/products/bacillol-30-tissues.png", 
  },
  {
    id: "sterillium-home-80",
    group: "Desinfektion (Hände & Flächen)",
    category: "Flächendesinfektionstücher (dünnere Tücher)",
    brandLine: "Sterillium® home – von HARTMANN",
    packSize: "80 St.",
    price: 15.23,
    img: "/products/sterillium-home-tuecher.png",
  },

  // ── Masken ──
  {
    id: "mask-op",
    group: "Schutzmasken",
    category: "OP-Masken",
    brandLine: "Foliodress® Mask Loop Type IIR",
    packSize: "10 St.",
    price: 1.43,
    img: "/products/foliodress-mask-iir.png",
  },
  {
    id: "mask-ffp2",
    group: "Schutzmasken",
    category: "FFP2-Masken",
    brandLine: "Foliodress® Mask Loop FFP2",
    packSize: "1 St.",
    price: 0.77,
    img: "/products/foliodress-mask-iir.png", // Re-using image temporarily as requested
  },

  // ── Bettschutzeinlagen ──
  {
    id: "bedmat-25",
    group: "Bettschutzeinlagen",
    category: "Bettschutzeinlagen",
    brandLine: "MoliCare® Premium Bed Mat 5 Tropfen",
    packSize: "25 St.",
    price: 12.20,
    img: "/products/65804-138744_molicare_premium_bedmat_1_1920x1920.webp",
  },
  {
    id: "bedmat-30",
    group: "Bettschutzeinlagen",
    category: "Bettschutzeinlagen",
    brandLine: "MoliCare® Premium Bed Mat 5 Tropfen",
    packSize: "30 St.",
    price: 14.64,
    img: "/products/65804-138744_molicare_premium_bedmat_1_1920x1920.webp",
  },

  // ── Desinfektionsmittel (Flüssig / Gel) ──
  {
    id: "sterillium-gel-100",
    group: "Desinfektion (Hände & Flächen)",
    category: "Handdesinfektionsmittel (Gel)",
    brandLine: "Sterillium® Gel pure – von HARTMANN",
    packSize: "100 ml",
    price: 1.65,
    img: "/products/sterillium-gel-pure-100ml.png",
    maxQuantity: 1, // Max. Abgabemenge für 100 ml 1x pro Box
  },
  {
    id: "sterillium-fluessig-100",
    group: "Desinfektion (Hände & Flächen)",
    category: "Handdesinfektionsmittel (Flüssig)",
    brandLine: "Sterillium® pure – von HARTMANN",
    packSize: "100 ml",
    price: 1.65,
    img: "/products/sterillium-pure-100ml.png",
    maxQuantity: 1, // Max. Abgabemenge für 100 ml 1x pro Box
  },
  {
    id: "sterillium-fluessig-500",
    group: "Desinfektion (Hände & Flächen)",
    category: "Handdesinfektionsmittel (Flüssig)",
    brandLine: "Sterillium® pure – von HARTMANN",
    packSize: "500 ml",
    price: 8.27,
    img: "/products/sterillium-pure-500ml.png",
  },
  {
    id: "bacillol-af-500",
    group: "Desinfektion (Hände & Flächen)",
    category: "Flächendesinfektionsmittel (Flüssig)",
    brandLine: "Bacillol® AF – von HARTMANN",
    packSize: "500 ml",
    price: 6.72,
    img: "/products/bacillol-af.png",
  },
];

export const TOTAL_BUDGET = 42.00;
