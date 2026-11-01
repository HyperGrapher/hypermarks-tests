// Uses the Chrome that Puppeteer downloads on install (no system Chrome needed).
// GitHub Actions and most CI providers set CI=true; Linux runners need --no-sandbox.
const isCI = Boolean(process.env.CI)

module.exports = {
  // Third-party scripts (e.g. dev.to's "Failed to fetch" when a request is
  // blocked on CI) throw uncaught errors in the page. They must not fail the
  // whole suite, only the assertions on the elements we check should.
  exitOnPageError: false,
  launch: {
    headless: true,
    args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  },
}
