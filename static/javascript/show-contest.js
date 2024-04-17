// Used exclusively for User Story #4 - contest-cvr.html
const showContestURL =  "http://127.0.0.1:8000/web-api/show_contest";

// Display the git log with the necessay links
function displayLog(vote_store_id, git_log, digestURL) {
    const rootElement = document.getElementById("lowerSection");
    let jsonString = JSON.stringify(git_log, undefined, 2);
    rootElement.appendChild(document.createElement('pre')).innerHTML = syntaxHighlightJSON(vote_store_id, jsonString, digestURL, git_log.Log.contestCVR.uid);
}

// Adds an explicit tally button
function addTallyButtons(vote_store_id, contestUID, digest) {
    const rootElement = document.getElementById("upperSection");
    const tallyButtonBrief = document.createElement("button");
    const tallyButtonDetails = document.createElement("button");
    tallyButtonBrief.innerText = "Tally Contest";
    tallyButtonBrief.id = "tallyContest";
    tallyButtonDetails.innerText = "Tally Contest (with details)";
    tallyButtonDetails.id = "tallyContestDetails";
    // add event listeners to the buttons
    tallyButtonBrief.addEventListener("click", function (e) {
        console.log("Running 'Tally Contest (brief)' button");
        window.open(`tally-contests.html?vote_store_id=${vote_store_id}&contests=${contestUID}&digests=${digest}&verbosity=3`, "_blank").focus();
    });
    tallyButtonDetails.addEventListener("click", function (e) {
        console.log("Running 'Tally Contest (details)' button");
        window.open(`tally-contests.html?vote_store_id=${vote_store_id}&contests=${contestUID}&digests=${digest}&verbosity=4`, "_blank").focus();
    });
    const table = document.createElement("table");
    table.classList.add("tableStyle");
    const row = document.createElement("tr");
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    col1.innerHTML = "&nbsp&nbsp";
    col1.appendChild(tallyButtonBrief);
    col2.innerHTML = "&nbsp&nbsp";
    col2.appendChild(tallyButtonDetails);
    row.appendChild(col1);
    row.appendChild(col2);
    table.appendChild(row);
    rootElement.appendChild(table);
}

// ################
// __main__
// ################
function main(vote_store_id, incoming) {
    // Get the git log
    displayLog(vote_store_id, incoming, "tally-contests.html");
    // Add a button
    addTallyButtons(vote_store_id, incoming.Log.contestCVR.uid, incoming.commit);
}

// To mock or not to mock
if (MOCK_WEBAPI) {
    // Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
    try {
        const git_log = JSON.parse(contestCVRJSON);
    } catch (e) {
        console.error(e);
    }
    main(MOCK_GUID, git_log);
} else {
    // Get the digest parameter
    const urlParams = new URLSearchParams(window.location.search);
    const vote_store_id = urlParams.get('vote_store_id');
    const digest = urlParams.get('digest');
    console.log("fetching the contest CVR for " + digest);
    // Need the JSON data for just about everything.  However, the way to get
    // external json is with a fetch, which is asynchronous.  Which means that
    // 'just about everything' on this page needs to run within the callback to
    // the async function (called only when !MOCK_WEBAPI).
    fetch(showContestURL + "/" + vote_store_id + "/" + digest)
        .then(response => response.json())
        .then(json => {
            // Access json only inside the `then`
            if (json.webapi_error) {
                throw new Error(json.webapi_error);
            }
            console.log("retrieved the contest CVR for " + digest);
            console.log("contestCVR: " + json.git_log.Log)
            main(vote_store_id, json.git_log);
        })
        .catch(error => console.log("contest CVR fetch returned an error: " + error));
}
