import { getText, getProp, getAllTexts } from './helpers.js'

describe('YouTube playlist page', () => {
  const playlistUrl =
    'https://www.youtube.com/playlist?list=PL-51WBLyFTg1gPEHotYAhNAPsisChkyTc'
  const ownerLinkSel = '#page-manager yt-page-header-view-model a'
  const metaSel =
    '#page-manager .ytContentMetadataViewModelMetadataRow span.ytContentMetadataViewModelMetadataText'

  beforeAll(async () => {
    await page.setViewport({ width: 1280, height: 889 })
    await page.goto(playlistUrl)
  })

  test('should have correct title', async () => {
    expect(await getText('#page-manager h1')).toBe('Authentication with Django & React')
  })

  test('should have correct channel name', async () => {
    const text = await getText(ownerLinkSel) // "by Dennis Ivy"
    expect(text.replace(/^by\s+/, '')).toBe('Dennis Ivy')
  })

  test('should have correct channel handle', async () => {
    const href = await getProp(ownerLinkSel, 'href')
    expect(href).toContain('@DennisIvy')
  })

  test('should have video and view counts', async () => {
    // e.g. "3 videos", "18,630 views"
    const texts = await getAllTexts(metaSel)

    expect(texts.some((t) => /\bvideos?\b/.test(t))).toBe(true)
    expect(texts.some((t) => /\bviews?\b/.test(t))).toBe(true)
  })

  test('should have a ytimg thumbnail', async () => {
    // There are several img[alt="Play all"] elements and some never get a src,
    // so wait for the one that has actually loaded a ytimg url
    const handle = await page.waitForFunction(
      () =>
        [...document.querySelectorAll('img[alt="Play all"]')]
          .map((img) => img.src)
          .find((src) => src && src.includes('ytimg')) || null,
      { timeout: 10000 }
    )

    expect(await handle.jsonValue()).toMatch(/^https:\/\/.*ytimg/)
  })

  test('should have channel avatar', async () => {
    // The page renders several copies of the header and some never get a src,
    // so wait for one that has loaded (the extension takes the first with a src)
    const handle = await page.waitForFunction(
      () =>
        [...document.querySelectorAll('#page-manager yt-page-header-view-model yt-avatar-shape img')]
          .map((img) => img.src)
          .find(Boolean) || null,
      { timeout: 10000 }
    )

    expect(await handle.jsonValue()).toMatch(/^https:\/\/yt3\./)
  })
})
