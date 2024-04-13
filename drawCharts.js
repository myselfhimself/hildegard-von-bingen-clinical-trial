
function sheetTabNameToMachineName(str) {
    return str.toLowerCase().replace(/_+(.)/g, (m, g1) => { return g1.toUpperCase() });
}

if (typeof sheetData == "undefined") {
    alert("Missing sheetData, sheetData.js most probably could not load!");
    var sheetData = [];
}
function refreshDataForTab(tabName) {
    SheetDB.read("https://sheetdb.io/api/v1/" + SHEET_DB_TOKEN, {
        sheet: tabName,
        limit: 0,
    }).then(
        function (result) {
            var safeTabName = sheetTabNameToMachineName(tabName);
            sheetData[safeTabName] = result;
            console.log("retrieved online data: " + safeTabName + ": " + sheetData[safeTabName]);
        },
        function (error) {
            console.log(error);
        }
    );
}

function refreshDataAndRedrawAll() {
    SHEET_DB_TAB_NAMES.map(refreshDataForTab);
    drawAllCharts();
}

var normals = {
    "AFP (ng/mL)": { bounds: [["<", 10]], unit: "ng/mL" },
    "HCG intact (alpha+beta) (mUI/mL)": {
        bounds: [["<", 2.7]],
        unit: "mUI/mL",
    },
    "LDH (UI/L)": {
        bounds: [["<", 246]],
        unit: "UI/L",
    },
    "FSH (UI/L)": {
        bounds: [["<", 19.3]],
        unit: "UI/L",
    },
    "LH (UI/L)": {
        bounds: [["<", 8.6]],
        unit: "UI/L",
    },
    "bHCG (ng/mL)": {
        bounds: [["<", 0.1]],
        unit: "UI/L",
    },
    "Testosterone (ng/mL)": {
        bounds: [
            [">", 2.5],
            ["<", 10],
        ],
        unit: "UI/L",
    }, // https://www.lab-cerba.com/files/live/sites/Cerba/files/documents/FR/0489F.pdf
    "Cholesterol (mmol/L)": {
        bounds: [["<", 5.17]],
        unit: "UI/L",
    }, // https://www.uptodate.com/contents/high-cholesterol-and-lipids-beyond-the-basics/print
};

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

    // Transform serology raw data for marker before display
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

    // Draw blood marker normal value horizontal lines
    var annotationLineId = 0;
    normals[markerName].bounds.forEach(function (bound) {
        allGraphAnnotations["normalLine" + annotationLineId++] = {
            type: "line",
            yMin: bound[1],
            yMax: bound[1],
            label: {
                display: true,
                content:
                    "Normal " + bound.join(" ") + " " + normals[markerName].unit,
            },
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 2,
        };
    });

    // Draw medical events vertical lines
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

    // Draw graph for the current blood marker, with medical events and normal bars
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