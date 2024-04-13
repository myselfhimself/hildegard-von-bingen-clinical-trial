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

if (typeof module != "undefined") {
    module.exports = { API_ID, GLOBAL_VARIABLE_NAME, TABS };
}