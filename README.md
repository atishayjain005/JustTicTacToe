# JustTicTacToe

A local two-player tic-tac-toe game built with HTML, CSS and JavaScript. No account, backend, API key, runtime dependency or build step is needed.

## Play

X starts. Players share one device, taking turns to place a mark in an empty square. Three marks in a row, column or diagonal win; a full board without a winner is a draw. Completed rounds cannot accept more moves. Restart clears the board and returns keyboard focus to the first square.

Use Tab / Shift+Tab to choose a square and Enter or Space to play. Cells announce their position and contents; a live status announces turns and outcomes. Winning squares have a border and underline as well as a different background. The layout fits narrow screens down to 320px.

There is no AI opponent, online multiplayer or saved score. Reloading starts a new game.

## Run locally

Open `index.html` directly, or serve the repository with Python 3:

```sh
python3 -m http.server 4177 --bind 127.0.0.1
```

Visit http://127.0.0.1:4177. All game assets are local; no CDN connection is required. JavaScript must be enabled.

## Validate

Use Node.js 24, npm and Python 3. Install the test dependency:

```sh
npm ci
npx playwright install chromium
npm run check
CI=1 npm test
npm audit --audit-level=high
```

`npm test` uses installed Google Chrome locally; `CI=1 npm test` uses Playwright Chromium. Tests start and stop their own local server on port 4177. Free that port before running them.

The 32 desktop/mobile cases cover every winning line, either player winning, final-move wins, post-win guards, occupied-square guards, draws, restart, keyboard controls, accessible cell names and statuses, target dimensions, and narrow-screen overflow. The layout test blocks external HTTPS assets. Generated screenshots and reports are ignored by Git. GitHub Actions runs the same syntax and browser checks for pushes and pull requests. There is no bundler or TypeScript compiler; `check` is a JavaScript syntax check, not a lint rule suite.

## Deployment

Existing free GitHub Pages site: https://atishayjain005.github.io/JustTicTacToe/

Pages is configured from `main`, repository root. A feature branch or open PR does **not** update the public site. After review and merge, wait for the Pages build, then verify the live site at desktop and 320px widths: play a win, attempt another move, restart using the keyboard, and play a draw. Confirm the served `script.js` matches the merged version. Do not claim deployment from a local build or successful test alone.

## Maintenance

The UI and game state live in `index.html`, `style.css` and `script.js`. Browser regressions live in `tests/game.spec.js`. Scope and remaining deployment work are recorded in [the improvement log](docs/improvement-log.md) and [GitHub Project 13](https://github.com/users/atishayjain005/projects/13).
