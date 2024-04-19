// Used exclusively for User Story #4 - contest-cvr.html
const showContestURL =  window.location.origin + "/web-api/show_versioned_receipt";

// To mock or not to mock
if (MOCK_WEBAPI) {
    // Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
    try {
        const stdoutTextArray = JSON.parse(receiptJSON);
    } catch (e) {
        console.error(e);
    }
    createReceiptTable(stdoutTextArray, MOCK_GUID)
} else {
    // Get the digest parameter
    const urlParams = new URLSearchParams(window.location.search);
    const vote_store_id = urlParams.get('vote_store_id');
    const digest = urlParams.get('digest');
    console.log("fetching the versioned ballot receipt for " + digest);
    // Need the JSON data for just about everything.  However, the way to get
    // external json is with a fetch, which is asynchronous.  Which means that
    // 'just about everything' on this page needs to run within the callback to
    // the async function (called only when !MOCK_WEBAPI).
    fetch(showContestURL + "/" + vote_store_id + "/" + digest)
        .then(response => response.json())
        .then(json => {
            // Access json only inside the `then`
            if (json.webapi_error) {
                throw new Error(json.error);
            }
            console.log("retrieved the versioned ballot receipt for " + digest);
            // pass the inner array of STDOUT
            createReceiptTable(json, vote_store_id)
        })
        .catch(error => console.log("versioned receipt fetch returned an error: " + error));
}
