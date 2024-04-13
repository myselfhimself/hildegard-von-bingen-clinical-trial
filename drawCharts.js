/**
 * Drawing of all charts.
 * 
 * You MUST load config.js first to benefit from the latter's global variables.
 */

if (typeof sheetData == "undefined") {
    alert("Missing sheetData, sheetData.js most probably could not load!");
    var sheetData = [];
}
function refreshDataForTab(tabConfig) {
    SheetDB.read("https://sheetdb.io/api/v1/" + API_ID, {
        sheet: tabConfig.tabId,
        limit: 0,
    }).then(
        function (result) {
            var safeTabName = tabConfig.jsKey;
            sheetData[safeTabName] = result;
            console.log("retrieved online data: " + safeTabName + ": " + sheetData[safeTabName]);
        },
        function (error) {
            console.log(error);
        }
    );
}

function refreshDataAndRedrawAll() {
    TABS.map(refreshDataForTab);
    drawAllCharts();
}

Chart.register(ChartDataLabels);

const zoomOptions = {
    pan: {
        enabled: true,
        mode: "xy",
        modifierKey: "ctrl",
    },
    zoom: {
        mode: "xy",
        drag: {
            enabled: true,
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 1,
            backgroundColor: "rgba(54, 162, 235, 0.3)",
        },
    },
};

var chartObjects = [];

function drawChart(markerName) {
    console.log("drawing" + markerName);

    // Draw serology as lines
    var chartData = {
        labels: sheetData.serology.map(function (value) {
            return value.Date;
        }),
        datasets: [
            {
                label: markerName,
                fillColor: "transparent", //"#79D1CF",
                strokeColor: "#79D1CF",
                data: sheetData.serology.map(function (value) {
                    let i = value[markerName];
                    return i == "" ? null : i;
                }),
            },
        ],
    };
    var newCanvas = document.createElement("canvas");
    newCanvas.id = markerName;
    newCanvas.className = "lineChart";
    document.getElementById("allCharts").appendChild(newCanvas);
    var ctx = newCanvas.getContext("2d");
    var allGraphAnnotations = {};

    // Draw blood marker normal values (aka. reference ranges) horizontal lines
    var annotationLineId = 0;
    console.log("grabbing refrange for marker " + markerName);
    var markerRefRange = sheetData.refRanges.find(function (refRange) { return refRange.Marker == markerName;});
    ["Upper", "Lower"].forEach(function (bound) {
        // Skip empty bound
        if(markerRefRange[bound + " bound"].trim().length == 0) { return; }
        // Draw non-empty bound
        allGraphAnnotations["refRangeLine" + markerName + annotationLineId++] = {
            type: "line",
            yMin: markerRefRange[bound + " bound"],
            yMax: markerRefRange[bound + " bound"],
            label: {
                display: true,
                content:
                    "Normal " + markerRefRange[bound + " comparison"] + " " + markerRefRange[bound + " bound"] + " " + markerRefRange.Unit,
            },
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 2,
        };
    });

    // Draw clinical periods' boxes (areas) annotations
    var annotationLineId = 0;
    sheetData.periods.forEach(function (period) {
        console.log("Drawing period box for: " + period.ID);
        allGraphAnnotations["periodBox" + annotationLineId++] = {
            type: "box",
            drawTime: "beforeDatasetsDraw",
            backgroundColor: 'rgba(255, 99, 132, 0.25)',
            xMin: period["Start date"],
            xMax: period["End date"],
            label: {
                display: true,
                position: "center",
                content: period.ID
            },
            // borderColor: "rgb(99, 99, 132, 0.5)",
            // borderWidth: 10,
        };
    });

    // Draw medical events vertical lines annotations
    annotationLineId = 0;
    sheetData.events.forEach(function (medicalEvent) {
        allGraphAnnotations["medicalEventLine" + annotationLineId++] = {
            type: "line",
            drawTime: "afterDatasetsDraw",
            xMin: medicalEvent.Date,
            xMax: medicalEvent.Date,
            mode: "vertical",
            label: {
                display: true,
                content: medicalEvent.Name,
                rotation: 90
            },
            borderColor: "rgb(99, 99, 132, 0.5)",
            borderWidth: 10,
        };
    });

    console.log(allGraphAnnotations);

    // Draw graph for the current blood marker, with medical events, period areas and normal bars
    var newChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "line",
        data: chartData,
        options: {
            spanGaps: false,
            showTooltips: true,
            responsive: true,
            plugins: {
                zoom: zoomOptions,
                datalabels: {
                    color: "#202328",
                    font: {
                        weight: "bold",
                    },
                    clamp: true,
                    align: "top"
                },
                annotation: {
                    annotations: allGraphAnnotations,
                },
            },
        },
    });
    chartObjects.push(newChart);
    var newControls = document.createElement("div");
    newControls.className = "controls";
    var newResetZoomButton = document.createElement("button");
    newResetZoomButton.innerHTML = "Reset zoom";
    newResetZoomButton.onclick = function () {
        newChart.resetZoom();
    };
    var newZoomDragHint = document.createElement("p");
    newZoomDragHint.innerText = "Drag to zoom, CTRL to pan.";
    newControls.appendChild(newResetZoomButton);
    newControls.appendChild(newZoomDragHint);
    newCanvas.after(newControls);
}

function drawAllCharts() {
    // First reset all drawn charts and pre-computed graphs
    document.getElementById("allCharts").replaceChildren();
    while (chartObjects.length) {
        chartObjects.pop();
    }

    // Then compute and draw all charts again
    Object.keys(sheetData.serology[0]).forEach(function (value) {
        if (!["Date", "Comment", "Laboratory"].includes(value)) {
            drawChart(value);
        }
    });
}

//drawChart("AFP (ng/mL)");
drawAllCharts();

if (window.location.hash == "#refresh") {
    refreshDataAndRedrawAll();
}