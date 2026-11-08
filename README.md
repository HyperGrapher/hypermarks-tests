# hypermarks-website-selector-tests

Test custom websites and their page elements used in the chrome extension.
Ideally run everyday to detect if any change in website structure
which would cause failure in the chrome extension.

### Chrome Extension:

[hypermarks-browser-extension repo](https://github.com/HyperGrapher/hypermarks-browser-extension)

### Install and run:
- pnpm install (also downloads the Chrome that Puppeteer uses, no system Chrome needed)
- pnpm test

### CI:
`.github/workflows/daily-tests.yml` runs the tests every day at 06:00 UTC and can
also be started manually from the Actions tab ("Run workflow").

When the `CI` environment variable is set (GitHub Actions does this), Chrome is
launched with `--no-sandbox`. See `jest-puppeteer.config.cjs`.

### Writing tests:
Specs use the global `page` from `jest-puppeteer`. Shared DOM helpers
(`getText`, `getProp`, `getAttr`, ...) live in `tests/helpers.js`.

### Websites:

- dev.to
- example.com
- generic pages (title / meta description / h1 / h2 fallbacks, see `tests/generic.spec.js`)
- youtube.com (video, channel, playlist, and the three-dots menu of recommended videos)

### Not covered:

- x.com posts and profiles: the extension scrapes the logged-in app (`data-testid` attributes,
  `[data-testid="tweet"][tabindex="-1"]`). The signed-out pages a test can reach render a different
  DOM without any `data-testid`, so those selectors cannot be checked without a logged-in account.
