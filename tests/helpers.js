// Small DOM helpers on top of the global jest-puppeteer `page`.
// Each one waits for the selector first, so a changed website fails with
// "Waiting for selector `...` failed" instead of a null-reference error.

const WAIT = { timeout: 10000 }

export async function getText(selector) {
  await page.waitForSelector(selector, WAIT)
  return page.$eval(selector, (el) => el.textContent.trim())
}

export async function getProp(selector, prop) {
  await page.waitForSelector(selector, WAIT)
  return page.$eval(selector, (el, p) => el[p], prop)
}

export async function getAttr(selector, name) {
  await page.waitForSelector(selector, WAIT)
  return page.$eval(selector, (el, n) => el.getAttribute(n), name)
}

export async function getAllTexts(selector) {
  await page.waitForSelector(selector, WAIT)
  return page.$$eval(selector, (els) => els.map((el) => el.textContent.trim()))
}

export async function getAllProps(selector, prop) {
  await page.waitForSelector(selector, WAIT)
  return page.$$eval(selector, (els, p) => els.map((el) => el[p]), prop)
}
