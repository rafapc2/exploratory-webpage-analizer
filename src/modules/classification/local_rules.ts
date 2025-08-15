const TAXONOMY = [
  "ARTICLE","FORM","TABLE","MEDIA","NAV","AD","CODE","LEGAL","REVIEW",
  "COMMENT","CONTACT","CREDENTIAL","FINANCIAL","PERSONAL_DATA","OTHER"
];

export function classifyBlocks(blocks: { selector: string, preview: string }[]) {
  // Simple heurística: por selector/palabras clave
  return blocks.map(b => {
    let label = "OTHER";
    let confidence = 0.5;
    if (/form/i.test(b.selector)) { label = "FORM"; confidence = 0.9; }
    else if (/table/i.test(b.selector)) { label = "TABLE"; confidence = 0.9; }
    else if (/nav/i.test(b.selector)) { label = "NAV"; confidence = 0.8; }
    else if (/article|main|section/i.test(b.selector)) { label = "ARTICLE"; confidence = 0.8; }
    else if (/comment/i.test(b.preview)) { label = "COMMENT"; confidence = 0.7; }
    // ...más reglas según TAXONOMY
    return { ...b, label, confidence };
  });
}
