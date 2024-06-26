// Used exclusively for User Story #2 - voting.html

// Note - for the moment let these be globals (until we know more).
// Regardless, the upper/lower setup will make sure choiceList and
// sortableList are already defined.
var choiceList = null;
var sortableList = null;
var removeButtons = null;
var keydownEL = false;
// Don't know how to implement a closure or equivilent yet - this is a global
// to store how many choices have been so far selected in a RCV contest.
var selectedCount = 0;
var listOfContests = [];
var numberOfContests = 0;
// A global to store the actual incoming blank ballot
var blankBallot = null;
var vote_store_id = null;

// Various constants
const selectBackgroundColor = "#f5f5f5";
const extraSpace = "&nbsp&nbsp";
const getBlankBallotURL = window.location.origin + "/web-api/get_blank_ballot";
const castBallotURL = window.location.origin + "/web-api/cast_ballot";

// Define a YouAreThere inline glyph
const yrhIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
yrhIcon.setAttribute("width", "20");
yrhIcon.setAttribute("height", "20");
yrhIcon.setAttribute("viewBox", "0 0 32 32");
yrhIcon.setAttribute("fill", "currentColor");
yrhIcon.setAttribute("color", "black");
yrhIcon.innerHTML = `<path d="M26.221 16c0-7.243-5.871-13.113-13.113-13.113s-13.113 5.87-13.113 13.113c0 7.242 5.871 13.113 13.113 13.113s13.113-5.871 13.113-13.113zM1.045 16c0-6.652 5.412-12.064 12.064-12.064s12.064 5.412 12.064 12.064c0 6.652-5.411 12.064-12.064 12.064-6.652 0-12.064-5.412-12.064-12.064z"></path><path d="M18.746 15.204l0.742-0.742-6.379-6.379-6.378 6.379 0.742 0.742 5.112-5.112v12.727h1.049v-12.727z"></path>`;

// Will set up the progress bars with numberOfContests contests
// NOTE - the printed/user-visible contest numbers are 1 based while
// everything else (the backend, internal, etc) is 0 based.
function setupProgressBars(numberOfContests) {
    const progBarElement = document.getElementById("progressBar");
    const yrhBarElement = document.getElementById("youAreHereBar");
    for (let index = 0; index < numberOfContests; index++) {
        const id = index + 1;
        // progress bar
        const newBarElement = document.createElement("div");
        newBarElement.setAttribute("class", "progSection");
        newBarElement.setAttribute("id", "progBar" + index);
        // Add navigation button with the contest id as the button
        // string ZZZ
        newBarElement.innerHTML = id;
        progBarElement.appendChild(newBarElement);
        // youAreHereBar bar
        const newYrhElement = document.createElement("div");
        newYrhElement.setAttribute("class", "yrhSection");
        newYrhElement.setAttribute("id", "yrhBar" + index);
        yrhBarElement.appendChild(newYrhElement);
    }
    // Add a final checkout section
    const newBarElement = document.createElement("div");
    // Note - the last progress bar section wants to the same class
    // as the other so not to have any borders
    newBarElement.setAttribute("class", "yrhSection");
    newBarElement.setAttribute("id", "progBar" + numberOfContests);
    newBarElement.innerHTML = "checkout";
    progBarElement.appendChild(newBarElement);
    const newYrhElement = document.createElement("div");
    newYrhElement.setAttribute("class", "yrhSection");
    newYrhElement.setAttribute("id", "yrhBar" + numberOfContests);
    yrhBarElement.appendChild(newYrhElement);
}

// Will set the color of the progress bar (per contest)
// NOTE - contestNum is zero based
function setProgressBarColor(contestNum, color) {
    const sectionElement = document.getElementById("progBar" + contestNum);
    // Need to clear out all existing background styles
    for (const color of ["novotedBG", "undervotedBG", "votedBG", "activeContest"]) {
        sectionElement.classList.remove(color)
    }
    sectionElement.classList.add(color);
}

// Will set the contents of the youAreHereBar bar (per contest)
// NOTE - contestNum is zero based
function setActiveContest(contestNum) {
    const sectionElement = document.getElementById("yrhBar" + contestNum);
    const newElement = document.createElement("span");
    newElement.appendChild(yrhIcon);
    sectionElement.appendChild(newElement);
}

// Will set up the upperSection
function setUpperSection(contestNum, thisContestName, thisContestValue, checkout=false) {
    const rootElement = document.getElementById("upperSection");
    const newItem = document.createElement("span");
    if (checkout) {
        // Setup the checkout page
        let innerText = `<h2>Ballot Checkout</h2><ul>
<li>Verify that each contest is how you would like to vote.</li>
<li>You can select the edit button next to any contest re-edit your selection</li>
<li>Clicking the <b>VOTE</b> button at the bottom of the page will cast your ballot</li>
<li>When you cast your ballot, you will receive an anonymous ballot receipt with 100 randomized contest checks</li>
<li>If you click <b>VOTE and reveal row</b>, in addition to the ballot receipt, you will momentarily be shown your private row number.
<li>Though the ballot receipt is public, the row number is private.  Revealing your row number AND your ballot receipt will allow others to see how you voted.</li></ul>`;
        newItem.innerHTML = innerText;
    } else if (thisContestValue.tally == "plurality") {
        const max = thisContestValue.max_selections;
        // Setup plurality contest header info
        let innerText = "<h2>Contest " + (contestNum + 1) + ":&nbsp&nbsp&nbsp" + thisContestName + "</h2><h3>This is a plurality contest:</h3><ul><li>Make you selection by clicking.  Click again to unselect.</li>";
        if (max == 1) {
            innerText += "<li>You can only make one selection</li></ul>";
        } else {
            innerText += "<li>You can choose upto " + max + "</li></ul>";
        }
        newItem.innerHTML = innerText;
    } else {
        // Setup IRV contest header info
        let innerStr = "";
        if (!thisContestValue.choices.length) {
            innerStr = "You can select up to all the candidates";
        } else {
            innerStr = "You can select up to " + thisContestValue.choices.length + "candidates";
        }
        let innerText = "<h2>Contest " + (contestNum + 1) + ":&nbsp&nbsp&nbsp" + thisContestName + `</h2><h3>This is a RCV contest:</h3>
<ul>
<li>Clicking a candidate will add it in order to your RCV</li>
<li>Your RCV selection is re-orderable by drag-and-drop the selections</li>
<li>Clicking a selection's remove button deselects a candidate</li>
<li>` + innerStr + `</li>
</ul>
<h3>Your RCV selection:</h3>
`;
        newItem.innerHTML = innerText;
    }
    const newList = document.createElement("ul");
    newList.setAttribute("id", "sortableList");
    newList.classList.add("noBullets");
    newItem.appendChild(newList);
    rootElement.appendChild(newItem);
}

// Will set up the lowerSection
function setLowerSection(thisContestValue, checkout=false) {
    const rootElement = document.getElementById("lowerSection");
    const newItem = document.createElement("span");
    if (checkout) {
        newItem.innerHTML = "";
    } else if (thisContestValue.contest_type == "ticket") {
        newItem.innerHTML = "<h3>Candidates:</h3>";
    } else if (thisContestValue.contest_type == "question") {
        newItem.innerHTML = "<h3>Your selection:</h3>";
    } else {
        newItem.innerHTML = "<h3>Candidates:</h3>";
    }
    const newList = document.createElement("ul");
    newList.setAttribute("id", "choiceList");
    newList.classList.add("noBullets");
    newItem.appendChild(newList);
    rootElement.appendChild(newItem);
}

// Setup the choiceList
function setupChoiceList(thisContestName, thisContestValue, overrideChoice=null) {
    const rootElement = document.getElementById("choiceList");
    for (let choice of thisContestValue.choices) {
        if (overrideChoice) {
            choice = overrideChoice;
        }
        const newItem = document.createElement("li");
        newItem.classList.add("flex-item"); // Apply a class for styling

        // Create a selection glyph
        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("width", "16");
        svgIcon.setAttribute("height", "16");
        svgIcon.setAttribute("viewBox", "0 0 16 16");
        svgIcon.setAttribute("fill", selectBackgroundColor);
        svgIcon.innerHTML = '<circle r=6 cx=8 cy=8 stroke="black" stroke-width="1"/>';

        // Create the text element
        const name = document.createElement("span");
        const extraText = document.createElement("span");
        name.innerHTML = extraSpace;
        // Ugh - need to inspect for the choices data type
        if (choice.name) {
            name.innerText += choice.name;
            newItem.setAttribute("thename", choice.name);
        } else {
            // Just an array of strings
            name.innerText +=  choice;
            newItem.setAttribute("thename", choice);
        }
        if (thisContestValue.contest_type == "ticket") {
            // Note - need to add this as an additional flex-box
            // so that the 'name' matches the choice
            let addendum = [];
            for (let office of thisContestValue.ticket_titles) {
                addendum.push(office + ":" + choice.ticket_names);
            }
            extraText.innerHTML = extraSpace;
            extraText.innerText += "[" + addendum.join(", ") + "]";
        }
        // Add the unselected class
        newItem.classList.add("unselected");

        // Append everything ...
        newItem.appendChild(svgIcon);
        newItem.appendChild(name);
        newItem.appendChild(extraText);
        rootElement.appendChild(newItem);

        // If setting just one choice
        if (overrideChoice) {
            break;
        }
    }
}

// Make the RCV selection sortable by drag-and-drop
// Notes:
// - the class is on the li node
// - the initSortableList and associated css entries are from:
//   https://code-boxx.com/drag-drop-sortable-list-javascript/
//   with a MIT License
// - the touchscreen mobile support (/static/javascript/DragDropTouch.js)
//   is from: https://github.com/Bernardo-Castilho/dragdroptouch
//   commit: 415fcf577d39bfac042d9215a02660d5c1df2f10
//   also with a MIT License
function initSortableList(target) {
    // (A) SET CSS + GET ALL LIST ITEMS
    target.classList.add("slist");
    const items = target.getElementsByTagName("li");
    let current = null;

    // (B) MAKE ITEMS DRAGGABLE + SORTABLE
    for (let i of items) {
        // (B1) ATTACH DRAGGABLE
        i.draggable = true;

        // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
        i.ondragstart = (e) => {
            current = i;
            for (let it of items) {
                if (it != current) {
                    it.classList.add("hint");
                }
            }
        };

        // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
        i.ondragenter = (e) => {
            if (i != current) {
                i.classList.add("active");
            }
        };

        // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
        i.ondragleave = (e) => {
            i.classList.remove("active");
        };

        // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
        i.ondragend = (e) => {
            for (let it of items) {
                it.classList.remove("hint");
                it.classList.remove("active");
            }
        };

        // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
        i.ondragover = (e) => e.preventDefault();

        // (B7) ON DROP - DO SOMETHING
        i.ondrop = (e) => {
            if (i != current) {
                let currentPos = 0;
                let droppedPos = 0;

                for (let it = 0; it < items.length; it++) {
                    if (current == items[it]) {
                        currentPos = it;
                    }
                    if (i == items[it]) {
                        droppedPos = it;
                    }
                }

                if (currentPos < droppedPos) {
                    i.parentNode.insertBefore(current, i.nextSibling);
                } else {
                    i.parentNode.insertBefore(current, i);
                }
            }
        };
    }
}

// The RCV heavy lifter
function updateRCVContest(selectedItem, thisContestName, thisContestValue) {
    // Create a new selected item with a remove button
    const selectedText = selectedItem.textContent;
    const newItem = document.createElement("li");
    newItem.classList.add("flex-item"); // Apply a class for styling

    // Create a remove button
    const newButton = document.createElement("button");
    newButton.innerText = "remove";
    newButton.classList.add("remove");
    // add an event listener to the button
    newButton.addEventListener("click", function (e) {
        let itemName = e.target.parentNode.textContent.trim().replace(/\s+remove$/, "");
        e.target.parentNode.classList.remove("selected");
        console.log("Remove button eventListener: removing '" + itemName + "' (parentNode=" + e.target.parentNode.innerText + ")");
        // remove it from sortableList
        e.target.parentNode.remove();
        // add to choiceList
        setupChoiceList(thisContestName, thisContestValue, itemName);
    });

    // Create a re-order glyph
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("width", "20");
    svgIcon.setAttribute("height", "20");
    svgIcon.setAttribute("viewBox", "0 -4 16 16");
    // svgIcon.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgIcon.setAttribute("fill", "currentColor");
    svgIcon.setAttribute("fill-rule", "evenodd");
    svgIcon.setAttribute("clip-rule", "evenodd");
    // the actual svg
    svgIcon.innerHTML = `<path d="M2.49998 4.09998C2.27906 4.09998 2.09998 4.27906 2.09998 4.49998C2.09998 4.72089 2.27906 4.89998 2.49998 4.89998H12.5C12.7209 4.89998 12.9 4.72089 12.9 4.49998C12.9 4.27906 12.7209 4.09998 12.5 4.09998H2.49998ZM2.49998 6.09998C2.27906 6.09998 2.09998 6.27906 2.09998 6.49998C2.09998 6.72089 2.27906 6.89998 2.49998 6.89998H12.5C12.7209 6.89998 12.9 6.72089 12.9 6.49998C12.9 6.27906 12.7209 6.09998 12.5 6.09998H2.49998ZM2.09998 8.49998C2.09998 8.27906 2.27906 8.09998 2.49998 8.09998H12.5C12.7209 8.09998 12.9 8.27906 12.9 8.49998C12.9 8.72089 12.7209 8.89998 12.5 8.89998H2.49998C2.27906 8.89998 2.09998 8.72089 2.09998 8.49998ZM2.49998 10.1C2.27906 10.1 2.09998 10.2791 2.09998 10.5C2.09998 10.7209 2.27906 10.9 2.49998 10.9H12.5C12.7209 10.9 12.9 10.7209 12.9 10.5C12.9 10.2791 12.7209 10.1 12.5 10.1H2.49998Z"/>`;

    // Create the text element
    const textElement = document.createElement("span");
    textElement.innerText = selectedText;
    textElement.innerHTML += extraSpace;

    // Append everything to the li node
    newItem.appendChild(svgIcon);
    newItem.appendChild(textElement);
    newItem.appendChild(newButton);

    // Add the class to the li node
    newItem.classList.add("selected");
    // ... and append that to the bottom of sortableList
    sortableList.appendChild(newItem);
    // Remove the containing li for the selected item from the first list
    selectedItem.remove();
    // Initialize the sortable list
    initSortableList(document.getElementById("sortableList"));
}

// RCV event listeners
function setupRCVEventListeners(thisContestName, thisContestValue) {
    // Event listener for selection in the first list (when a candidate is selected)
    choiceList.addEventListener("click", (event) => {
        if (event.target.closest("li") && event.target.closest("li").classList.contains("unselected")) {
            console.log("Running RCV eventListener:");
            // Update the RCV contest
            updateRCVContest(event.target.closest("li"), thisContestName, thisContestValue);
        }
    });
}

// plurality contest choice (li item) event listeners
function setupPluralityEventListeners(thisContestName, thisContestValue) {
    choiceList.addEventListener("click", (event) => {
        console.log("Running plurality eventListener:");
        // Note - one can (correctly) select the circle, or svg, or text,
        // or the li
        const listItem = event.target.closest("li");
        const itemText = listItem.textContent;
        const itemIndex = Array.from(choiceList.children).indexOf(listItem);
        if (listItem.classList.contains("unselected")) {
            if (selectedCount < thisContestValue.max_selections) {
                // Select the item (up to maxSelection selections allowed)
                listItem.classList.add("selected");
                listItem.classList.remove("unselected");
                // get the svg (first child) and set fill to on (black)
                listItem.firstElementChild.style.fill = "black"
                selectedCount++;
                console.log("selected " + itemIndex + ", " + itemText);
            } else if (thisContestValue.max_selections == 1) {
                // Ease of use - deselect previous choice and select this one
                for (const selected of document.getElementsByClassName("selected")) {
                    selected.classList.add("unselected");
                    selected.classList.remove("selected");
                    selected.firstElementChild.style.fill = selectBackgroundColor;
                }
                listItem.classList.add("selected");
                listItem.classList.remove("unselected");
                // get the svg (first child) and set fill to on (black)
                listItem.firstElementChild.style.fill = "black"
                console.log("switched selection to " + itemIndex + ", " + itemText);
            } else {
                // Overvote
                console.log("rejected (overvote) - ignoring " + itemIndex + ", " + itemText);
            }
        } else if (listItem.classList.contains("selected")) {
            // Deselect the item
            listItem.classList.add("unselected");
            listItem.classList.remove("selected");
            listItem.firstElementChild.style.fill = selectBackgroundColor;
            selectedCount--;
            // get the svg (first child) and set fill to off
            console.log("de-selected " + itemIndex + ", " + itemText);
        }
    });
}

// the next/checkout button listener.
// Note - it is the newButton EventListener defined and attached here
// that records the vote in the blankBallot object AND clears out the
// three DOM sections.  So when the newButton EventListener calls
// either setupNextContest or setupCheckout, the three DOM sections
// have been cleared out and are ready to be re-populated.
function setupNavigationButtonListener(buttonString, thisContestNum, thisContestValue, nextContestNum) {
    const newItem = document.createElement("li");
    // Create a next/checkout button
    const newButton = document.createElement("button");
    newButton.innerText = buttonString;
    // add an event listener to the button
    newButton.addEventListener("click", function() {
        createNewPage(buttonString, thisContestNum, thisContestValue, nextContestNum);
    });
    return newButton;
}

function createNewPage (eventName, thisContestNum, thisContestValue, nextContestNum) {
    console.log("Running next navigation event listerner (" + eventName + ") for contest " + nextContestNum);
    // On the button click go to the next contest or the checkout screen
    //
    // Going to the next contest involves:
    // 1) capturing the vote (a.k.a. thisContest's selections) before it
    //    (probably?) gets wiped out when the DOM children are reaped.
    //    thisContestValue is a reference into the blankBallot object.
    if (thisContestValue) {
        const selection = [];
        let index = 0;
        for (const choice of document.getElementsByClassName("selected")) {
            const name = choice.children[1].innerText.trim();
            selection[index] = index + ": " + name;
            console.log("recording vote: " + index + ": " + name);
            index += 1;
        }
        thisContestValue["selection"] = selection;
        // and setting the progressBar color
        let max = thisContestValue.max_selections;
        if (!max) {
            max = thisContestValue.choices.length;
        }
        console.log("");
        if (selection.length == 0) {
            console.log("Contest " + thisContestNum + " no voted");
            setProgressBarColor(thisContestNum, "novotedBG");
        } else if (max == selection.length) {
            console.log("Contest " + thisContestNum + " voted");
            setProgressBarColor(thisContestNum, "votedBG");
        } else {
            console.log("Contest " + thisContestNum + " undervoted voted");
            setProgressBarColor(thisContestNum, "undervotedBG");
        }
    }
    // 2) clearing out the upper and lower node DOM trees
    document.getElementById("upperSection").replaceChildren();
    document.getElementById("lowerSection").replaceChildren();
    document.getElementById("bottomSection").replaceChildren();
    // 3) going somewhere
    if (nextContestNum < numberOfContests) {
        setupNewContest(nextContestNum);
    } else {
        setupCheckout();
    }
}

// Setup the bottom navigation buttons
function setupBottomNavigation(thisContestNum, nextContestNum, thisContestValue) {
    const bottomElement = document.getElementById("bottomSection");
    const newList = document.createElement("ul");
    newList.classList.add("flex-item"); // Apply a class for styling
    newList.classList.add("noBullets");
    // For now, always create two buttons (UX TBD later)
    let nextButtonString = "Go to next contest";
    let prevContestNum = thisContestNum - 1;
    if (nextContestNum >= numberOfContests) {
        nextButtonString = "Go to checkout";
    }
    let previousButtonString = "Go to previous contest";
    if (thisContestNum == 0) {
        previousButtonString = "Go directly to checkout";
        prevContestNum = numberOfContests + 1;
    }
    // Add the buttons as a table
    const table = document.createElement("table");
    table.classList.add("tableStyle");
    const row = document.createElement("tr");
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    col1.appendChild(setupNavigationButtonListener(previousButtonString, thisContestNum, thisContestValue, prevContestNum));
    col2.innerHTML = "&nbsp&nbsp";
    col2.appendChild(setupNavigationButtonListener(nextButtonString, thisContestNum, thisContestValue, nextContestNum));
    row.appendChild(col1);
    row.appendChild(col2);
    table.appendChild(row);
    // Add to the DOM
    bottomElement.appendChild(table);
}

// Helper function to color JSON
function nullifyVotingSession() {
    blankBallot = null;
    listOfContests.length = 0;
}

// Setup the chechout page vote button
function setupVoteButtonListener(buttonString, rootElement) {
    const newItem = document.createElement("div");
    // Create a next/checkout button
    const newButton = document.createElement("button");
    newButton.innerText = buttonString;
    // add an event listener to the button
    console.log("Running '" + buttonString + "' eventListener");
    if (buttonString == "VOTE") {
        // event listener to cast a ballot
        newButton.addEventListener("click", function (e) {
            if (MOCK_WEBAPI) {
                try {
                    console.log("parsing mock blank receipt");
                    receiptJSON["vote_store_id"] = MOCK_GUID;
                    setupReceiptPage(JSON.parse(receiptJSON));
                } catch (e) {
                    console.error(e);
                }
            } else {
                // fetch via a post (inline here) the completed ballot and pass
                // setupReceiptPage(...) as the callback
                console.log("sending the completed ballot; waiting on receipt");
                fetch(castBallotURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "charset": "utf-8"
                    },
                    body: JSON.stringify(blankBallot)})
                    .then(response => response.json())
                    .then(json => {
                        // Access json only inside the `then`
                        if (json.webapi_error) {
                            throw new Error(json.webapi_error);
                        }
                        console.log("retrieved the live ballot receipt");
                        setupReceiptPage(json);
                    })
                    .catch(error => console.log("ballot POST returned an error: " + error));
            }
        });
        // Change the text on click
        newButton.addEventListener("click", ({ target: button }) => {
            button.insertAdjacentText("afterend", "Casting Ballot ...");
            button.remove();
        }, false);
        return newButton;
    } else {
        // Spoil button
        newButton.addEventListener("click", function (e) {
            // For now, just print something, destroy the blankBallot,
            // and go to home page
            nullifyVotingSession();
            const newItem = document.createElement("p");
            newItem.innerHTML = "Your ballot has been destroyed.  To vote, click the start over button below";
            rootElement.appendChild(newItem);
            // window.location.href = "voting.html";
            const startOverButton = document.createElement("button");
            startOverButton.innerText = "Start over";
            startOverButton.onclick = function () {
                window.location.href = "index.html";
            };
            rootElement.appendChild(startOverButton);
        });
        return newButton;
    }
    // } else {
    //     alert("Unsupported/unimplemented function '" + buttonString + "'");
    return null;
}

// Setup the progressBar navigation buttons.  Design note - as the
// design of this fell into place (!), the code to store the voter's
// selection ended up being placed in the event listener that
// navigated away from the page (setupNavigationButtonListener).  That
// creates a closure for the actual event listener.  Sooo, when adding
// event listeners to the progressBar, the same thing needs to be done,
// which means for the moment (without a class structure design etc)
// each contest page needs to redefine the even listener so to have
// the correct closure so that it (the navigation away) does the
// correct thing (as the closure contains the thisContestNum value).
function setupProgressBarNavigation(thisContestNum, thisContestValue) {
    // loop over the entire progressBar and replace the event listeners
    for (let index = 0; index < numberOfContests; index++) {
        const id = "progBar" + index;
        const barElement = document.getElementById(id);
        // remove anything that exists
        barElement.replaceChildren();
        // add new button
        const barButton = setupNavigationButtonListener(index+1, thisContestNum, thisContestValue, index);
        barElement.appendChild(barButton)
    }
    // And add one for the checkout page
    const barElement = document.getElementById("progBar" + numberOfContests);
    // remove anything that exists
    barElement.replaceChildren();
    // add new button
    const barButton = setupNavigationButtonListener("checkout", thisContestNum, thisContestValue, numberOfContests);
    barElement.appendChild(barButton)
}

// Helper function for pretty printing selections
function smartenSelections(selections, tally) {
    const arr = [...selections];
    if (tally == "plurality") {
        return arr.map((str) => str.replace(/^\d+:\s+/, ""));
    } else {
        return arr.map((str) => str.replace(/^\d+/, (match) => parseInt(match, 10) + 1));
    }
}

// Helper function to return the selection zer-offset index and name
function splitSelection(selection) {
    return selection.split(/:\s+/, 2);
}

// Setup the checkout page
// Called from newButton event listener, which means that the 'previous'
// page contents are still being displayed
function setupCheckout() {
    console.log("setupCheckout: setting up checkout page");
    // 1) adjust the progress bars
    setActiveContest(numberOfContests);

    // 2) loop over the voters selections per contest and create a
    // bordered flex-box li item with a two li item sublist:
    //    - a two sub node li consisting of the contest number and
    //      name/title/question
    //    - a two sub node li consisting of the ordered list of the
    //      selections and a Change/Edit/GoTo navigation button
    // Arbitrarily place the help text in upperSection and the actual
    // selections in the lowerSection and the vote buttons in the
    // bottomSection.
    setUpperSection(null, "checkout", null, true);
    setLowerSection("checkout", true);
    const rootElement = document.getElementById("choiceList");
    let index = 0;
    for (const contest of blankBallot.contests) {
        const newItem = document.createElement("li");
        // just ake a table for now
        newItem.classList.add("tableflexContainer");
        // td's
        const box1 = document.createElement("td");
        box1.style.textAlign = "center";
        const box2 = document.createElement("td");
        box2.style.textAlign = "left";
        const box3 = document.createElement("td");
        box3.style.textAlign = "right";
        const contestName = contest.contest_name;
        const selections = contest.selection;
        index += 1;
        console.log("contest " + index + " (" + contestName + "), selection = " + selections);
        box1.innerHTML = "Contest " + index + ":&nbsp&nbsp" + contestName;
        let max = contest.max_selections;
        if (!selections || selections.length == 0) {
            box2.innerHTML = "no selection - skipped";
            box2.classList.add("novotedText");
        } else {
            box2.innerHTML = smartenSelections(selections, Object.values(contest)[0].tally).join("<br>");
            if (selections.length < max) {
                const extraText = document.createElement("span");
                extraText.innerHTML = "<br>undervoted - more votes are allowed";
                extraText.classList.add("undervotedText");
                box2.appendChild(extraText);
            }
        }
        // Create the goto button
        const gotoButton = document.createElement("button");
        gotoButton.innerText = "Edit Contest " + index;
        gotoButton.id = "gotoContest" + index;
        // add an event listener to the button
        gotoButton.addEventListener("click", function (e) {
            console.log("Running gotoButton to contest " + index);
            // On a goto button click, clear out the children ...
            document.getElementById("upperSection").replaceChildren();
            document.getElementById("lowerSection").replaceChildren();
            document.getElementById("bottomSection").replaceChildren();
            // ... and goto the contest
            const buttonIdString = Number(this.id.match(/\d+$/)) - 1;
            setupNewContest(buttonIdString);
        });
        box3.appendChild(gotoButton);
        // Create the table and add it
        const table1 = document.createElement("table");
        table1.classList.add("tableStyle");
        const table2 = document.createElement("table");
        table2.classList.add("tableStyle");
        const row1 = document.createElement("tr");
        const row2 = document.createElement("tr");
        row1.appendChild(box1);
        row2.appendChild(box2);
        row2.appendChild(box3);
        table1.appendChild(row1);
        table2.appendChild(row2);
        newItem.appendChild(table1);
        newItem.appendChild(table2);
        rootElement.appendChild(newItem);
    }

    // 3) For the demo, create two buttons for now: spoil and vote.
    //    Spoil returns to the welcome page (index.html) without
    //    voting.  Vote submits the ballot and proceeds to the VTP
    //    part of the demo.  Voting:
    //    - prints the cast-ballot to the page (for now) - can just
    //      continue appending to rootElement
    //    - when integrated with the web-api, will send the modified
    //      blankBallot.json which will re-verify the ballot and
    //      casts it, returning the ballot receipt and row number
    const spoilButton = setupVoteButtonListener("Spoil Ballot (start over)", rootElement);
    const voteButton = setupVoteButtonListener("VOTE", rootElement);
    // Create the table and add them
    const voteTable = document.createElement("table");
    voteTable.classList.add("tableStyle");
    const row1 = document.createElement("tr");
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    col2.innerHTML = "&nbsp&nbsp";
    col1.appendChild(spoilButton);
    col2.appendChild(voteButton);
    row1.appendChild(col1);
    row1.appendChild(col2);
    voteTable.appendChild(row1);
    rootElement.appendChild(voteTable);
}

// Setup a new contest.  Note - when navigating to a new contest,
// the previous contest selection data is gone by the time this
// is called.  Just being clear about that.
function setupNewContest(thisContestNum) {
    console.log("Running setupNewContest: contest " + thisContestNum);
    let thisContestValue = listOfContests[thisContestNum];
    let thisContestName = thisContestValue["contest_name"];

    // and initialize them
    setProgressBarColor(thisContestNum, "activeContest");
    setActiveContest(thisContestNum);

    // Setup the upper and lower sections
    setUpperSection(thisContestNum, thisContestName, thisContestValue);
    setLowerSection(thisContestValue);

    // Note - for the moment let these be globals (until we know more).
    // Regardless, the upper/lower setup will make sure choiceList and
    // sortableList are already defined.
    choiceList = document.getElementById("choiceList");
    sortableList = document.getElementById("sortableList");
    removeButtons = document.getElementsByClassName("remove");
    selectedCount = 0;

    // Setup the choiceList
    setupChoiceList(thisContestName, thisContestValue);
    if (thisContestValue.tally == "plurality") {
        setupPluralityEventListeners(thisContestName, thisContestValue);
    } else {
        setupRCVEventListeners(thisContestName, thisContestValue);
    }

    // Restore previous votes.  Note - the above setUpperSection clears
    // everything out, so to restore we only need to add the classes
    // to the correct li - if there is something.
    if (thisContestValue.selection) {
        // loop over selection in order
        for (const selection of thisContestValue.selection) {
            const indexName = splitSelection(selection);
            // Find the choice in choiceList that matches
            for (const choice of choiceList.children) {
                if (choice.getAttribute("thename") == indexName[1]) {
                    if (thisContestValue.tally == "plurality") {
                        // plurality is easier enough to manually update
                        choice.classList.add("selected");
                        choice.classList.remove("unselected");
                        // get the svg (first child) and set fill to on (black)
                        choice.firstElementChild.style.fill = "black"
                        selectedCount++;
                    } else {
                        // Need to manually update the RCV contest
                        updateRCVContest(choice, thisContestName, thisContestValue)
                    }
                    console.log("restored " + indexName[0] + ", " + indexName[1]);
                }
            }
        }
    }

    // Setup the bottomSection - this supplies simply "next context/checkout"
    // navigation.  Note - the voter's selection is saved when navigating away
    // from the page - hence it needs _this_ thisContestValue.
    setupBottomNavigation(thisContestNum, thisContestNum + 1, thisContestValue);

    // Setup progressBar navigation
    setupProgressBarNavigation(thisContestNum, thisContestValue);

    // Setup keyboard listener if it does not already exist
    // if (keydownEL && thisContestNum + 1 >= numberOfContests) {
    //     // remove it when on the last page (checkout)
    //     document.removeEventListener("keydown", createNewPage);
    //     keydownEL = false;
    // } else if (! keydownEL && thisContestNum + 1 < numberOfContests) {
    //     // Create one
    //     document.addEventListener("keydown", function(event) {
    //         if (event.key === "Enter") {
    //             createNewPage("Enter keydown", thisContestNum, thisContestValue, thisContestNum + 1);
    //         }
    //     });
    // }
}

// Create a function to fade out the element
function fadeOut(receiptObject, fade) {
    let opacity = 1.0;
    const intervalID = setInterval(function() {
        if (opacity > 0) {
            opacity = opacity - 0.05
            fade.style.opacity = opacity;
            console.log("setInterval fade");
        } else {
            // wipe out the row data
            fade.style.display = 'none';
            fade.innerText = "";
            receiptObject["ballot_row"] = null;
            clearInterval(intervalID);
            console.log("setInterval cleared");
        }
    }, 200);
}

// DragDropTouch Notes:
// It turns out that when the DragDropTouch.js was added and the ballot receipt
// is displayed, all the 'li' items appear to get the same DDT functionality added,
// resulting in a poor UX (the li items are dragable via a touch screen).
// There does not appear to be a way to list the event listeners (outside
// of say chrome's devtools) since W3C apparently dropped that spec from
// the 3 DOM specification.
//
// So it seems like the two remaining reasonable solutions are to 1) shift
// the RCV sortableList from being "li" element based to being a custom
// css class which is attached to those li elements of interest (create
// a "DragDropTouch" class), but not sure if the DDT js blindly attaches
// the EV's to all 'li's or just the classed ones.  Or 2) when setupReceiptPage
// loads, explicitly remove the four event listeners that DragDropTouch adds.
// For now, picked 2.  TBD
function setupReceiptPage(ballotReceiptObject) {
    // For now store the (global) GUID
    vote_store_id = ballotReceiptObject.vote_store_id;

    // Clear out the completed blank ballot
    nullifyVotingSession();

    // Clear out progressBar and progressBar stylesheet - remove everything
    const progressBar = document.getElementById("progressBar");
    progressBar.replaceChildren();
    progressBar.style.backgroundColor = "transparent";

    // Clear out youAreHereBar
    document.getElementById("youAreHereBar").replaceChildren();

    // Clear all all three sections
    const upperSection = document.getElementById("upperSection");
    const lowerSection = document.getElementById("lowerSection");
    upperSection.replaceChildren();
    lowerSection.replaceChildren();
    document.getElementById("bottomSection").replaceChildren();

    // Clear the touchscreen event handlers if present
    for (const ev in DDTEventListeners) {
        document.removeEventListener(ev, DDTEventListeners[ev]);
        console.log(`Removed eventlistener ${ev}`);
    }

    // Add upper text
    const upperSpan = document.createElement("span");
    upperSpan.innerHTML = `<h3>This is a ballot check</h3>
<ul>
<li>Clicking a contest digest will display that contest</li>
<li>Clicking the row index will validate that row of contests</li>
<li>Clicking the column header will tally that contest</li>
<li>Clicking the QR code will display the saved ballot check</li>
</ul>
<table><tr><td>
<h3>Your row number is: <span id="tofade" class="visible"><span id="rowIndex">null</span></span></h3></td><td>&nbsp&nbsp(disappears in 5 seconds)</td></tr></table>`;
    upperSection.appendChild(upperSpan);

    if (ballotReceiptObject.encoded_qr) {
        // get the svg text and wrap it in an anchor tag
        const decodedQR = atob(ballotReceiptObject.encoded_qr);
        const qrElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        qrElement.setAttribute("width", "49mm");
        qrElement.setAttribute("height", "49mm");
        qrElement.setAttribute("viewBox", "0 0 185 185");
        qrElement.setAttribute("fill", "black");
        // add the xlink namespace (for making a href link)
        qrElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
        let qrSvg = decodedQR.substring(decodedQR.indexOf("\n") + 1);
        // ZZZ - 2024/04/18: the QR code is coming up blank and not sure
        // why.  Maybe because the python generated standalone svg is in
        // xml syntax and this html doc needs it to be html syntax and
        // they are different in this way?
        qrElement.innerHTML = qrSvg.slice(qrSvg.indexOf("<svg:rect ")).replace(/svg:rect/g, "rect");
        // Create an explicit link
        const qrLink = document.createElement("a");
        qrLink.appendChild(qrElement);
        qrLink.setAttribute("target", "_blank");
        qrLink.title = "QR link to ballot check";
        qrLink.href = `show-versioned-receipt.html?vote_store_id=${vote_store_id}&digest=${ballotReceiptObject.receipt_digest}`;
        upperSpan.appendChild(qrLink)
    }

    // Create the table (this creates the receipt DOM)
    createReceiptTable(ballotReceiptObject, vote_store_id);

    // Force scroll to the top
    window.scrollTo(0, 0);

    // Set the row number
    document.getElementById("rowIndex").innerText = ballotReceiptObject.ballot_row;

    // Fade the row number
    fadeOut(ballotReceiptObject, document.getElementById("rowIndex"));
}

// ################
// __main__
// ################
function main(incomingBB) {
    // No javascript classes here - set these three globals:
    blankBallot = incomingBB;
    listOfContests = incomingBB.contests;
    numberOfContests = incomingBB.contests.length;
    console.log("there are " + numberOfContests + " contest(s)");
    // When we are here, we are about to set up the first contest.
    // set up the bars once
    setupProgressBars(numberOfContests);
    // set up the first contest
    setupNewContest(0);
}

// To mock or not to mock
if (MOCK_WEBAPI) {
    try {
        console.log("parsing mock blank ballot");
        const incoming = JSON.parse(blankBallotJSON);
    } catch (e) {
        console.error(e);
    }
    main(incoming);
} else {
    console.log("fetching a live blank ballot");
    // Need the JSON data for just about everything.  However, the way to get
    // external json is with a fetch, which is asynchronous.  Which means that
    // 'just about everything' on this page needs to run within the callback to
    // the async function (called only when !MOCK_WEBAPI).
    fetch(getBlankBallotURL)
        .then(response => response.json())
        .then(json => {
            // Access json only inside the `then`
            if (json.webapi_error) {
                throw new Error(json.webapi_error);
            }
            console.log("retrieved the live blank ballot");
            main(json.blank_ballot);
        })
        .catch(error => console.log("blank ballot fetch returned an error: " + error));
}
