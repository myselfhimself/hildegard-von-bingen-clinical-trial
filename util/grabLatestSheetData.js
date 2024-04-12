// Run this with node.js in a console
const fs = require('fs');
const path = require('path');

const FILE_TO_DUMP = path.resolve(__dirname, '..', 'sheetData.js');

const API_ID = 'xggkxm7zt5v0t';

const TABS = [
  {
    tabId: 'SEROLOGYRAW',
    comment: (data) => {
      let lastBloodMarkerDate = data.length > 0 ? data[data.length - 1]?.Date : "unknown";
      return `Last blood-marker date: ${lastBloodMarkerDate}`;
    }
  },
  {
    tabId: "PERIODSRAW",
    comment: (data) => {
      let lastPeriodEndDate = data.length > 0 ? data[data.length - 1]?.["End date"] : "unknown";
      return `Last period end date: ${lastPeriodEndDate}`;
    }
  }
];

// Credit: https://medium.com/@jmatix/wonderful-one-liners-in-js-part-i-1ed6eb1d1da4
const sheetTabNameToMachineName = (str) => str.toLowerCase().replace(/_+(.)/g, (m, g1) => { return g1.toUpperCase() });

const sheetTabsToData = async (apiKey, tabConfigs) => {

  let jsCodeBlocksToDump = [];
  let successfullyPreparedTabs = [];

  let finalResult = {};

  return Promise.all(tabConfigs.map(async (tabConfig) => {
    let url = `https://sheetdb.io/api/v1/${apiKey}?sort_by=id&sort_order=desc&limit=0&sheet=${tabConfig.tabId}`;

    return await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let globalVariableName = sheetTabNameToMachineName(tabConfig.tabId);
        let jsCodeBlock = `/* ${tabConfig.comment(data)} */ var ${globalVariableName} = ${JSON.stringify(data)};`;
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

if (require.main === module) {
  sheetTabsToData(API_ID, TABS).then((sheetsData) => dumpSheetsData(TABS, sheetsData, FILE_TO_DUMP));
}