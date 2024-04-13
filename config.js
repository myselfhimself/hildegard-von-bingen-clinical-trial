// Configuration common to the index.html web page and util/grabLatestSheetData.js

const API_ID = 'xggkxm7zt5v0t';

const GLOBAL_VARIABLE_NAME = 'sheetData';

const TABS = [
    {
        tabId: 'SEROLOGYRAW',
        jsKey: 'serology',
        comment: (data) => {
            let lastBloodMarkerDate = data.length > 0 ? data[data.length - 1].Date : "unknown";
            return `Last blood-marker date: ${lastBloodMarkerDate}`;
        }
    },
    {
        tabId: "PERIODSRAW",
        jsKey: 'periods',
        comment: (data) => {
            let lastPeriodEndDate = data.length > 0 ? data[data.length - 1]["End date"] : "unknown";
            return `Last period end date: ${lastPeriodEndDate}`;
        }
    },
    {
        tabId: "EVENTSRAW",
        jsKey: 'events',
        comment: (data) => {
            let lastPeriodEndDate = data.length > 0 ? data[data.length - 1].Date : "unknown";
            return `Last medical event date: ${lastPeriodEndDate}`;
        }
    },
    {
        tabId: "REFERENCERANGESRAW",
        jsKey: 'refRanges',
        comment: (data) => ""
    }
];


// Highly modified from: https://stackoverflow.com/a/21682946
function stringToColor(str) {
    //var alpha = 0.25;
    // var saturation = 100, lightness = 75;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 4) - hash);
        hash = hash & hash;
    }
    // return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%, ${alpha})`;
    // Palettes created with: https://coolors.co/d4dcff-473198-bfcc94-dd1c1a-fc7a57
    const palette = ["dbfe87", "ffe381", "cec288", "6f8695", "1c448e", "54428e", "8963ba", "afe3c0", "90c290", "688b58", "151515", "a63d40", "e9b872", "90a959", "6494aa", "ea638c", "b33c86", "190e4f", "03012c", "002a22"];
    const alpha = "cc";
    return `#${palette[Math.abs(hash) % palette.length] + alpha}`;
}

if (typeof module != "undefined") {
    module.exports = { API_ID, GLOBAL_VARIABLE_NAME, TABS, stringToColor };
}