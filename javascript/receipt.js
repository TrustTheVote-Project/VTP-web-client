// Used exclusively for User Story #3 - receipt.html

// Need the JSON data for just about everything
// Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
var outerJSON = null;
try {
    outerJSON = JSON.parse(receiptJSON);
} catch (e) {
    console.error(e);
}

// Place the ballotCheck in upperSection with the inserted links.
// At the moment there are no buttons, just the three types of links:
// - digests point to the contest-cvr.html page
// - row headers point to the verify-ballot-check.html page
// - column headers point to the tally-election.html page
function createReceiptTable(ballotCheck) {
    const numberOfRows = ballotCheck.length;
    const numberOfColumns = ballotCheck[0].length;
    if (numberOfColumns < 2 || numberOfRows < 2) {
        throw new Error("javascript error: the ballotCheck array is effectively empty");
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
                    headerText = `<th><a  href="tally-election.html?contest=${ballotCheck[0][colIndex].split(' - ', 2)[0]}" target="_blank">${ballotCheck[0][colIndex].split(' - ', 2)[1]}</a></th>`;
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
            const digest = ballotCheck[index][colIndex];
            digests.push(digest);
            innerText += `<td><a target="_blank" class="receiptTD" href="contest-cvr.html?digest=${digest}">${digest}</a></td>`;
        }
        innerText = `<th><a target="_blank" class="receiptTH" href="verify-ballot-check.html?digests=${digests.join(',')}">${index}</a></th>${innerText}`;
        row.innerHTML = innerText;
        table.appendChild(row);
    }
    rootElement.appendChild(table);
}

function eraseRowNumber() {
    const rootElement = document.getElementById("hide");
    rootElement.classList.remove("visible");
    rootElement.classList.add("hidden");
    outerJSON["ballotRow"] = null
}

function setRowNumber(ballotRow) {
    document.getElementById("rowNum").innerText = ballotRow;
}

// Set row number
setRowNumber(outerJSON["ballot_row"]);

// create the table
createReceiptTable(outerJSON["ballot_check"]);

// Erase row number
window.addEventListener("load", function() {
    // loaded
    eraseRowNumber();
    setTimeout(() => {
        setRowNumber(null);
    }, 4000);
}, false);
