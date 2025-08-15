# Prompt maestro — Extensión Chrome (MV3) por fases (MVP1/MVP2)

**Rol**: Actúa como *Arquitecto de Soluciones* y *Desarrollador Senior de extensiones Chrome (Manifest V3)* con enfoque en seguridad, privacidad, escalabilidad y diseño modular. Entrega artefactos listos para usar, sin explicaciones innecesarias.

**Parámetros globales (editables)**  
- `TARGET_SITES`: `"*://*/*"`  
- `CAPTURE_SCOPE`: `["text","images","links","metadata"]`  
- `CLASSIFICATION_STRATEGY_MVP1`: `"local_rules"`  
- `CLASSIFICATION_STRATEGY_MVP2`: `"hybrid"` (reglas + LLM opcional)  
- `SENSITIVE_DATA_POLICY`: `"mask"` | `"exclude"` | `"none"` (por defecto `"mask"`)  
- `REPORT_VERSION`: `"1.0.0"`

---

## FASE 1 — MVP1 (sin BD; reporte **Markdown**)

### 1) Requerimientos funcionales
- Capturar **texto**, **imágenes** (solo URLs/attrs) y **enlaces**; incluir **metadata** (title, lang, canonical, metas OG/Twitter).
- Manejar **SPAs** con `MutationObserver` y límites de tiempo/tamaño.
- **Clasificación local** con taxonomía base editable:  
  `["ARTICLE","FORM","TABLE","MEDIA","NAV","AD","CODE","LEGAL","REVIEW","COMMENT","CONTACT","CREDENTIAL","FINANCIAL","PERSONAL_DATA","OTHER"]`.
- **Detección PII** (email, teléfono, RUT/ID, dirección, tarjeta) con patrones y validación; aplicar `SENSITIVE_DATA_POLICY`.
- Generar **reporte en Markdown** (un archivo por página) con:
  - Encabezado: título, URL, fecha/hora, idioma, canonical.
  - Resumen de **stats**: #caracteres texto, #imágenes, #enlaces, flags PII (conteos).
  - Secciones: **Texto** (bloques con selector y preview), **Imágenes** (tabla: alt, src absoluto, dimensiones si están disponibles), **Enlaces** (tabla: anchor, href absoluto, rel/target), **Metadata**.
  - Sección de **Clasificación** (labels dominantes, `confidence` promedio) y **Redacciones** aplicadas.
- **No** persistir contenido capturado en ninguna base de datos ni backend. Configuración mínima permitida en `chrome.storage` SOLO para toggles (no datos capturados).

### 2) Requerimientos no funcionales
- **Least privilege**: `permissions`: `"activeTab","scripting"`; `host_permissions` según `TARGET_SITES`. Sin `storage` para datos, solo para settings si es imprescindible.
- **Privacidad**: nada de secretos en código; sin llamadas remotas por defecto.
- **Rendimiento**: trocear DOM grande; `debounce` del observer; mover clasificación a `Worker` si es necesario.
- **Seguridad**: CSP estricta en páginas de extensión; prohibido `eval`/`Function`.

### 3) Implementación (artefactos que debes entregar)
1. **Diagrama ASCII** de arquitectura mínima.  
2. **Árbol de archivos y código listo** (TypeScript + Vite/Esbuild):
   - `manifest.json` (MV3) con `service_worker`.
   - `src/content/collector.ts` (extracción DOM)  
   - `src/content/pii-guard.ts` (enmascarado/exclusión)  
   - `src/background/index.ts` (orquestación, mensajería)  
   - `src/modules/classification/local_rules.ts`  
   - `src/modules/report/report_md.ts` (generador Markdown)  
   - `src/ui/{popup.html,popup.ts}` (toggles: capturar, clasificar, sensible)  
   - `package.json`, `tsconfig.json`, `vite.config.ts`  
   - `README.md` con **instalación en modo desarrollador**, build y uso
3. **Pruebas**:
   - Unit (Vitest/Jest) para normalización DOM, absolutización de URLs y detección PII.
   - E2E (Puppeteer/Chrome) cargando la extensión y validando la generación de Markdown.
4. **Criterios de aceptación (DoD)**:
   - Instalable en modo dev; ejecuta captura en un sitio de prueba y genera `.md`.
   - No solicita permisos innecesarios.
   - PII tratada según política elegida.
   - Pruebas unitarias y E2E verdes.

---

## FASE 2 — MVP2 (con **persistencia**; reporte MD + opcional JSON)

### 1) Requerimientos funcionales (incrementales)
- Mantener todo lo de MVP1.  
- **Persistencia** de capturas y reportes:
  - `indexeddb` en cliente **con cifrado (WebCrypto AES-GCM)**, o
  - `remote_api` (opcional) desde service worker con **retry/backoff** y batching.
- **Esquema de almacenamiento**:
  - `pages` (id, url, title, lang, captured_at, meta hash)
  - `items` (page_id, type, selector, data, labels, confidence, pii_flags, redactions)
  - `reports` (page_id, format: `"md"|"json"`, content/blobRef, version)
- **Clasificación “hybrid”** opcional: combinar reglas locales con `llm_adapter` (sanitizar antes de enviar, sin PII cruda).
- **Exportación JSON** (opcional) además del MD, validable con `report.schema.json`.

### 2) Requerimientos no funcionales (incrementales)
- **Permisos**: añadir `"storage"`; si `remote_api`: `host_permissions` del endpoint, `alarms` (retries), y `identity`/OAuth si aplica.
- **Seguridad**:
  - Generar y **rotar** clave de sesión (no persistir en claro).  
  - Política de **retención** configurable y borrado seguro.  
  - Dead-letter local si falla `remote_api`.  
- **Escalabilidad**: colas/batching en background; contratos estables entre módulos.

### 3) Implementación (artefactos adicionales/cambiados)
1. **Arquitectura** actualizada (diagrama ASCII).  
2. **Nuevos módulos**:
   - `src/modules/storage/indexeddb.ts` (DAO + cifrado)
   - `src/modules/storage/crypto.ts` (WebCrypto helpers)
   - `src/modules/storage/remote_api.ts` (fetch + backoff)
   - `src/modules/classification/llm_adapter.ts` y `hybrid.ts` (si se activa)
   - `src/modules/report/report_json.ts` + `schema/report.schema.json`
   - `src/background/queue.ts` (batching, reintentos, DLQ)
   - `src/ui/options.html` / `options.ts` (retención, destino storage, activar LLM)
3. **README** actualizado con variables/secretos (tokens fuera del bundle), migraciones y políticas de retención.
4. **Pruebas**:
   - Unit para DAOs, cifrado AES-GCM, rotación de claves, backoff y serialización JSON.
   - E2E con persistencia: verificar que una captura aparece en IndexedDB/remote y exporta MD/JSON.
5. **DoD**:
   - Persistencia cifrada funcionando y configurable.
   - Export/Import de reportes (MD y JSON) operativo.
   - Sin PII en tránsito si `SENSITIVE_DATA_POLICY != "none"`; sanitización previa a LLM/remote.
   - Pruebas verdes.

---

## Formato de salida esperado (para ambas fases)
- **Diagrama ASCII**  
- **Árbol de proyecto** y **código por archivo** (bloques separados)  
- **Scripts** de build/test  
- **README** con pasos de instalación/uso  
- **(MVP2)** `report.schema.json` + **ejemplo** válido

---

## Checklists rápidas

### Threat Modeling (STRIDE abreviado)
- *Spoofing*: usar `chrome.runtime` messaging con validación; no aceptar mensajes externos.  
- *Tampering*: CSP estricta; evitar `eval`; hash/firmas en bundles si aplica.  
- *Repudiation*: logs solo no sensibles; timestamps.  
- *Information Disclosure*: PII mask/exclude; cifrado en reposo y tránsito (MVP2 remoto).  
- *DoS*: límites de tamaño, backpressure.  
- *Elevation*: mínimos permisos; sin `unsafe-eval`.

### Definition of Done (común)
- Permisos mínimos.  
- Captura, clasificación y reporte verificados en sitio de prueba.  
- Políticas PII aplicadas y testeadas.  
- Documentación y pruebas actualizadas.
