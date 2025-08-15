export function generateMarkdownReport(pageData: any): string {
  const { metadata, textBlocks, images, links, piiBlocks, classified } = pageData;
  const now = new Date().toISOString();

  // Stats
  const textChars = textBlocks.reduce((sum: number, b: any) => sum + b.fullText.length, 0);
  const piiFlags = piiBlocks.reduce((acc: any, b: any) => {
    for (const [k, v] of Object.entries(b.pii.flags)) acc[k] = (acc[k] || 0) + (v as number);
    return acc;
  }, {});

  // Clasificación resumen
  const labelStats: Record<string, { count: number, confidence: number }> = {};
  for (const c of classified) {
    if (!labelStats[c.label]) labelStats[c.label] = { count: 0, confidence: 0 };
    labelStats[c.label].count++;
    labelStats[c.label].confidence += c.confidence;
  }

  return `# ${metadata.title}
- **URL:** ${metadata.url}
- **Fecha:** ${now}
- **Idioma:** ${metadata.lang}
- **Canonical:** ${metadata.canonical}

## Stats
- **Texto:** ${textChars} caracteres
- **Imágenes:** ${images.length}
- **Enlaces:** ${links.length}
- **PII:** ${Object.entries(piiFlags).map(([k, v]) => `${k}: ${v}`).join(', ')}

## Texto
${textBlocks.map(b => `- \`${b.selector}\`: ${b.preview.replace(/\n/g, ' ').slice(0, 200)}`).join('\n')}

## Imágenes
| Selector | Alt | Src | Dimensiones |
|---|---|---|---|
${images.map(img => `| \`${img.selector}\` | ${img.alt} | ${img.src} | ${img.width}x${img.height} |`).join('\n')}

## Enlaces
| Selector | Anchor | Href | Rel | Target |
|---|---|---|---|---|
${links.map(a => `| \`${a.selector}\` | ${a.anchor} | ${a.href} | ${a.rel} | ${a.target} |`).join('\n')}

## Metadata
- **Metas:**  
${metadata.metas.map((m: any) => `  - ${m.name || m.property}: ${m.content}`).join('\n')}

## Clasificación
${Object.entries(labelStats).map(([label, stat]) =>
  `- ${label}: ${stat.count} (${(stat.confidence/stat.count).toFixed(2)})`).join('\n')}
`;
}
