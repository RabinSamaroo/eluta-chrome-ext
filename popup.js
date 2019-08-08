document
  .getElementById("copy-harvester-btn")
  .addEventListener("click", copy_harvester, false);

document
  .getElementById("paste-harvester-btn")
  .addEventListener("click", paste_harvester, false);

function copy_harvester() {
  //select active tab
  chrome.tabs.query({ active: true }, function(tabs) {
    var tab = tabs[0];

    //execute script on active tab
    chrome.tabs.executeScript(
      tab.id,
      {
        code: "document.documentElement.innerText" //gets text content
      },
      function(json) {
        chrome.storage.local.set({ selected: json }); //places text content in extension local storage
        document.getElementById("log").innerText = "Copied!";
      }
    );
  });
}

// Returns a string of code to be executed by the tab to inject the data
// @param config is a json string of data
function inject_harvester_code(config) {
  var cfg = JSON.parse(config);
  code = "";
  code +=
    'document.getElementsByName("test_url")[0].value="' + cfg.test_url + '";';

  code += 'document.getElementsByName("test_pager_url")[0].value="';
  if (cfg.test_pager_url != null) {
    code += cfg.test_pager_url;
  }
  code += '";';

  code +=
    'document.getElementsByName("pager_max")[0].value="' + cfg.pager_max + '";';

  return code;
}

function paste_harvester() {
  //select active tab
  chrome.tabs.query({ active: true }, function(tabs) {
    var tab = tabs[0];

    chrome.storage.local.get("selected", function(result) {
      // fetch data from storage
      //inject data on active tab
      chrome.tabs.executeScript(tab.id, {
        code: inject_harvester_code(result.selected)
      });
    });
  });
}
