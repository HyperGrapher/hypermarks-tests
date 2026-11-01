// Uses the Chrome that Puppeteer downloads on install (no system Chrome needed).
// GitHub Actions and most CI providers set CI=true; Linux runners need --no-sandbox.
const isCI = Boolean(process.env.CI)

module.exports = {
  launch: {
    headless: true,
    args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  },
}
