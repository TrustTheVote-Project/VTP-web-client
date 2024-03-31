# VoteTracker+ Client Side UI/UX Design Notes

## User Story 1 - landing page

#### What happens when a client (smart device browser of choice) initially connects to the VTP demo?

Displays a short welcome and help message that briefly explains the standard contest buttons.  There is only one active button on the page, __CONTINUE__.  Activating that continues to step 2.

## User Story 2 - voting

#### What happens when the voter starts to actually mark the ballor, a.k.a. vote?

Displays the first contest.  At the moment two types of contests are supported, plurality and IRV (RCV).

If plurality:
- can select up to the number of open positions by tapping the choice of interest in the vertical list
- individual choices can be de-selected by tapping again
- if more than the allowable number of choices are selected, a dialog abort window appears

If IRV/RCV:
- the vertical list of candidates is displayed below an (initially empty) vertical list of ranked/selected candidates above
- clicking an candidate from the below list adds the candidate to the bottom of the upper list and removes the candidate from the below list
- swiping a candidate left or right in the upper list will remove the candidate from the upper list and re-appear the candidate in the original order in the below list
- the upper list is draggable - the upper list can be reordered at will

Common buttons/actions/UI:

- there is a __CONTINUE__ button somewhere in the lower right portion of the page
- across the top is a horizontal progress bar divided into equal width sections by contest
  - each contest is clickable and takes the user to that contest
  - in the progress bar, completed contests are green, undervote contests are yellow, and no-vote contests are red
- there is a __PREVIOUS CONTEST__ button in the lower left
- there is a __NEXT CONTEST__ to the right of the previous contest button
  - when the last contest in focus, the upper right button says __CHECKOUT__
- when the __CHECKOUT__ box is clicked, all the contests are displayed with two buttons: __Spoil Ballot__ and __VOTE__

Note that the backend python server side will re-validate the incoming ballot CVR.  The __VOTE__ entrypoint can return various errors to the user:

- a non compliant contest selection was found
- there was a problem on the server side

If there is no error, the endpoint returns the ballot receipt, taking the user to the receipt.html page.

## User Story 3 - inspecting the ballot check/QR code

#### What happens when the user successfully submits a ballot or follows the QR code on a paper ballot?

That specific ballot receipt is displayed.  If voting, the voter's row offset into the ballot check is temporarily displayed.  If a QR code is being followed, just the page is displayed.

- links:
  - each digest is clickable - takes the user to that contest-cvr.html page
    - the contest-cvr.html contains links into the tally-contest.html page with digest tracking
  - each row heading is clickable - takes the user to that verify-ballot-check.html page
  - each column heading is clickable - takes the user to that tally-election.html page (no digest tracking)
  
See ProjectPlan.md - receipt.html

## User Story 4 - inspecting contest CVRs

#### What happens when the user wants to inspect a specific contest CVR?

TBD - see ProjectPlan.md - contest-cvr.html

## User Story 5 - verifying the ballot check

#### What happens when the user wants to verify their ballot check?

TBD - see ProjectPlan.md - verify-ballot-check.html

## User Story 6 - tallying the election

#### What happens when the user wants to tally the election?

TBD - see ProjectPlan.md - tally-election.html

## General client <-> web-api <-> backend spring demo #2 data flow

1. user lands on welcome page: http://127.0.0.1/index.html 
 - served as a static uvicorn page
 - clicks a button which:
   - optionally passes the address as a parameter
   - goes to http://127.0.0.1/voting.html (in the existing tab)
2. user lands on http://127.0.0.1/voting.html
 - served as a static uvicorn page
 - reads an optional address parameter
 - will fetch a (possibly address specific) blank ballot via http://127.0.0.1/get\_blank_ballot endpoint
   - this endpoint is altered so to not require a vote\_store_id GUID (note - the GUID workspace is not created until the ballot is cast)
 - completely handles the voting process by changing the DOM, not by loading/reloading a new page
 - if voter spoils ballot, voter returns to index.html (in same tab)
 - if casts ballot, calls the http://127.0.0.1/cast-ballot endpoint supplying cast_ballot json
   - this (existing) endpoint is altered so that it:
     - creates the vote\_store_id GUID first
     - then calls the backend to cast the ballot
     - if successful returns the GUID and the receipt
 - note - the existing http://127.0.0.1/receipt.html page is deleted and the javascript moved to the voting.js page so that voting.js also handles displaying the receipt by re-writing the DOM
3. while viewing the receipt contest, user can click to create new tabs for contest-cvr, verify, and tally
4. contest-cvr - http://127.0.0.1/contest-cvr.index?GUID (with endpoints having the GUID embedded in the path)
5. verify-ballot - http://127.0.0.1/verify-ballot.html?GUID
6. tally-contest - http://127.0.0.1/tally-contest.html?GUID
