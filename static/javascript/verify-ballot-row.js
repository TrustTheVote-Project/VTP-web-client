// Used exclusively for User Story #5 - verify-ballot.html
const verifyBallotRowURL =  "http://127.0.0.1:8000/web-api/verify_ballot_row";

// Display the git log with the necessay links
function displayStdout(stdoutTextArray, digestURL, tallyURL) {
    const rootElement = document.getElementById("lowerSection");
    let jsonString = JSON.stringify(stdoutTextArray, undefined, 2);
    let paragraph = document.createElement('p');
    paragraph.innerHTML = syntaxHighlightStdout(stdoutTextArray, digestURL, tallyURL);
    rootElement.appendChild(paragraph);
}

// ################
// __main__
// ################
function main(stdoutTextArray) {
    // Display the STDOUT linking digests to show-contest.html
    // and contest names to tally-contests.html
    displayStdout(stdoutTextArray, "show-contest.html", "tally-contests.html");
}

// To mock or not to mock
if (MOCK_WEBAPI) {
    // Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
    try {
        const stdoutText = JSON.parse(verifyOutputJSON);
    } catch (e) {
        console.error(e);
    }
    main(stdoutText);
} else {
    // Get the comma separated contests and digests parameters
    const urlParams = new URLSearchParams(window.location.search);
    const uids = urlParams.get('uids');
    const digests = urlParams.get('digests');
    console.log("fetching the verify-ballot output for digest(s) " + digests);
    // Need the JSON data for just about everything.  However, the way to get
    // external json is with a fetch, which is asynchronous.  Which means that
    // 'just about everything' on this page needs to run within the callback to
    // the async function (called only when !MOCK_WEBAPI).
    let url = verifyBallotRowURL + "/" + uids + "/" + digests;
    fetch(url)
        .then(response => response.json())
        .then(json => {
            // Access json only inside the `then`
            console.log("retrieved the validation for digest(s) " + digests);
            main(json.verify_ballot_stdout);
        })
        .catch(error => console.log("verify_ballot_row web-api fetch returned an error: " + error));
}

