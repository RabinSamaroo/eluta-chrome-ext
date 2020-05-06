document
  .getElementById("copy-harvester-btn")
  .addEventListener("click", copy_harvester, false);

document
  .getElementById("paste-harvester-btn")
  .addEventListener("click", paste_harvester, false);

document
  .getElementById("workday-copy")
  .addEventListener("click", workday_copy, false);

document
  .getElementById("ultipro-copy")
  .addEventListener("click", ultipro_copy, false);

  document
  .getElementById("adp-copy")
  .addEventListener("click", adp_copy, false);

var inputURL = document.getElementById("input-url");

function rawHarvester() {
  return JSON.parse(`
{
  "cookie_req": null,
  "__farmerID": null,
  "pager_max": 1,
  "max_row_errors": 0,
  "list_table_number": null,
  "harvester_active": false,
  "item_begin": null,
  "list_begin": null,
  "pager_offset": 1,
  "__cursor": "<elutalib.zopedbapi.zcursor object at 0x7f47d73eb950>",
  "__farmID": 11625,
  "harvester_ts": "2019/08/08 22:30:26.351510 GMT-4",
  "list_page_reject": null,
  "header_idstr": null,
  "list_expect": null,
  "list_parser": "table",
  "harvester_id": 11625,
  "farm_id": 11625,
  "pre_parse_reject": null,
  "list_require": null,
  "harvester_notes": null,
  "pager_url": null,
  "link_pattern": null,
  "ignore_duplicate_urls": false,
  "id_regex": null,
  "harvester_name": "extra testttttttttt",
  "list_end": null,
  "harvester_debug": false,
  "item_parser": "stream",
  "list_columns": null,
  "header_rows": 1,
  "__itemdef": [],
  "list_page_require": null,
  "harvester_update_ts": "2016/01/14 16:10:9.767357 GMT+0",
  "parent_harvester_id": null,
  "list_type": 2,
  "harvester_sync_mode_id": 0,
  "test_pager_url": null,
  "test_url": null,
  "item_end": null,
  "pager_step": 1,
  "url": null,
  "list_filter": null,
  "unique_months": 0,
  "list_reject": null,
  "default_harvester_sync_mode_id": 0
}
`);
}

function rawItem() {
  return JSON.parse(`
    {
      "field_begin": "",
      "terms_require": "",
      "harvester_item_id": 91936,
      "deleted": false,
      "terms_reject": "",
      "harvester_id": 11625,
      "arbitrary": false,
      "remove": "",
      "replace": "",
      "field": "index_text",
      "field_end": "",
      "harvester_field_label": "Description",
      "harvester_field_handled": true,
      "variable": false,
      "position": -2306180,
      "validate": "",
      "harvester_field_id": 5,
      "field_column": null
    }
`);
}

function workday_copy() {
  //get information from input
  raw_url = inputURL.value;
  url = raw_url.match(/https?:\/\/.*?\/.*?\//)[0]; //make this fault tolerent for .com/en-us/external
  pat_url = url + "job/!#!#accept:application/json";
  url =
    "http://127.0.0.1:3333/js/render?url=" +
    url +
    "fs/searchPagination/318c8bb6f553100021d223d9780d30be/";
  pager_url = url + "!#!";
  test_url = url + "0";

  workdayHarv = rawHarvester();
  workdayHarv.test_url = test_url;
  workdayHarv.test_pager_url = pager_url;
  workdayHarv.link_pattern = pat_url;
  workdayHarv.pager_offset = 0;
  workdayHarv.pager_step = 50;
  workdayHarv.jobid_column = 1;
  workdayHarv.joburl_column = 1;
  workdayHarv.id_regex = "job/([^\"']+)";
  workdayHarv.list_parser = "singleregex";
  workdayHarv.pager_max = "SET";

  titleItem = rawItem();
  titleItem.harvester_field_id = 13;
  titleItem.field_begin =
    '"richTextArea.jobPosting.title","propertyName":"None","enabled":false,"text":"';
  titleItem.field_end = '"';
  workdayHarv.__itemdef.push(titleItem);

  locationItem = rawItem();
  locationItem.harvester_field_id = 9;
  locationItem.field_begin = '"iconName":"LOCATION","imageLabel":"';
  locationItem.field_end = '"';
  workdayHarv.__itemdef.push(locationItem);

  descriptionItem = rawItem();
  descriptionItem.harvester_field_id = 5;
  descriptionItem.field_begin =
    'ecid":"richTextArea.jobPosting.jobDescription","propertyName":"None","text":"';
  descriptionItem.field_end = '","value"';
  workdayHarv.__itemdef.push(descriptionItem);

  etypeItem = rawItem();
  etypeItem.harvester_field_id = 27;
  etypeItem.field_begin = ',"iconName":"JOB_TYPE","imageLabel":"';
  etypeItem.field_end = '"';
  workdayHarv.__itemdef.push(etypeItem);

  chrome.storage.local.set({ selected: JSON.stringify(workdayHarv) });
  //alert(JSON.stringify(workdayHarv));
  alert("Copied Workday! Change Page number and reject/require rules");
}

function ultipro_copy() {
  rawURL = inputURL.value;
  rawURL = rawURL.match(/https?:\/\/.*?JobBoard\/.*?\//g)[0];
  test_url = rawURL + "JobBoardView/LoadSearchResults?top=1000";
  patt_url = rawURL + "OpportunityDetail?opportunityId=!#!";

  ultiproHarv = rawHarvester();
  ultiproHarv.test_url = test_url;
  ultiproHarv.link_pattern = patt_url;
  ultiproHarv.jobid_column = 1;
  ultiproHarv.joburl_column = 1;
  ultiproHarv.position_title_column = 2;
  ultiproHarv.location_column = 5;
  ultiproHarv.published_ts_column = 7;
  ultiproHarv.list_parser = "singleregex";
  ultiproHarv.id_regex =
    '(?is)Id": "(.*?)".*?title": "(.*?)".*?requisitionnumber": "(.*?)".*?fulltime": (.*?),.*?city": "(.*?)".*?country.*?code": "(.*?)".*?posteddate": "(.*?)"';

  descriptionItem = rawItem();
  descriptionItem.harvester_field_id = 5;
  descriptionItem.field_begin = `"Description":"`;
  descriptionItem.field_end = `",`;
  descriptionItem.replace = String.raw`\u0026nbsp;=>[[[ ]]]||\u0026ldquo;=>"||\u0026rdquo;=>"||\u0026rsquo;=>'||\u0027=>'||\u0026amp;=>&||\u0026=>[[[ ]]]||\u0022=>[[[ ]]]||\u003E=>>||\u003C=><||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?)\\n=>[[[ ]]]||(?)\\t=>[[[ ]]]||(?)\[\[\[|\]\]\]=>||]]]=>`;
  ultiproHarv.__itemdef.push(descriptionItem);

  etypeItem = rawItem();
  etypeItem.harvester_field_id = 27;
  etypeItem.field_begin = `::column 4::`;
  etypeItem.field_end = `::.`;
  etypeItem.replace = `true=>full-time||false=>part-time`;
  ultiproHarv.__itemdef.push(etypeItem);

  countryItem = rawItem();
  countryItem.harvester_field_id = 8;
  countryItem.field_begin = `::column 6::`;
  countryItem.field_end = `::.`;
  countryItem.terms_require = `CAN`;
  ultiproHarv.__itemdef.push(countryItem);

  chrome.storage.local.set({ selected: JSON.stringify(ultiproHarv) });

  alert("Copied Ultipro! Watch out for internation locations");
}

function adp_copy() {
  //get information from input
  raw_url = inputURL.value + ':';
  cid = raw_url.match(/[&?]cid=(.*?)[&%:]/is)[1];
  ccid = raw_url.match(/ccid=(.*?)[&%:]/is)[1];
  lang = raw_url.match(/lang=(.*?)[&%:]/is)[1];
  console.log(cid);
  console.log(ccid);
  console.log(lang);

  test_url = 'https://workforcenow.adp.com/mascsr/default/careercenter/public/events/staffing/v1/job-requisitions?cid=' + cid + '&ccId=' + ccid + '&lang=' + lang + '&selectedMenuKey=CurrentOpenings&$top=1000';
  pager_url = 'https://workforcenow.adp.com/mascsr/default/careercenter/public/events/staffing/v1/job-requisitions?cid=' + cid + '&ccId=' + ccid + '&lang=' + lang + '&selectedMenuKey=CurrentOpenings&$skip=!#!&$top=1000'
  pat_url = 'http://127.0.0.1:3333/js/render?url=https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html%3Fcid=' + cid + '%26ccid=' + ccid + '%26jobId=!#!%%26lang=' + lang + '%26source=tw&harvester_url=https://workforcenow.adp.com/mascsr/default/careercenter/public/events/staffing/v1/job-requisitions/!#!%3Fcid=' + cid + '%26timeStamp=1547213343340%26lang=' + lang + '%26ccId=' + ccid + '&wait_time=2000'


  adpHarv = rawHarvester();
  adpHarv.test_url = test_url;
  adpHarv.test_pager_url = pager_url;
  adpHarv.link_pattern = pat_url;

  adpHarv.pager_offset = 0;
  adpHarv.pager_step = 20;
  adpHarv.jobid_column = 2;
  adpHarv.joburl_column = 2;
  adpHarv.position_title_column= 1;
  adpHarv.id_regex = String.raw`(?is)"requisitionTitle":"(.*?)".*?"stringValue":"(.*?)"`;
  adpHarv.list_parser = "singleregex";
  adpHarv.pager_max = "SET";

  descItem = rawItem();
  descItem.harvester_field_id = 5;
  descItem.field_begin =
    String.raw`(?)"requisitionDescription":\s*?"`;
  descItem.field_end = String.raw`","requisitionLocations`;
  descItem.replace = String.raw`\u0026nbsp;=>[[[ ]]]||\u0026ldquo;=>"||\u0026rdquo;=>"||\u0026rsquo;=>'||\u0027=>'||\u0026amp;=>&||\u0026=>[[[ ]]]||\u0022=>[[[ ]]]||\u003E=>>||\u003C=><||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?si)<.*?>=>[[[ ]]]||(?)\\n=>[[[ ]]]||(?)\\t=>[[[ ]]]||(?)\[\[\[|\]\]\]=>||]]]=>||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&lt;=><||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?si)&gt;=>>||(?)\\n=>[[[ ]]]||(?)\\t=>[[[ ]]]||(?)\[\[\[|\]\]\]=>||]]]=>||\"=>"||\u003d=>=||quot;=>"||(?is)<span.*?>=>||(?is)<span.*?>=>||(?is)<span.*?>=>||(?is)<p.*?>=>||</div>=>||</div>=>||(?is)<b.*?>=>`
  adpHarv.__itemdef.push(descItem);

  etypeItem = rawItem();
  etypeItem.harvester_field_id = 27;
  etypeItem.field_begin = String.raw`workLevelCode":{"shortName":"`;
  etypeItem.field_end = String.raw`"`;
  etypeItem.arbitrary = true;
  etypeItem.variable = true;
  adpHarv.__itemdef.push(etypeItem);

  locationItem = rawItem();
  locationItem.harvester_field_id = 9;
  locationItem.field_begin = String.raw`(?)"cityName":\s*?"`;
  locationItem.field_end = '"'
  locationItem.arbitrary = true;
  locationItem.variable = true;
  adpHarv.__itemdef.push(locationItem);

  etermItem = rawItem();
  etermItem.harvester_field_id = 28;
  etermItem.field_begin = String.raw`::column 1::`;
  etermItem.field_end = '::.'
  etermItem.arbitrary = true;
  etermItem.variable = true;
  adpHarv.__itemdef.push(etermItem);

  salaryItem = rawItem();
  salaryItem.harvester_field_id = 16;
  salaryItem.field_begin = String.raw`"maximumRate":`;
  salaryItem.field_end = '"'
  salaryItem.arbitrary = true;
  salaryItem.variable = true;
  adpHarv.__itemdef.push(salaryItem);


  chrome.storage.local.set({ selected: JSON.stringify(adpHarv) });
  alert("Copied ADP!");
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
    'document.getElementsByName("test_url")[0].value=String.raw`' +
    cfg.test_url +
    '`;';

  // Def sync
  code +=
    'document.getElementsByName("default_harvester_sync_mode_id")[0].value="' +
    cfg.default_harvester_sync_mode_id +
    '";';

  // Test pager url
  code += 'document.getElementsByName("test_pager_url")[0].value=String.raw`';
  if (cfg.test_pager_url != null) {
    code += cfg.test_pager_url;
  }
  code += '`;';

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
  code += 'document.getElementsByName("id_regex")[0].value=String.raw`';
  if (cfg.id_regex != null) {
    code += cfg.id_regex;
  }
  code += '`;';

  // Pat. URL
  code += 'document.getElementsByName("link_pattern")[0].value=String.raw`';
  if (cfg.link_pattern != null) {
    code += cfg.link_pattern;
  }
  code += '`;';

  // Row Reject
  code += 'document.getElementsByName("list_reject")[0].value=String.raw`';
  if (cfg.list_reject != null) {
    code += cfg.list_reject;
  }
  code += '`;';

  // Row Require
  code += 'document.getElementsByName("list_require")[0].value=String.raw`';
  if (cfg.list_require != null) {
    code += cfg.list_require;
  }
  code += '`;';

  // Page Reject
  code += 'document.getElementsByName("list_page_require")[0].value=String.raw`';
  if (cfg.list_page_require != null) {
    code += cfg.list_page_require;
  }
  code += '`;';

  // Page Require
  code += 'document.getElementsByName("list_page_reject")[0].value=String.raw`';
  if (cfg.list_page_reject != null) {
    code += cfg.list_page_reject;
  }
  code += '`;';

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
  code += 'document.getElementsByName("pre_parse_reject")[0].value=String.raw`';
  if (cfg.pre_parse_reject != null) {
    code += cfg.pre_parse_reject;
  }
  code += '`;';

  // Cookie URL
  code += 'document.getElementsByName("cookie_req")[0].value=String.raw`';
  if (cfg.cookie_req != null) {
    code += cfg.cookie_req;
  }
  code += '`;';

  // Item Begin
  code += 'document.getElementsByName("item_begin")[0].value=String.raw`';
  if (cfg.item_begin != null) {
    code += cfg.item_begin;
  }
  code += '`;';

  // Item End
  code += 'document.getElementsByName("item_end")[0].value=String.raw`';
  if (cfg.item_end != null) {
    code += cfg.item_end;
  }
  code += '`;';

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
    code += 'document.getElementsByName("' + itemPrefix + '~begin")[0].value=String.raw`';
    if (cfg.__itemdef[item].field_begin != null) {
      code += cfg.__itemdef[item].field_begin;
    }
    code += '`;';

    // End
    code += 'document.getElementsByName("' + itemPrefix + '~end")[0].value=String.raw`';
    if (cfg.__itemdef[item].field_end != null) {
      code += cfg.__itemdef[item].field_end;
    }
    code += '`;';

    // Replace
    code +=
      'document.getElementsByName("' +
      itemPrefix +
      '~replace")[0].value=String.raw`';
    if (cfg.__itemdef[item].replace != null) {
      code += cfg.__itemdef[item].replace;
    }
    code += "`;";

    // Validate
    code +=
      'document.getElementsByName("' + itemPrefix + '~validate")[0].value=String.raw`';
    if (cfg.__itemdef[item].validate != null) {
      code += cfg.__itemdef[item].validate;
    }
    code += '`;';

    // Remove
    code +=
      'document.getElementsByName("' + itemPrefix + '~remove")[0].value=String.raw`';
    if (cfg.__itemdef[item].remove != null) {
      code += cfg.__itemdef[item].remove;
    }
    code += '`;';

    // Reject
    code +=
      'document.getElementsByName("' +
      itemPrefix +
      '~terms_reject")[0].value=String.raw`';
    if (cfg.__itemdef[item].terms_reject != null) {
      code += cfg.__itemdef[item].terms_reject;
    }
    code += '`;';

    // Reject
    code +=
      'document.getElementsByName("' +
      itemPrefix +
      '~terms_require")[0].value=String.raw`';
    if (cfg.__itemdef[item].terms_require != null) {
      code += cfg.__itemdef[item].terms_require;
    }
    code += '`;';

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
  console.log(code);
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
        alert("Copied Page!");
      }
    );
  });
}
