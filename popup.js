(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  var url = decodeURI(tab.url);
  url = url.replace("%23", "#");
  document.getElementById("url-input").value = url;

  chrome.storage.sync.get("encodeHashtagLastTimeChecked", function (data) {
    if (data.encodeHashtagLastTimeChecked == true) {
      document.getElementById("encode-hashtag").checked = true;
    }
  });
})();

document.getElementById("go-button").addEventListener("click", () => {
  var url = document.getElementById("url-input").value;

  if (document.getElementById("encode-hashtag").checked) {
    url = url.replace("#", "%23");
  }

  chrome.tabs.update(undefined, { url: url });
});

document.getElementById("url-input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.getElementById("go-button").click();
  }
});

document
  .getElementById("encode-hashtag")
  .addEventListener("change", function () {
    if (this.checked) {
      chrome.storage.sync.set({ encodeHashtagLastTimeChecked: true });
    } else {
      chrome.storage.sync.set({ encodeHashtagLastTimeChecked: false });
    }
  });
