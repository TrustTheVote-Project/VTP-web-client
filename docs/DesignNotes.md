# Initial Design Thoughts Regarding a Client Side UI/UX

## Background

The current design target is to create something in a few weeks for a June 8th live demo.  The date and skill level are driving the client UI side design and implementation.

Currently, the current tech choice to achieve this is plain html, css, and javascript leveraging Google's devtools and Microsoft's Visual Studio Code.

See the VoteTracker+ [project page](https://github.com/orgs/TrustTheVote-Project/projects/2/views/1) for status.

## Uber Context

Summary and a duplication from other sources:

The [VTP-dev-end](https://github.com/TrustTheVote-Project/VTP-dev-env) holds/defines the development/run-time environment.  Contained within VTP-dev-end as submodules are three repos:
- [VTP-mock-election.US.15](https://github.com/TrustTheVote-Project/VTP-mock-election.US.15) - contains the election configuration and data
- [VTP-web-api](https://github.com/TrustTheVote-Project/VTP-web-api) - contains the FASTapi rest interface
- [VoteTrackerPlus](https://github.com/TrustTheVote-Project/VoteTrackerPlus) - contains the python backend code

This repo, [VTP-web-client](https://github.com/TrustTheVote-Project/VTP-web-client) contains the client frontend/UI/UX

See [DesignNotes.md](https://github.com/TrustTheVote-Project/VTP-web-api/blob/main/docs/DesignNotes.md) in the VTP-web-api repo for details on the rest api.

## User Story 1 - landing page

#### What happens when a client (smart device browser of choice) initially connects to the VTP demo?

Displays a short welcome and help message that briefly explains the standard contest buttons.  There is only one active button on the page, __continue__.  Activating that continues to step 2.

## User Story 2 - voting

#### What happens when the voter starts to mark the ballot (votes)?

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

- there is a __de-select all__ button somewhere in the lower left portion of the page
- there is a __continue__ button somewhere in the lower right portion of the page
  - if the continue button is activated and there is an undervote situation, a warning window appears that allows the user to go to the next contest or stay with the current contest
- across the top is a horizontal progress bar divided into equal width sections by contest
  - each contest is clickable and takes the user to that contest
    - if there is an undervote in the current contest, a proceed-able warning window appears
  - in the completion bar, completed contests are solid bright green, undervote contests are solid somewhat dimm yellow, and no-vote or undervote contests that are to the left of any green or yellow contest are red outlined boxes.
- immediately below the progress bar in the left corner is a __previous contest__ button
- immediately below the progress bar in the right corner is a __next contest__ button
  - when the last contest in focus, the upper right button says __checkout__
- when the __checkout__ box is clicked, all the contests are displayed with only two buttons: __go-back__ and __this-is-my-vote__
  - __go-back__ goes to the previous page with the checkout box in the upper right
  - __this-is-my-vote__ submits the ballot

Note that the backend python server side will re-validate the incoming ballot CVR.  The __this-is-my-vote__ entrypoint can return various errors to the user:

- a non compliant contest selection was found
- there was a problem on the server side

If there is no error, the endpoint returns:

- the voter's ballot check as if it were paper (no links) but with the QR code being a valid link (into the voter's backend server's still active git workspace)
- the voter's row offset into the ballot check is temporarily displayed
- in addition there is, for demo purposes only, two additional buttons on this page
  - a __verify-ballot-receipt__ button
  - a __tally-contests__ button

## User Story 3 - inspecting the ballot check/QR code

#### What happens when the user clicks the QR code (or takes a photo of the QR code)?

Displays the git repo copy of the contents of the ballot check.  All the digests are active links to the actual git digests for a specific vote for a specific contest.

## User Story 4 - verifying the ballot check

#### What happens when the user wants to verify their ballot check?

The user clicks the __verify ballot receipt__ (end of User Story 1) and a new page displays the 'console log' output of that function with digests hyperlinked.  The output page contains a few by default blank fields that the user can optionally fill in.  One of them is a row offset.

The page contains a __re-verify__ button that re-verifies the receipt honoring the new values in the various fields.

## User Story 5 - tallying the election

#### What happens when the user wants to tally the election?

The user clicks the __tally contests__ button (end of User Story 1) and a new page displays the 'console log' output of that function with digests hyperlinked.  The output page contains a few by default blank fields that the user can optionally fill in.  One of them is a row offset.

The page contains a __re-tally contests__ button that re-tallies the election honoring the new values in the various fields.
