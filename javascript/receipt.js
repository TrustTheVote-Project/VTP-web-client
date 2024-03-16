// Used exclusively for User Story #3 - receipt.html

// Need the JSON data for just about everything
// Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
var ballotCheck = null;
try {
    ballotCheck = JSON.parse(ballotCheckJSON);
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
    for (let index = 0; index < numberOfRows; index++) {
        let row = document.createElement("tr");
        if (index == 0 || (index % 34 == 0)) {
            // table header line
            for (let colIndex = 0; colIndex <  numberOfColumns; colIndex++) {
                const tableHeader = document.createElement("th");
                const anchor =  document.createElement("a");
                const contest = "ZZZ";
                anchor.setAttribute("href", "tally-election.html?contest=" + contest);
                anchor.setAttribute("target", "_blank");
                anchor.appendChild(document.createTextNode(ballotCheck[0][colIndex]));
                tableHeader.appendChild(anchor);
                row.appendChild(tableHeader);
            }
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
        const td = document.createElement("td");
        const rowHeader = document.createElement("a");
        rowHeader.setAttribute("target", "_blank");
        rowHeader.appendChild(document.createTextNode(index));
        td.appendChild(rowHeader);
        row.appendChild(td);
        // The other columns are digest links
        let digests = [];
        for (let colIndex = 1; colIndex <  numberOfColumns; colIndex++) {
            const digest = ballotCheck[index][colIndex];
            const td = document.createElement("td");
            const anchor =  document.createElement("a");
            digests.push(digest);
            anchor.setAttribute("href", "contest-cvr.html?digest=" + digest);
            anchor.setAttribute("target", "_blank");
            anchor.appendChild(document.createTextNode(digest));
            td.appendChild(anchor);
            row.appendChild(td);
        }
        rowHeader.setAttribute("href", "verify-ballot-check.html?digests=" + digests.join(","));
        table.appendChild(row);
    }
    rootElement.appendChild(table);
}

// create the table
createReceiptTable(ballotCheck);
