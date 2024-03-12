# VoteTracker+ Client Side UI/UX Project Plan

#### 1. Background

The current design target is to create a usable client/voter frontend in a few weeks for a June 8th live demo.  The date and available skill level are driving the client UI side design and implementation.

The current tech choice to achieve this is a plain html, css, and javascript implementation.  The current development  environment is Google's devtools, Microsoft's Visual Studio Code, and emacs :-).

See the VoteTracker+ [project page](https://github.com/orgs/TrustTheVote-Project/projects/2/views/1) for status.

#### 2. Overall VTP Git Repo Context

Summary of the VTP git repo's:

The [VTP-dev-end](https://github.com/TrustTheVote-Project/VTP-dev-env) holds/defines the VTP development/run-time environment, including the election data repo(s) of choice.  Contained within VTP-dev-end as submodules are four repos:
- [VTP-mock-election.US.15](https://github.com/TrustTheVote-Project/VTP-mock-election.US.15) - contains the election configuration and data
- [VTP-web-api](https://github.com/TrustTheVote-Project/VTP-web-api) - contains the FASTapi rest interface
- [VoteTrackerPlus](https://github.com/TrustTheVote-Project/VoteTrackerPlus) - contains the python backend code
- this repo, [VTP-web-client](https://github.com/TrustTheVote-Project/VTP-web-client) contains the client frontend a.k.a. the voter's /UI/UX

See [DesignNotes.md](DesignNotes.md) in this repo for details on the end user (voter) user stories 

#### 3. Basic Project Plan

The basic project plan is to stub out static versions of the various pages and write the javascript to support that.  Then incrementally add support for deeper integrations with the restful web-api.  The web-api hopefully will not require major work at this point.

The four major milestones are:

1. Create just the controls and UI capability without dealing with any JSON data - just get the basic html/css/JS UI controls working in test cases.  Milestone 1 is basically about coming up to some effective degree with html/css/js and hence is only one effort week.

2. Create the 6 html pages using static JSON data.  This includes reading and sending static JSON to the screen/console.  Milestone 2 frames out the basic UX flows of the demo sans web-api interactions.

3. Plug in the web-api and use actual live JSON data from the web-api. Milestone 3 integrates the milestone 2 flows with the backend (python code).

4. Full end-to-end testing of the demo.  Allow for re-designing UX/UI stories/flows as time permits.

#### 4. Timeline

To achieve the demo all four of the above major milestones need to be completed by end of may.  Project completion means that the live demo is running without significant issues on a standalong router disconnected from any WAN.  Thus:

- Completion of milestone 1: 02/21 (1 week)
- Completion of milestone 2: 03/21 (4 weeks)
- Completion of milestone 3: 04/17 (4 weeks)
- Completion of milestone 4: 05/01 (2 weeks)

which leaves 3 weeks of buffer

#### 5. File layout (this git repo <-> end user web server)

Given the decomposition into [6 user stories](./DesingNotes.md), out-of-the-gate associate different html pages with each user story.

1. index.html
 - the landing page
 - one button that jumps to the (next) voting.html page
 - status: milestone 2 ✅

2. voting.html
 - handles voting a complete ballot
 - provides navigation to previous, next, other contests (same page)
 - provides progress status
 - includes a checkout function which submits the cast ballot to the backend
 - status: milestone 2 ✅

3. receipt.html
 - displays the ballot receipt/check
 - for demo purposes, also momentarily displays the row number
 - each digest is a link to the contest-cvr.html page
 - each row index is a link to the ballot-validation.html page
 - each column header is a link to the tally-contest.html page for that contest
 - status:

4. context-cvr.html
 - basically displays the git log for the contest CVR commit.  No code diff - just the git log.
 - has a button to tally the context while tracking this specific contest CVR
 - status:

5. verify-ballot-check.html
 - will show the digests for each of the contests with the associated contest vote count NNN
 - basically html wraps console output
 - each digest number is a link to its contest-cvr.html page
 - the 'vote NNN' is a link to the tally-contest.html page for this specific contest
 - status:

6. tally-election.html
 - handles the output of tallying a contest
 - basically wraps console output
 - support buttons to re-run the tally with different levels of verbosity (perhaps one button for each)
 - status:
 
