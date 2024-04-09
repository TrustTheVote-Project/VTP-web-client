// Used exclusively for User Story #4 - contest-cvr.html
const showContestURL =  "http://127.0.0.1:8000/web-api/show_contest";

// Display the git log with the necessay links
function displayLog(git_log, digestURL) {
    const rootElement = document.getElementById("lowerSection");
    let jsonString = JSON.stringify(git_log, undefined, 2);
    rootElement.appendChild(document.createElement('pre')).innerHTML = syntaxHighlightJSON(jsonString, digestURL, git_log.Log.contestCVR.uid);
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
    addTallyButton(incoming.Log.contestCVR.contest_name, incoming.commit);
}

// To mock or not to mock
if (MOCK_WEBAPI) {
    // Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
    try {
        const git_log = JSON.parse(contestCVRJSON);
    } catch (e) {
        console.error(e);
    }
    main(git_log);
} else {
    // Get the digest parameter
    const urlParams = new URLSearchParams(window.location.search);
    const digest = urlParams.get('digest');
    console.log("fetching the contest CVR for " + digest);
    // Need the JSON data for just about everything.  However, the way to get
    // external json is with a fetch, which is asynchronous.  Which means that
    // 'just about everything' on this page needs to run within the callback to
    // the async function (called only when !MOCK_WEBAPI).
    fetch(showContestURL + "/" + digest)
        .then(response => response.json())
        .then(json => {
            // Access json only inside the `then`
            console.log("retrieved the contest CVR for " + digest);
            console.log("contestCVR: " + json.git_log)
            main(json.git_log);
        })
        .catch(error => console.log("contest CVR fetch returned an error: " + error));
}
