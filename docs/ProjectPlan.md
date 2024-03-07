# VoteTracker+ Client Side UI/UX Project Plan

#### 1. Background

The current design target is to create a usable client/voter frontend in a few weeks for a June 8th live demo.  The date and available skill level are driving the client UI side design and implementation.

The current tech choice to achieve this is a plain html, css, and javascript implementation.  The current development  environment is Google's devtools, Microsoft's Visual Studio Code, and emacs :-).

See the VoteTracker+ [project page](https://github.com/orgs/TrustTheVote-Project/projects/2/views/1) for status.

#### 2. Overall VTP Git Repo Context

Summary of the VTP git repo's:

The [VTP-dev-end](https://github.com/TrustTheVote-Project/VTP-dev-env) holds/defines the development/run-time environment.  Contained within VTP-dev-end as submodules are three repos:
- [VTP-mock-election.US.15](https://github.com/TrustTheVote-Project/VTP-mock-election.US.15) - contains the election configuration and data
- [VTP-web-api](https://github.com/TrustTheVote-Project/VTP-web-api) - contains the FASTapi rest interface
- [VoteTrackerPlus](https://github.com/TrustTheVote-Project/VoteTrackerPlus) - contains the python backend code

This repo, [VTP-web-client](https://github.com/TrustTheVote-Project/VTP-web-client) contains the client frontend a.k.a. the voter's /UI/UX

See [DesignNotes.md](DesignNotes.md) in this repo for details on the end user (voter) user stories 

#### 3. Basic Project Plan

The basic project plan is to stub out static versions of the various pages and write the javascript to support that.  Then incrementally add support for deeper integrations with the restful web-api.  The web-api hopefully will not require major work at this point.

The four major milestones are:

1. Create just the controls and UI without dealing with any JSON data - just get the basic html/css/JS UI controls for the five web pages (see below) working.

2. Add JSON decoding support and integrate with static JSON data.  This includes reading and sending (static) JSON to a stubbed out backend.

3. Plug in the web-api and use actual live JSON data from the web-api

4. Full end-to-end testing of the demo

#### 4. Timeline

To achieve the demo all four of the above major milestones need to be completed by end of may.  Project completion means that the live demo is running without significant issues on a standalong router disconnected from any WAN.  Thus:

- Completion of milestone 1: 02/21 (1 week)
- Completion of milestone 2: 03/21 (4 weeks)
- Completion of milestone 3: 04/17 (4 weeks)
- Completion of milestone 4: 05/01 (2 weeks)

which leaves 3 weeks of buffer

#### 5. File layout (this git repo <-> end user web server)

Given the decomposition into [5 user stories](./DesingNotes.md), out-of-the-gate associate different html pages with each user story.

1. index.html
 - the landing page
 - one js button that jumps to the (next) voting.html page
2. voting.html
 - handles a single contest
 - provides navigation to previous, next, other contests (same page), and to the checkout.html page
 - provides progress status
3. checkout.html
 - allows the voter to double check their ballot prior to casting
 - does not support editing the ballot
 - provides three options: spoil ballot (exit), edit ballot (back to voting.html), and submit/cast ballot
4. ballot check displaying
 - either create the JS to retrieve the data from the web-api (new endpoint), creating an explicit ballot-check.html
 - or standup a http server running somewhere that is pointing to the repo of interest for the demo.  This would probably require changing the upstream remote git repo URI to the demo LAN local git server, which would be ok as it would completely isolate the demo.
5. verify-ballot-check.html
 - handles the output of the ballot check function (basically console log output)
 - supplies various end user functions associated with verify their ballot check - a UX TBD
6. tally-election.html
 - handles the output of tallying the election (basically console log output)
- initial UX target is to supply a few buttons for enabling switches and converting digests to links (back to the local LAN git server or the upstream remote - see 3 above)

Regarding css and javascript, created as needed in standard locations.
