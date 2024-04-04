// Used exclusively for User Story #4 - contest-cvr.html

// Need the JSON data for just about everything
// Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
var outerJSON = null;
try {
    outerJSON = JSON.parse(contestCVRJSON);
} catch (e) {
    console.error(e);
}

// Display the git log with the necessay links
function displayLog(contestCVR, digestURL) {
    const rootElement = document.getElementById("lowerSection");
    let jsonString = JSON.stringify(contestCVR, undefined, 2);
    rootElement.appendChild(document.createElement('pre')).innerHTML = syntaxHighlightJSON(jsonString, digestURL, contestCVR.Log.contestCVR.uid);
}

// Adds an explicit tally button
function addTallyButton(contest, digest) {
    const rootElement = document.getElementById("upperSection");
    const tallyButton = document.createElement("button");
    tallyButton.innerText = "Tally Contest";
    tallyButton.id = "tallyContest";
    // add an event listener to the button
    tallyButton.addEventListener("click", function (e) {
        console.log("Running 'Tally Contest' button");
        window.open(`tally-contests.html?contest=${contest}&digests=${digest}`, "_blank").focus();
    });
    const table = document.createElement("table");
    table.classList.add("tableStyle");
    const row = document.createElement("tr");
    const col = document.createElement("td");
    col.innerHTML = "&nbsp&nbsp";
    col.appendChild(tallyButton);
    row.appendChild(col);
    table.appendChild(row);
    rootElement.appendChild(table);
}

// Get the git log
displayLog(outerJSON, "tally-contest.html");

// Add a button
addTallyButton(outerJSON.Log.contestCVR.uid, outerJSON.commit);
