This repo was just renamed from github-rate-limit-viewer to github2. Update the names and readme appropriately. This will become a new UI for github, utilizing github app auth + user oauth to create a new client for accessing github. It needs a framework for that, with one of the pages being the already-existing rate limit viewer.

Create basic redirects that mimic github's current structure such that going to github.com/xxx/yyy/zzz/... =becomes=> newdomainsubpath.com/subpath/to/github2/xxx/yyy/zzz/ to handle re-mapping URLs.

Create a chrome and firefox extension that will mutate some github pages to add buttons to allow you to jump to the github2 version of the page. If possible, use the same extension to sync data between computers using the github2 client. Consider the future possibility of compiling the react-native app to ios and android and sharing data with those clients too (specifically configurations and things like widget configs)

Create basic pages for:

a dashboard style page with draggable + configurable frames for viewing issues/PRs
all frames have a unique query that can be used over the gql interface to github
the page actually loads from a client side DB that is kept up to date using a webworker
the webworker queries with the least filters possible and then the client applies filters client-side to avoid making queries for each widget/frame thing
aim for parity with the /notifications page or /issues page, not /pulls. In addition, make it so that the filters can be applied via a floating toolbar, rather than manually typing the query. Make it so the user can use the keyboard to type it, but with "autocomplete", but can also click and add filters as desired. Be creative with this design, the UX should be designed for speed, without listing all the filters.
A homepage with basic info about you, and a live-updating graph of the current rate limit stuff. The homepage should also have draggable/configurable frames, with the option to add a frame for issues/PRs or add a frame for
A user page, which shows the contents of the special github repo like the current one does for users and organizations
a repos page, which lists repos for the user/org
an omnisearch page, which lets you type a fragment of a login/user/org/repo/PR#, etc. Recency bumps results to the top
A PR review page with feature parity to current PR review pages. Same page should also be used to view issues.
if the PR base is not the default branch, add an info pane to the page that lists every branch name between head and the merge-base of the default branch. Be sure to consider if branches are main> b1 > b2 > b3, that if b1 is rebased on a later main, that b2 and b3 should still show it in the list and link to it appropriately despite the disparate history between the branches.
A commit view page for viewing an individual commit
A commits page for viewing commits since a specified HEAD commit
A compare page for viewing a diff between two different commits. Unlike github, for compare/abcd123..abef123 vs compare/abcd123...abef123, the compare page should be the same, and give capabilities of opening a PR with that change set
A settings SPA app for configuring the client and github settings for the user. Configurable pages should be configurable via those page SPAs, not via the settings SPA, though the individual page SPAs will likely need access to shared context with the settings SPA to avoid duplicate queries
Help docs for user facing help on how to use the app
Be extremely cognizant of how frequently the API is being queried in the client. Minimize API calls as much as possible. GraphQL may help here, but may also be impacted by a lower rate limit and potentially needing to wait for all queries to come back before returning any data. The UX needs to be fast and snappy but also mobile friendly (consider the trade off of client-side navigation vs the browser navigating to a new page and re-loading everything). Use skeleton screens and meaningful text and UX elements to indicate loading status. Ensure you have a global UX for global nav elements that is shared between pages.

As you iterate on the repo, ensure principles are well-documented and easily digestible by humans (short, succinct rules and guidance, with appendicies (later in the document linked via anchors) for examples). Principles get documented in docs/principals/principal-name.md. They are similar to AI rules/rulesets except define rules for working within the code base. You should start with empty principles for the following and document/commit decisions as you make them:

ci-design
testing (detail both unit testing and integration/e2e testing)
linting-and-formatting
Also have docs for

ai-tool-config-and-usage
detail claude.md/claude code config, and AGENTS.md
local-tooling-parity-with-ci
anything CI does needs to be easily replicable locally. Use mise for tool install and tasks running, rather than package.json.
development + typescript + bundling + deployment
detail use of how the runtime negates the need of building in dev
detail how bundles are built/tree-shaked/minified/broken-apart/delivered to clients/cached.
detail the difference in viewing on web vs offline cached version vs "install app to homepage" vs native app via react-native
detail the use of tilt (tiltdev/tilt) to run a mock server locally to emulate github pages backend. Ensure changes do a live/hot reload when possible.
detail config choices for tsconfig
especially those in a shared base config (which should be defined in it's own module, not defined at root)
especially choices for how the code in dev is used vs how it is deployed to end clients
mono-repo-setup
Detail how modules are logically separated, any validate/format/lint/test/deploy for each module.
Be sure to document any design patterns and developer-facing documentation in the docs/ folder and that all docs are up to date by the completion of your tasks. Each page should:

start with a(n empty) spec that you simply state the goal of the feature
specs go in docs/specs/feature-name/SPEC.md
supporting docs should go in the .../feature-name/... folder
research any related features on github for what is needed for parity
iterate on the spec at least 3 times. Ensure the spec is as simple as possible, but also direct and explicit. Don't build stuff you don't need yet. Make assumptions, we can iterate on it later if you have questions
Create at least a few ascii art mockups of the page and components within it for you to work from.
Start by writing pseudo code that mocks out the pieces you need
Where applicable, start with unit tests that can help drive TDD. 100% coverage is not needed, but we do need at least happy path coverage for user touch-points
Review the pseudo code and tests, and create an architecture plan with details for how you will implement it.
Implement the plan. After each change, review the plan, tests (and results), task (and associated sub-tasks), and design -- ensure it matches. Update documentation as necessary
At completion of each sub-task, perform a self review. Ensure the code is simple, maintainable, tested, well documented, modular, secure, understandable. Review your own feedback and return to step 7 -- update the plan as necessary and refine your work until it meets the quality requirements of a Staff Engineer at a FAANG company
Commit early, commit often, keep commits as atomic as possible. These are your checkpoints to go back to. Try to avoid force pushing.
Once the pages are complete, ensure a CI workflow exists for e2e tasks with a browser that can take a snapshot of each page using mock data (with configuration for optionally using real data). Ensure these artifacts are uploaded to the workflow run
---
