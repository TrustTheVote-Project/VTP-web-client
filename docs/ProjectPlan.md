## Project Plan

The basic idea is to stub out static versions of the various pages and write the javascript to support not.  Then incrementally add support for a deeper and deeper integration with the web-api.  The web-api hopefully will not need major changes.

1. Create just the controls and UI without dealing with any JSON data - just get the UI controls going

2. Add JSON decoding support and integrate with static JSON data.  This includes reading and sending JSON.

3. Start plugging in the web-api and to start using actual live JSON data from the web-api

4. Start debugging live tests

#### Tiemline

Working backwards, need to complete all four of the above by end of may.  Completion means that the live demo is running without significant issues on a stand along router.  Working backwards:

- Completion of #1: 02/21 (1 week)
- Completion of #2: 03/21 (4 weeks)
- Completion of #3: 04/17 (4 weeks)
- Completion of #4: 05/01 (2 weeks)

which leaves 3 weeks of buffer
