import { getAttr, getText } from './helpers.js'

/*
  The extension adds a "Save to HyperMarx" item to the three-dots menu of the
  recommended videos next to the player (pages/content/src/youtube-menu.ts).
  It relies on the structure of the video cards ("lockups") and of the popup menu.
*/
describe('YouTube recommended video cards (three-dots menu)', () => {
  const LOCKUP = 'yt-lockup-view-model'
  const MENU_BUTTON = 'yt-lockup-metadata-view-model button-view-model'
  const MENU_LIST = 'yt-list-view-model, tp-yt-paper-listbox#items'

  beforeAll(async () => {
    // Wide viewport: the recommendations are shown next to the player
    await page.setViewport({ width: 1280, height: 889 })
    await page.goto('https://www.youtube.com/watch?v=sYSP_elDdZw')
    await page.waitForSelector(LOCKUP, { timeout: 20000 })
  })

  test('should have recommended video cards', async () => {
    const count = await page.$$eval(LOCKUP, (els) => els.length)
    expect(count).toBeGreaterThan(0)
  })

  test('should have a watch link with a video id', async () => {
    const href = await getAttr(`${LOCKUP} a[href*="/watch?v="]`, 'href')
    const videoId = new URL(href, 'https://www.youtube.com').searchParams.get('v')

    expect(videoId).toMatch(/^[\w-]{11}$/)
  })

  test('should have a title', async () => {
    const selector = `${LOCKUP} yt-lockup-metadata-view-model h3`
    const title = await getAttr(selector, 'title')

    expect(title || (await getText(selector))).not.toBe('')
  })

  test('should have a channel name row', async () => {
    const text = await getText(`${LOCKUP} [class*="etadataRow"], ${LOCKUP} [class*="metadata-row"]`)
    expect(text).not.toBe('')
  })

  test('should have a three-dots button on the card', async () => {
    const count = await page.$$eval(`${LOCKUP} ${MENU_BUTTON}`, (els) => els.length)
    expect(count).toBeGreaterThan(0)
  })

  test('should open a popup menu with items to inject into', async () => {
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), LOCKUP)
    await page.click(`${LOCKUP} ${MENU_BUTTON} button`)

    // Same lookup the extension does: a visible dropdown in the popup container
    // whose list has children (closed dropdowns stay in the DOM but are hidden)
    const handle = await page.waitForFunction(
      (listSelector) => {
        for (const dropdown of document.querySelectorAll('ytd-popup-container tp-yt-iron-dropdown')) {
          if (dropdown.getClientRects().length === 0) continue
          const list = dropdown.querySelector(listSelector)
          if (list && list.childElementCount > 0) return list.childElementCount
        }
        return null
      },
      { timeout: 10000 },
      MENU_LIST
    )

    expect(await handle.jsonValue()).toBeGreaterThan(0)
  })
})
