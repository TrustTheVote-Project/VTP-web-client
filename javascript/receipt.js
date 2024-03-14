// Used exclusively for User Story #3 - receipt.html

// Need the JSON data for just about everything
// Create the ballotCheck javascript object from the blankBallotJSON JSON object literal
var ballotCheck = null;
try {
    ballotCheck = JSON.parse(ballotCheckJSON);
} catch (e) {
    console.error(e);
}

