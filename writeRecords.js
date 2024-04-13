function asColorSpans(periodAsCodeStr) {
    return periodAsCodeStr.split("\n").sort().map(function (code) {
        let treatmentDecomposed = code.split("x");
        let countSuffix = treatmentDecomposed.length == 2 ? "x" + treatmentDecomposed[1] : "";
        return `<span style="border: 1px solid black; border-radius: 4px; padding: 3px 3px; background: ${stringToColor(treatmentDecomposed[0])};">${treatmentDecomposed[0]}</span>${countSuffix}`;
    }).join("&nbsp;");
}

var periodsContent = sheetData.periods.map(function (period) {
    return `<div id="${period.ID}" class="periodDescription" style="background: ${stringToColor(period.ID)}">
    <h5><strong>${period.ID}</strong>: ${period["Start date"]} to ${period["End date"]}</h5>
    <h6>Treatments as code: ${asColorSpans(period["Period as code"])}</h6>
    <h6>Treatments</h6>
    <ul>${period["Period description"].split("\n").map(function (desc) { return `<li>${desc.replace(/^- /, "")}</li>` }).join("")}</ul>
    </div>`;
}
).join("\n");

var periodsElement = document.getElementById("periods");
periodsElement.insertAdjacentHTML("beforeEnd", periodsContent);