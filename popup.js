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

function paste_harvester() {
  //select active tab
  chrome.tabs.query({ active: true }, function(tabs) {
    var tab = tabs[0];

    chrome.storage.local.get("selected", function(result) { // fetch copied data
      var selected = JSON.parse(result.selected); // parse json to object
      
      //execute script on active tab
      chrome.tabs.executeScript(tab.id, { //inject data to harvester page
        code: 'document.getElementsByName("test_url")[0].value="' + selected.harvester_name + '"'
      });
    });

  });
}
