/// <reference types="chrome" />

document.getElementById('run-btn')?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(
    tab.id!,
    { type: "COLLECT_PAGE_DATA" },
    (resp: { pageData?: any } | undefined) => {
      if (resp?.pageData) {
        chrome.runtime.sendMessage(
          { type: "GENERATE_REPORT", pageData: resp.pageData },
          (r: { success?: boolean } | undefined) => {
            document.getElementById('status')!.textContent = r?.success ? "Reporte generado." : "Error.";
          }
        );
      }
    }
  );
});
