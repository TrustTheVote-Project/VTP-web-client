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
