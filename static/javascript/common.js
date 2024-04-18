// Some global constants
const MOCK_WEBAPI = false;
const MOCK_GUID = "01d963fd74100ee3f36428740a8efd8afd781839";

// Color JSON strings
function syntaxHighlightJSON(vote_store_id, jsonString, digestURL=null, contestNumber=null) {
    let newString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    newString = newString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'JSONnumber';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'JSONkey';
            } else {
                cls = 'JSONstring';
                // Handle digest links
                if (digestURL && contestNumber && match) {
                    //
                    let newMatch = match;
                    let link_p = false;
                    newMatch = newMatch.replace(/([a-fA-F0-9]{40})/g, function (match) {
                        link_p = true;
                        return `<a target="_blank" href=${digestURL}?vote_store_id=${vote_store_id}&contests=${contestNumber}&digests=${match}>${match}</a>`;
                    });
                    if (link_p) {
                        return newMatch;
                    }
                    return `<span class=${cls}>${newMatch}</span>`;
                }
            }
        } else if (/true|false/.test(match)) {
            cls = 'JSONboolean';
        } else if (/null/.test(match)) {
            cls = 'JSONnull';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
    return newString;
}

// Color STDOUT log strings, which is passed as an array of strings (one per line)
function syntaxHighlightStdout(vote_store_id, jsonArray, digestURL=null, tallyURL=null) {
    // Handle digest links
    let newOutput = []
    for (let line of jsonArray) {
        let newLine = line;
        let digest = false;
        // Convert digests to hrefs
        newLine = newLine.replace(/\b([a-fA-F0-9]{40})\b/, function (match) {
            digest = match;
            return `<a target="_blank" href=${digestURL}?vote_store_id=${vote_store_id}&digest=${digest}>${digest}</a>`;
        });
        // Convert contest uids to hrefs
        if (digest) {
            newLine = newLine.replace(/\b([0-9]{4}\b)/, function (match) {
                return `<a target="_blank" href=${tallyURL}?vote_store_id=${vote_store_id}&contests=${match}&digests=${digest}>${match}</a>`;
            });
        }
        // Handle GOOD and BAD lines
        if (line.match(/^\[GOOD\]/) || line == "*".repeat(12)) {
            newLine = `<span class=good>${newLine}</span>`;
        }
        if (line.match(/^\[ERROR\]/) || line == "#".repeat(12)) {
            newLine = `<span class=error>${newLine}</span>`;
        }
        if (line.match(/^\[WARNING\]/) || line == "=".repeat(12)) {
            newLine = `<span class=warning>${newLine}</span>`;
        }
        // Handle text based horizontal lines
        newLine = newLine.replace(/^(-)+/, function (match) {
            return `<span class=warning>${newLine}</span>`;
        });
        // Handle leading spaces
        newLine = newLine.replace(/^( )+/, function (match) {
            return `${"&nbsp;".repeat(match.length)}`;
        });
        // Save
        newOutput.push(newLine);
    };
    return newOutput.join("<br>");
}

// Display the receipt:
// Place the ballotCheck in upperSection with the inserted links.
// - digests point to the show-contest.html page
// - row headers point to the verify-ballot-row.html page
// - column headers point to the tally-contests.html page
function createReceiptTable(ballotCheckObject, vote_store_id) {
    const ballotCheck = ballotCheckObject.ballot_check;
    const numberOfRows = ballotCheck.length;
    const numberOfColumns = ballotCheck[0].length;
    if (numberOfColumns < 2 || numberOfRows < 2) {
        throw new Error("javascript error: the ballot check is effectively empty");
    }
    const rootElement = document.getElementById("lowerSection");

    // Create the ballot check table
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
                let headerText = `<th><a  href="tally-contests.html?vote_store_id=${vote_store_id}&contests=${ballotCheck[0][colIndex].split(' - ', 2)[0]}" target="_blank">${ballotCheck[0][colIndex].split(' - ', 2)[1]}</a></th>`;
                if (colIndex == 0) {
                    headerText = `<th>row index</th>` + headerText;
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
        // First column is a verify-ballot-row.html link
        let innerText = "";
        // The other columns are digest links
        let digests = [];
        let uids = [];
        for (let colIndex = 0; colIndex <  numberOfColumns; colIndex++) {
            const digest = ballotCheck[index][colIndex];
            const uid = ballotCheck[0][colIndex].match(/^\d{4}/);
            digests.push(digest);
            uids.push(uid);
            innerText += `<td><a target="_blank" class="receiptTD" href="show-contest.html?vote_store_id=${vote_store_id}&digest=${digest}">${digest}</a></td>`;
        }
        innerText = `<th><a target="_blank" class="receiptTH" href="verify-ballot-row.html?vote_store_id=${vote_store_id}&uids=${uids.join(',')}&digests=${digests.join(',')}">${index}</a></th>${innerText}`;
        row.innerHTML = innerText;
        table.appendChild(row);
    }
    rootElement.appendChild(table);
}
