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
    rootElement.appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(jsonString, digestURL);
}

// go
displayLog(outerJSON, "tally-contest.html");
