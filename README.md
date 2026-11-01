# ai-tabs-website-selector-tests

Test custom websites and their page elements used in the chrome extension.
Ideally run everyday to detect if any change in website structure
which would cause failure in the chrome extension.

### Chrome Extension:

[ai-tabs-browser-extension repo](https://github.com/HyperGrapher/ai-tabs-browser-extension)

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
- youtube.com (video, channel, playlist)
