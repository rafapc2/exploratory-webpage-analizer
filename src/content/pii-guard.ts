const PII_PATTERNS = [
  { type: "email", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi },
  { type: "phone", regex: /\b(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}\b/g },
  { type: "rut", regex: /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/g },
  { type: "card", regex: /\b(?:\d[ -]*?){13,16}\b/g }
];

export function maskPII(text: string, policy: "mask" | "exclude" | "none" = "mask") {
  if (policy === "none") return { text, flags: {} };
  let flags: Record<string, number> = {};
  let masked = text;
  for (const { type, regex } of PII_PATTERNS) {
    let matches = masked.match(regex);
    if (matches) {
      flags[type] = matches.length;
      if (policy === "mask") {
        masked = masked.replace(regex, (m) => "*".repeat(m.length));
      } else if (policy === "exclude") {
        masked = masked.replace(regex, "");
      }
    }
  }
  return { text: masked, flags };
}
