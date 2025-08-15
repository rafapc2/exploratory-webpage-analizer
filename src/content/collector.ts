
/// <reference types="chrome" />
import { maskPII } from './pii-guard';
import { classifyBlocks } from '../modules/classification/local_rules';

const CAPTURE_SCOPE = ["text", "images", "links", "metadata"];
const SENSITIVE_DATA_POLICY = "mask";

async function collectPageData() {
  // 1. Metadata
  const metadata = {
    title: document.title,
    url: location.href,
    lang: document.documentElement.lang || "unknown",
    canonical: (document.querySelector('link[rel="canonical"]') as HTMLLinkElement)?.href || "",
    metas: Array.from(document.querySelectorAll('meta')).map(m => ({
      name: m.getAttribute('name'),
      property: m.getAttribute('property'),
      content: m.getAttribute('content')
    }))
  };

  // 2. Texto
  const textBlocks = Array.from(document.querySelectorAll('article, section, main, p, h1, h2, h3, h4, h5, h6, li'))
    .map(el => ({
      selector: getUniqueSelector(el),
      preview: el.textContent?.trim().slice(0, 200) || "",
      fullText: el.textContent || ""
    }));

  // 3. Imágenes
  const images = Array.from(document.images).map(img => ({
    selector: getUniqueSelector(img),
    alt: img.alt,
    src: img.src,
    width: img.naturalWidth,
    height: img.naturalHeight
  }));

  // 4. Enlaces
  const links = Array.from(document.links).map(a => ({
    selector: getUniqueSelector(a),
    anchor: a.textContent?.trim().slice(0, 100) || "",
    href: a.href,
    rel: a.rel,
    target: a.target
  }));

  // 5. PII
  const piiBlocks = textBlocks.map(b => ({
    selector: b.selector,
    pii: maskPII(b.fullText, SENSITIVE_DATA_POLICY)
  }));

  // 6. Clasificación
  const classified = classifyBlocks(textBlocks);

  return {
    metadata,
    textBlocks,
    images,
    links,
    piiBlocks,
    classified
  };
}

// Utilidad para selector único
function getUniqueSelector(el: Element): string {
  if ((el as HTMLElement).id) return `#${(el as HTMLElement).id}`;
  let path = [];
  while (el && el.nodeType === 1 && el !== document.body) {
    let selector = el.nodeName.toLowerCase();
    if ((el as HTMLElement).classList && (el as HTMLElement).classList.length > 0) {
      selector += '.' + Array.from((el as HTMLElement).classList).join('.');
    }
    path.unshift(selector);
    el = el.parentElement!;
  }
  return path.join(' > ');
}

// Trigger desde popup
chrome.runtime.onMessage.addListener(
  async (
    msg: { type?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (msg.type === "COLLECT_PAGE_DATA") {
      const data = await collectPageData();
      sendResponse({ pageData: data });
    }
    return true;
  }
);
