import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  // Cargar extensión, abrir página de prueba, clickear popup, verificar descarga .md
  // (Implementación de ejemplo, requiere ajuste de paths)
  await browser.close();
})();
