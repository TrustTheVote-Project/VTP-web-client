// Used exclusively for User Story #4 - contest-cvr.html

// Need the JSON data for just about everything
// Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
var outerJSON = null;
try {
    outerJSON = JSON.parse(verifyBallotJSON);
} catch (e) {
    console.error(e);
}

// Display the git log with the necessay links
function displayStdout(verifyBallot, digestURL, tallyURL) {
    const rootElement = document.getElementById("lowerSection");
    let jsonString = JSON.stringify(verifyBallot, undefined, 2);
    let paragraph = document.createElement('p');
    paragraph.innerHTML = syntaxHighlightVerify(verifyBallot, digestURL, tallyURL);
    rootElement.appendChild(paragraph);
}

// Display the STDOUT linking digests to contest-cvr.html
// and contest names to tally-contest.html
displayStdout(outerJSON, "contest-cvr.html", "tally-contest.html");
