/**
 * Grabs SheetDB data and dumps into a single JS file for the HTML page to consume and draw charts from.
 * 
 * Run this without any additional command-line parameters using NodeJS version >=21.
 */
const fs = require('fs');
const path = require('path');
const config = require('../config.js');

const FILE_TO_DUMP = path.resolve(__dirname, '..', 'generated', 'sheetData.js');

/**
 * Grab raw for multiple sheet tabs from Sheet DB only API.
 */
const sheetTabsToData = async (apiKey, tabConfigs, globalVariableName) => {

  let jsCodeBlocksToDump = [];
  let successfullyPreparedTabs = [];

  let finalResult = {};

  let availableKeys = tabConfigs.map((tabConfig) => `'${tabConfig.jsKey}'`).join(", ");
  jsCodeBlocksToDump.push(`/* Content automatically generated with ${path.basename(__filename)} on ${new Date().toString()}.*/`);
  jsCodeBlocksToDump.push(`/* Load this into your main JS file, it will provide a global 'sheetData' object variable with keys: ${availableKeys}. */`);
  jsCodeBlocksToDump.push(`if(typeof sheetData == "undefined") {var sheetData = [];}`);

  return Promise.all(tabConfigs.map(async (tabConfig) => {
    let url = `https://sheetdb.io/api/v1/${apiKey}?sort_by=id&sort_order=desc&limit=0&sheet=${tabConfig.tabId}`;

    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let jsCodeBlock = `/* ${tabConfig.comment(data)} */ ${globalVariableName}["${tabConfig.jsKey}"] = ${JSON.stringify(data)};`;
        jsCodeBlocksToDump.push(jsCodeBlock);
        successfullyPreparedTabs.push(tabConfig.tabId);
      }).catch((error) => {
        console.error(`Failed fetching and preparing data for tab ${tabConfig.tabId} (url: ${url}).`);
        console.error(`Error detail: ${error}`);
      });

  })).then(() => {
    return finalResult = { code: jsCodeBlocksToDump, tabs: successfullyPreparedTabs };
  });
};

/**
 * Dump all aggregated data to outputFileName JS file.
 * 
 * @param object tabConfigs 
 * @param object sheetsData 
 * @param string outputFileName 
 */
const dumpSheetsData = (tabConfigs, sheetsData, outputFileName) => {

  if (sheetsData.code && sheetsData.code.length > 0) {
    let fileContent = sheetsData.code.join("\n\r");
    try {
      fs.writeFileSync(outputFileName, fileContent);
      console.log(`Dumped data for tabs ${sheetsData.tabs.join(", ")} to: ${outputFileName}`);
    } catch (error) {
      console.error(`Failed dumping data for tabs: ${tabConfigs.map((i) => i.tabId).join(", ")}; successfully prepared tabs: ${sheetsData.tabs.join(", ")}; to ${outputFileName}. Details: ${error}`);
    }
  } else {
    console.error("No tabs to dump as JS code!");
  }
}

const main = () => {
  sheetTabsToData(config.API_ID, config.TABS, config.GLOBAL_VARIABLE_NAME).then(
    (sheetsData) => dumpSheetsData(config.TABS, sheetsData, FILE_TO_DUMP)
  );
};

// Command line execution entry point
if (require.main === module) {
  main();
}