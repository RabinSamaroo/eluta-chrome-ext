document
  .getElementById("copy-harvester-btn")
  .addEventListener("click", copy_harvester, false);

document
  .getElementById("paste-harvester-btn")
  .addEventListener("click", paste_harvester, false);

function copy_harvester() {
  // select active tab
  chrome.tabs.query({ active: true }, function(tabs) {
    var tab = tabs[0];

    // execute script on active tab
    chrome.tabs.executeScript(
      tab.id,
      {
        code: "document.documentElement.innerText" // gets text content
      },
      function(json) {
        chrome.storage.local.set({ selected: json }); // places text content in extension local storage
        document.getElementById("log").innerText = "Copied!";
      }
    );
  });
}

function escape_quotes(string) {
  //escapes quotes so the code string will not be cut off by a quote in the code
  string = string.replace(/\"/g, '\\"');
  string = string.replace(/\'/g, "\\'");
  return string;
}

// Returns a string of code to be executed by the tab to inject the data
// @param config is a json string of data
// @param pasteURL is needed for harveter ID, consider changing the way this is passed
function inject_harvester_code(config, pasteURL) {
  var cfg = JSON.parse(config);
  var harvesterId = pasteURL.match(/harvester_id=(\d+)/)[1];
  code = "";

  // Add ability to create a new field via the anon function - copied from eluta js
  code += `var addItemParserItem = function() {
    var i, j, copy, elements;
    var table = document.getElementById('itemparser_table');
    var rows = table.getElementsByTagName('tr');
    var sample = [rows[rows.length-4], rows[rows.length-3], rows[rows.length-2], rows[rows.length-1]];

    var idx = -(sample[0].id.substr(sample[0].id.lastIndexOf('-')+1))
    var idxstr = '~'+(idx)+'~';

    for (i=0; i<sample.length; i++) {
        copy = sample[i].cloneNode(true);
        copy.id = copy.id.substring(0,copy.id.length - idx.toString().length)+(idx-1);

        elements = copy.getElementsByTagName('select');
        for (j=0; j<elements.length; j++) {
            elements[j].selectedIndex = 0;
            elements[j].name = elements[j].name.replace(idxstr, '~'+(idx-1)+'~');
        };

        elements = copy.getElementsByTagName('input');
        for (j=0; j<elements.length; j++) {
            if (elements[j].type == 'checkbox') {
                elements[j].checked = false;
            } else if (elements[j].type == 'text') {
                elements[j].value = '';
            }
            elements[j].name = elements[j].name.replace(idxstr, '~'+(idx-1)+'~');
        }

        rows[0].parentNode.appendChild(copy);
    }
    return false;
};`;

  // FIELDS WITH QUOTES => TEST URL, TEST P URL, PAT ID, PATURL, ITEM PARSER FIELDS
  // Test url
  code +=
    'document.getElementsByName("test_url")[0].value="' +
    escape_quotes(cfg.test_url) +
    '";';

  // Def sync
  code +=
    'document.getElementsByName("default_harvester_sync_mode_id")[0].value="' +
    cfg.default_harvester_sync_mode_id +
    '";';

  // Test pager url
  code += 'document.getElementsByName("test_pager_url")[0].value="';
  if (cfg.test_pager_url != null) {
    code += escape_quotes(cfg.test_pager_url);
  }
  code += '";';

  // pager max #
  code +=
    'document.getElementsByName("pager_max")[0].value="' + cfg.pager_max + '";';

  // row error
  code +=
    'document.getElementsByName("max_row_errors")[0].value="' +
    cfg.max_row_errors +
    '";';

  // list parser
  code +=
    'document.getElementsByName("list_parser")[0].value="' +
    cfg.list_parser +
    '";';

  // 1st Page
  code +=
    'document.getElementsByName("pager_offset")[0].value="' +
    cfg.pager_offset +
    '";';

  // pager step
  code +=
    'document.getElementsByName("pager_step")[0].value="' +
    cfg.pager_step +
    '";';

  // List type
  code +=
    'document.getElementsByName("list_type")[0].value="' + cfg.list_type + '";';

  // List Begin
  code += 'document.getElementsByName("list_begin")[0].value="';
  if (cfg.list_begin != null) {
    code += cfg.list_begin;
  }
  code += '";';

  // List End
  code += 'document.getElementsByName("list_end")[0].value="';
  if (cfg.list_end != null) {
    code += cfg.list_end;
  }
  code += '";';

  // List header
  code += 'document.getElementsByName("header_idstr")[0].value="';
  if (cfg.header_idstr != null) {
    code += cfg.header_idstr;
  }
  code += '";';

  // Table #
  code += 'document.getElementsByName("list_table_number")[0].value="';
  if (cfg.list_table_number != null) {
    code += cfg.list_table_number;
  }
  code += '";';

  // Head Rows
  code +=
    'document.getElementsByName("header_rows")[0].value="' +
    cfg.header_rows +
    '";';

  // Expected Rows
  code += 'document.getElementsByName("list_expect")[0].value="';
  if (cfg.list_expect != null) {
    code += cfg.list_expect;
  }
  code += '";';

  // Column ID
  code += 'document.getElementsByName("jobid_column")[0].value="';
  if (cfg.jobid_column) {
    code += cfg.jobid_column;
  }
  code += '";';

  // Column Link
  code += 'document.getElementsByName("joburl_column")[0].value="';
  if (cfg.joburl_column) {
    code += cfg.joburl_column;
  }
  code += '";';

  // Column Title
  code += 'document.getElementsByName("position_title_column")[0].value="';
  if (cfg.position_title_column) {
    code += cfg.position_title_column;
  }
  code += '";';

  // Column Location
  code += 'document.getElementsByName("location_column")[0].value="';
  if (cfg.location_column) {
    code += cfg.location_column;
  }
  code += '";';

  // Column Pub Date - element name has leading newline
  code += 'document.getElementsByName("\\npublished_ts_column")[0].value="';
  if (cfg.published_ts_column) {
    code += cfg.published_ts_column;
  }
  code += '";';

  // Pattern ID
  code += 'document.getElementsByName("id_regex")[0].value="';
  if (cfg.id_regex != null) {
    code += escape_quotes(cfg.id_regex);
  }
  code += '";';

  // Pat. URL
  code += 'document.getElementsByName("link_pattern")[0].value="';
  if (cfg.link_pattern != null) {
    code += escape_quotes(cfg.link_pattern);
  }
  code += '";';

  // Row Reject
  code += 'document.getElementsByName("list_reject")[0].value="';
  if (cfg.list_reject != null) {
    code += escape_quotes(cfg.list_reject);
  }
  code += '";';

  // Row Require
  code += 'document.getElementsByName("list_require")[0].value="';
  if (cfg.list_require != null) {
    code += escape_quotes(cfg.list_require);
  }
  code += '";';

  // Page Reject
  code += 'document.getElementsByName("list_page_require")[0].value="';
  if (cfg.list_page_require != null) {
    code += escape_quotes(cfg.list_page_require);
  }
  code += '";';

  // Page Require
  code += 'document.getElementsByName("list_page_reject")[0].value="';
  if (cfg.list_page_reject != null) {
    code += escape_quotes(cfg.list_page_reject);
  }
  code += '";';

  // Item Parser
  code +=
    'document.getElementsByName("item_parser")[0].value="' +
    cfg.item_parser +
    '";';

  // Unique
  code +=
    'document.getElementsByName("unique_months:int")[0].value="' +
    cfg.unique_months +
    '";';

  // Ignore dupe URLs
  code += 'document.getElementsByName("ignore_duplicate_urls")[0].checked="';
  if (cfg.unique_months) {
    code += "checked";
  }
  code += '";';

  // Pre Reject
  code += 'document.getElementsByName("pre_parse_reject")[0].value="';
  if (cfg.pre_parse_reject != null) {
    code += escape_quotes(cfg.pre_parse_reject);
  }
  code += '";';

  // Cookie URL
  code += 'document.getElementsByName("cookie_req")[0].value="';
  if (cfg.cookie_req != null) {
    code += escape_quotes(cfg.cookie_req);
  }
  code += '";';

  // Item Begin
  code += 'document.getElementsByName("item_begin")[0].value="';
  if (cfg.item_begin != null) {
    code += escape_quotes(cfg.item_begin);
  }
  code += '";';

  // Item End
  code += 'document.getElementsByName("item_end")[0].value="';
  if (cfg.item_end != null) {
    code += escape_quotes(cfg.item_end);
  }
  code += '";';

  // Notes
  // ITEM PARSER
  for (item in cfg.__itemdef) {
    //alert(cfg.__itemdef[item].harvester_field_label);
    code += "addItemParserItem();";

    // generate name for item fields
    if (item == 0) {
      itemPrefix = String(harvesterId) + "~" + String(item);
    } else {
      itemPrefix = String(harvesterId) + "~-" + String(item);
    }

    // Field type
    code +=
      'document.getElementsByName("' +
      itemPrefix +
      '~harvester_field_id:int")[0].value="' +
      cfg.__itemdef[item].harvester_field_id +
      '";';

    // Begin
    code += 'document.getElementsByName("' + itemPrefix + '~begin")[0].value="';
    if (cfg.__itemdef[item].field_begin != null) {
      code += escape_quotes(cfg.__itemdef[item].field_begin);
    }
    code += '";';

    // End
    code += 'document.getElementsByName("' + itemPrefix + '~end")[0].value="';
    if (cfg.__itemdef[item].field_end != null) {
      code += escape_quotes(cfg.__itemdef[item].field_end);
    }
    code += '";';

    // Replace
    code +=
      'document.getElementsByName("' + itemPrefix + '~replace")[0].value="';
    if (cfg.__itemdef[item].replace != null) {
      code += escape_quotes(cfg.__itemdef[item].replace);
    }
    code += '";';

    // Validate
    code +=
      'document.getElementsByName("' + itemPrefix + '~validate")[0].value="';
    if (cfg.__itemdef[item].validate != null) {
      code += escape_quotes(cfg.__itemdef[item].validate);
    }
    code += '";';

    // Remove
    code +=
      'document.getElementsByName("' + itemPrefix + '~remove")[0].value="';
    if (cfg.__itemdef[item].remove != null) {
      code += escape_quotes(cfg.__itemdef[item].remove);
    }
    code += '";';

    // Reject
    code +=
      'document.getElementsByName("' +
      itemPrefix +
      '~terms_reject")[0].value="';
    if (cfg.__itemdef[item].terms_reject != null) {
      code += escape_quotes(cfg.__itemdef[item].terms_reject);
    }
    code += '";';

    // Reject
    code +=
      'document.getElementsByName("' +
      itemPrefix +
      '~terms_require")[0].value="';
    if (cfg.__itemdef[item].terms_require != null) {
      code += escape_quotes(cfg.__itemdef[item].terms_require);
    }
    code += '";';

    //Var
    code +=
      'document.getElementsByName("' + itemPrefix + '~variable")[0].checked="';
    if (cfg.__itemdef[item].variable) {
      code += "checked";
    }
    code += '";';

    //Arb
    code +=
      'document.getElementsByName("' + itemPrefix + '~arbitrary")[0].checked="';
    if (cfg.__itemdef[item].arbitrary) {
      code += "checked";
    }
    code += '";';
  }

  return code;
}

function paste_harvester() {
  // select active tab
  chrome.tabs.query({ active: true }, function(tabs) {
    var tab = tabs[0];
    chrome.storage.local.get("selected", function(result) {
      // fetch data from storage
      // inject data on active tab
      chrome.tabs.executeScript(tab.id, {
        code: inject_harvester_code(result.selected, tab.url) //consider changing the way tab.url is passed
      });
    });
  });
}
