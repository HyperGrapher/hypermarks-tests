import { getText, getProp } from './helpers.js'

describe('YouTube video page', () => {
  const videoId = 'sYSP_elDdZw'

  beforeAll(async () => {
    // Wide viewport: comments are not rendered on narrow windows
    await page.setViewport({ width: 1280, height: 889 })
    await page.goto(`https://www.youtube.com/watch?v=${videoId}&t=1343s`)
  })

  test('should have correct title', async () => {
    // there are two ids with 'title' but only this one has an h1
    expect(await getText('#title h1')).toBe('I made Coroutines from scratch')
  })

  test('should have correct video id in the url', async () => {
    expect(new URL(page.url()).searchParams.get('v')).toBe(videoId)
  })

  test('should have correct description', async () => {
    const desc = await getText('#description #snippet-text')
    expect(desc.startsWith('Streamed Live on Twitch:')).toBe(true)
  })

  test('should have correct channel name and handle', async () => {
    const selector = '#upload-info a'
    const href = await getProp(selector, 'href')

    expect(await getText(selector)).toBe('Tsoding Daily')
    expect(href.endsWith('@TsodingDaily')).toBe(true)
    expect(href.split('@')[1]).toBe('TsodingDaily')
  })

  test('should have views and publish date tooltip', async () => {
    // "21,361 views • Jan 13, 2025"
    const tooltip = await getText('#description-inner #tooltip')

    expect(tooltip).toContain('views')
    expect(tooltip).toContain(' • ')
    expect(tooltip.endsWith('Jan 13, 2025')).toBe(true)
  })

  test('should have comment count', async () => {
    // "92 Comments" (use '#header #count span' for the number alone).
    // The header first renders as just "Comments" and the number is filled in
    // once the comments load, which is slower on CI. Comments also load lazily
    // when scrolled into view, so scroll there and wait for the number.
    await page.evaluate(() => document.querySelector('ytd-comments')?.scrollIntoView())
    await page
      .waitForFunction(
        () => /^[\d,]+\s+Comments$/.test(document.querySelector('#header #count')?.textContent.trim() ?? ''),
        { timeout: 20000 }
      )
      .catch(() => {})
    expect(await getText('#header #count')).toMatch(/^[\d,]+\s+Comments$/)
  })

  test('should have channel avatar', async () => {
    const src = await getProp('#owner #avatar img', 'src')
    expect(src.startsWith('https://yt3.ggpht.com/')).toBe(true)
  })

  test('should show subscribe button for a signed-out user', async () => {
    expect(await getText('#subscribe-button button')).toBe('Subscribe')
  })

  // The selectors below are the ones the extension scrapes with
  // (packages/shared/lib/utils/scrapers/youtube-controller.ts, getVideo)
  describe('selectors used by the extension', () => {
    test('title', async () => {
      expect(await getText('#title .style-scope .ytd-watch-metadata')).toBe('I made Coroutines from scratch')
    })

    test('channel name', async () => {
      const selector =
        '#upload-info #channel-name #container #text-container.ytd-channel-name #text a.yt-formatted-string'
      expect(await getText(selector)).toBe('Tsoding Daily')
    })

    test('channel avatar', async () => {
      const src = await getProp('#owner img#img.yt-img-shadow', 'src')
      expect(src.startsWith('https://yt3.ggpht.com/')).toBe(true)
    })

    test('video id can be read from the url', async () => {
      // same regex the extension uses to build the thumbnail url
      const id = page.url().match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)?.pop()
      expect(id).toBe(videoId)
    })
  })
})
