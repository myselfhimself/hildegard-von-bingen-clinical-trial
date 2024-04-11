// Run this with node.js
const fs = require('fs');

const API_ID = 'xggkxm7zt5v0t';

const SHEET_ID = 'SEROLOGYRAW';

const FILE_TO_DUMP = '../sheetData.js';

const url = `https://sheetdb.io/api/v1/${API_ID}?sort_by=id&sort_order=desc&limit=0&sheet=${SHEET_ID}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    let lastBloodMarkerDate = data[data.length - 1].Date;
    let fileContent = `/* Last blood-marker date: ${lastBloodMarkerDate} */ var sheetData = ${JSON.stringify(data)};`;
    fs.writeFileSync(FILE_TO_DUMP, fileContent);
    console.log(`Dumped blood markers data to: ${FILE_TO_DUMP}`);
  }).catch((error) => {
    console.log(`Failed dumping blood markers data to: ${FILE_TO_DUMP}`);
    console.log(`Error detail: ${error}`);
  });
