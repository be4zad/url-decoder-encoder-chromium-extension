function enableSoftWrap() {
  document.getElementById("soft-wrap").checked = true;
  document.getElementById("url-input").wrap = "soft";
  document.getElementById("url-input").classList.remove('softWrapDisabled');
  document.getElementById("url-input").classList.add('softWrapEnabled');
}

function disableSoftWrap() {
  document.getElementById("soft-wrap").checked = false;
  document.getElementById("url-input").wrap = "off";
  document.getElementById("url-input").classList.remove('softWrapEnabled');
  document.getElementById("url-input").classList.add('softWrapDisabled');
}

function goButtonClicked() {
  var url = document.getElementById("url-input").value;

  if (document.getElementById("encode-hashtag").checked) {
    url = url.replace("#", "%23");
  }

  chrome.tabs.update(undefined, { url: url });
}

function encodeHashtagCheckboxChanged() {
  if (this.checked) {
    chrome.storage.sync.set({ encodeHashtagLastTimeChecked: true });
  } else {
    chrome.storage.sync.set({ encodeHashtagLastTimeChecked: false });
  }
}

function softWrapCheckboxChanged() {
  if (this.checked) {
    chrome.storage.sync.set({ softWrapChecked: true });
    enableSoftWrap();
  } else {
    chrome.storage.sync.set({ softWrapChecked: false });
    disableSoftWrap();
  }
}

function urlInputKeyPressed(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("go-button").click();
  }
}

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true, });

  var url = tab.url;
  url = url.replace(/%(?![0-9a-fA-F]{2})/g, '%25');
  url = decodeURI(url);
  url = url.replace("%23", "#");
  document.getElementById("url-input").value = url;

  chrome.storage.sync.get("encodeHashtagLastTimeChecked", function (data) {
    if (data.encodeHashtagLastTimeChecked == true) {
      document.getElementById("encode-hashtag").checked = true;
    }
  });
  
  chrome.storage.sync.get("softWrapChecked", function (data) {
    if (data.softWrapChecked == true) {
      enableSoftWrap();
    } else {
      disableSoftWrap();
    }
  });
})();

document.getElementById("go-button").addEventListener("click", goButtonClicked);
document.getElementById("url-input").addEventListener("keypress", urlInputKeyPressed);
document.getElementById("encode-hashtag").addEventListener("change", encodeHashtagCheckboxChanged);
document.getElementById("soft-wrap").addEventListener("change", softWrapCheckboxChanged);
