# Exploratory Webpage Analyzer (MVP1)

## Instalación (modo desarrollador)

1. Clona este repo y ejecuta:
   ```
   npm install
   npm run build
   ```
2. En Chrome, ve a `chrome://extensions`, activa "Modo desarrollador".
3. Haz clic en "Cargar descomprimida" y selecciona la carpeta `dist/`.

## Uso

- Haz clic en el icono de la extensión.
- Ajusta los toggles y pulsa "Generar reporte".
- Se descargará un archivo `.md` con el análisis de la página actual.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de extensión
- `npm test` — pruebas unitarias
- `npm run test:e2e` — pruebas E2E (requiere Chrome y Puppeteer)

## Notas

- No se almacena ningún dato capturado.
- El tratamiento de PII depende del toggle y la política configurada.
- Permisos mínimos: solo `activeTab` y `scripting`.

---
