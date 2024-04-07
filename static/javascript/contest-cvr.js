// Used exclusively for User Story #4 - contest-cvr.html
const contestCvrURL =  "http://127.0.0.1:8000/show_contest_cvr";

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

// ################
// __main__
// ################
function main(incoming) {
    // Get the git log
    displayLog(incoming, "tally-contest.html");
    // Add a button
    addTallyButton(incoming.Log.contestCVR.uid, incoming.commit);
}

// To mock or not to mock
if (MOCK_WEBAPI) {
    // Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
    try {
        const incoming = JSON.parse(contestCVRJSON);
    } catch (e) {
        console.error(e);
    }
    main(incoming.contestCVRJSON);
} else {
    console.log("fetching a contest CVR");
    // Need the JSON data for just about everything.  However, the way to get
    // external json is with a fetch, which is asynchronous.  Which means that
    // 'just about everything' on this page needs to run within the callback to
    // the async function (called only when !MOCK_WEBAPI).
    fetch(contestCVRJSON)
        .then(response => response.json())
        .then(json => {
            // Access json only inside the `then`
            console.log("retrieved the contest CVR");
            main(json.git_log);
        })
        .catch(error => console.log("contest CVR fetch returned an error: " + error));
}
