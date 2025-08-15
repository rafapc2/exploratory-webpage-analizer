chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "GENERATE_REPORT") {
    // Orquestar: recibe datos, llama a report_md y descarga el archivo
    const { pageData } = msg;
    const { generateMarkdownReport } = await import('../modules/report/report_md');
    const md = generateMarkdownReport(pageData);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: `${pageData.title || 'report'}.md`
    });
    sendResponse({ success: true });
  }
  return true;
});
