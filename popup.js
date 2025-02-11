(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  document.getElementById('url-input').value = decodeURI(tab.url);
})();

document.getElementById('go-button').addEventListener('click', () => {
  chrome.tabs.update(undefined, { url: document.getElementById('url-input').value });
});

document.getElementById('url-input').addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    document.getElementById('go-button').click();
  }
});
