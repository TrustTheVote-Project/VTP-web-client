// Used exclusively for User Story #3 - receipt.html

// Need the JSON data for just about everything
// Create the receiptObject javascript object from the blankBallotJSON JSON object literal
var receiptObject = null;
try {
    receiptObject = JSON.parse(receiptJSON);
} catch (e) {
    console.error(e);
}

// Place the receiptObject in upperSection with the inserted links.
// At the moment there are no buttons, just the three types of links:
// - digests point to the contest-cvr.html page
// - row headers point to the verify-ballot-check.html page
// - column headers point to the tally-election.html page
function createReceiptTable() {
    const numberOfRows = receiptObject["ballot_check"].length;
    const numberOfColumns = receiptObject["ballot_check"][0].length;
    if (numberOfColumns < 2 || numberOfRows < 2) {
        throw new Error("javascript error: the receiptObject array is effectively empty");
    }
    const rootElement = document.getElementById("lowerSection");
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.innerTest = "Ballot Check";
    table.appendChild(caption);
    table.classList.add("receiptTable");
    for (let index = 0; index < numberOfRows; index++) {
        let row = document.createElement("tr");
        if (index == 0 || (index % 34 == 0)) {
            // table header line
            let innerText = "";
            for (let colIndex = 0; colIndex <  numberOfColumns; colIndex++) {
                let headerText = "";
                if (colIndex == 0) {
                    headerText = `<th>row index</th>`;
                } else {
                    headerText = `<th><a  href="tally-election.html?contest=${receiptObject["ballot_check"][0][colIndex].split(' - ', 2)[0]}" target="_blank">${receiptObject["ballot_check"][0][colIndex].split(' - ', 2)[1]}</a></th>`;
                }
                innerText += headerText;
            }
            row.innerHTML = innerText;
            table.appendChild(row);
            // If this is the first table header, loop
            if (index == 0) {
                continue;
            }
            // if still here, create a new row
            row = document.createElement("tr");
        }
        // normal ballot receipt line
        // First column is a verify-ballot-check.html link
        let innerText = "";
        // The other columns are digest links
        let digests = [];
        for (let colIndex = 1; colIndex <  numberOfColumns; colIndex++) {
            const digest = receiptObject["ballot_check"][index][colIndex];
            digests.push(digest);
            innerText += `<td><a target="_blank" class="receiptTD" href="contest-cvr.html?digest=${digest}">${digest}</a></td>`;
        }
        innerText = `<th><a target="_blank" class="receiptTH" href="verify-ballot-check.html?digests=${digests.join(',')}">${index}</a></th>${innerText}`;
        row.innerHTML = innerText;
        table.appendChild(row);
    }
    rootElement.appendChild(table);
}

function setRowNumber() {
    document.getElementById("rowIndex").innerText = receiptObject["ballot_row"];
}

// Create a function to fade out the element
function fadeOut() {
    const fade = document.getElementById("rowIndex");
    let opacity = 1.0;
    const intervalID = setInterval(function() {
        if (opacity > 0) {
            opacity = opacity - 0.05
            fade.style.opacity = opacity;
            console.log("setInterval fade");
        } else {
            // wipe out the row data
            fade.style.display = 'none';
            fade.innerText = "";
            receiptObject["ballot_row"] = null;
            clearInterval(intervalID);
            console.log("setInterval cleared");
        }
    }, 200);
}
