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

  // Same lookup the extension does (findOpenMenuList): a visible dropdown in the
  // popup container whose list has children. Closed dropdowns stay in the DOM but
  // are hidden. Also returns what the page looks like, to explain a failure.
  const readMenu = (listSelector) =>
    page.evaluate((selector) => {
      const dropdowns = [...document.querySelectorAll('ytd-popup-container tp-yt-iron-dropdown')].map((dropdown) => {
        const list = dropdown.querySelector(selector)
        return {
          visible: dropdown.getClientRects().length > 0,
          list: list ? list.tagName.toLowerCase() : null,
          items: list ? list.childElementCount : 0,
        }
      })
      const open = dropdowns.find((d) => d.visible && d.list && d.items > 0)
      return {
        items: open ? open.items : 0,
        dropdowns,
        popupContainerChildren: [...(document.querySelector('ytd-popup-container')?.children ?? [])].map((el) =>
          el.tagName.toLowerCase()
        ),
        url: location.href,
      }
    }, listSelector)

  // The first card that is a plain video (not a playlist / mix) with a visible three-dots button
  const findMenuButton = () =>
    page.evaluateHandle(
      (lockupSel, buttonSel) => {
        for (const lockup of document.querySelectorAll(lockupSel)) {
          const href = lockup.querySelector('a[href*="/watch?v="]')?.getAttribute('href') ?? ''
          if (!href || new URL(href, location.origin).searchParams.has('list')) continue
          const button = lockup.querySelector(`${buttonSel} button`)
          if (button && button.getClientRects().length > 0) return button
        }
        return null
      },
      LOCKUP,
      MENU_BUTTON
    )

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
    // YouTube attaches the click handlers of the cards a moment after rendering them,
    // which takes longer on a slow CI runner. A click before that does nothing, so retry.
    let menu
    for (let attempt = 1; attempt <= 3; attempt++) {
      await page.keyboard.press('Escape') // close the menu of a previous attempt
      const button = (await findMenuButton()).asElement()
      if (!button) throw new Error('No video card with a visible three-dots button was found')

      await button.evaluate((el) => el.scrollIntoView({ block: 'center' }))
      await button.click()

      await page.waitForFunction(
        (selector) =>
          [...document.querySelectorAll('ytd-popup-container tp-yt-iron-dropdown')].some(
            (dropdown) =>
              dropdown.getClientRects().length > 0 && (dropdown.querySelector(selector)?.childElementCount ?? 0) > 0
          ),
        { timeout: 6000 },
        MENU_LIST
      ).catch(() => {})

      menu = await readMenu(MENU_LIST)
      if (menu.items > 0) break
    }

    // The diagnostics make a failure on CI explain itself in the log
    if (menu.items === 0) throw new Error(`The three-dots menu did not open: ${JSON.stringify(menu)}`)
    expect(menu.items).toBeGreaterThan(0)
  })
})
