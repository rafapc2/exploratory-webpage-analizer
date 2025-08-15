
# Exploratory Webpage Analyzer

## Instalación y uso en Chrome (modo desarrollador)

### 1. Clona el repositorio y prepara el entorno

```sh
git clone <URL_DEL_REPO>
cd exploratory-webpage-analizer
npm install
npm run build
```

### 2. Carga la extensión en Chrome

1. Abre Chrome y navega a `chrome://extensions`.
2. Activa el "Modo desarrollador" (esquina superior derecha).
3. Haz clic en "Cargar descomprimida".
4. Selecciona la carpeta `dist/` generada tras el build.

### 3. Uso de la extensión

- Haz clic en el icono de la extensión en la barra de Chrome.
- Ajusta los toggles según lo que quieras capturar o analizar.
- Pulsa "Generar reporte".
- Se descargará automáticamente un archivo `.md` con el análisis de la página actual.

### 4. Scripts útiles
- `npm install -g vite`
- `npm run dev` — Modo desarrollo (hot reload)
- `npm run build` — Compila la extensión para producción
- `npm test` — Ejecuta pruebas unitarias
- `npm run test:e2e` — Ejecuta pruebas E2E (requiere Chrome y Puppeteer)

### Notas

- No se almacena ningún dato capturado.
- El tratamiento de PII depende de la configuración elegida.
- Permisos mínimos: solo `activeTab` y `scripting`.

---

¿Dudas? Consulta el archivo `context.md` para detalles técnicos y arquitectura.
