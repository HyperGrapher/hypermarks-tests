import { getText, getAttr, getProp, getAllTexts } from './helpers.js'

/*
  Channel urls come in 2 forms
    - https://www.youtube.com/channel/UCRK_umSPehgKz5014NBp0Bw
    - https://www.youtube.com/@olympia

  The channel title h1 has an aria-label; the part after "," is the channel type
    - h1 aria-label="Ste Bradbury Design, Verified"
    - h1 aria-label="Olympia, Official Artist Channel"

  Other channels worth testing
    - https://www.youtube.com/@hannahceren/videos
    - https://www.youtube.com/@SteBradburyDesign/videos
    - https://www.youtube.com/@olympia
*/
describe('YouTube channel page (@AaronBlaiseArt)', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 735, height: 889 })
    await page.goto('https://www.youtube.com/@AaronBlaiseArt/videos')
  })

  test('should have correct title and channel type', async () => {
    const titleSel = '#page-header h1'
    const label = await getAttr(titleSel, 'aria-label')

    expect(await getText(titleSel)).toBe('The Art of Aaron Blaise')
    expect(label.trim()).toBe('The Art of Aaron Blaise, Verified')
    expect(label.split(', ')[1]).toBe('Verified')
  })

  test('should have correct handle', async () => {
    expect(await getText('#page-header div > span[role="text"]')).toBe('@AaronBlaiseArt')
  })

  test('should have correct description', async () => {
    const desc = await getText('#page-header yt-description-preview-view-model span[role="text"]')
    expect(desc.startsWith('Welcome to The Art of Aaron Blaise.')).toBe(true)
  })

  test('should have subscriber and video counts', async () => {
    // "1.36M subscribers", "986 videos"
    const texts = await getAllTexts(
      '#page-header yt-content-metadata-view-model span.ytContentMetadataViewModelMetadataText'
    )

    expect(texts.some((t) => t.includes('subscribers'))).toBe(true)
    expect(texts.some((t) => t.includes('videos'))).toBe(true)
  })

  test('should have avatar image', async () => {
    const src = await getProp('#page-header img', 'src')
    expect(src.startsWith('https://yt3')).toBe(true)
  })

  test('should have banner image', async () => {
    const src = await getProp('yt-image-banner-view-model img', 'src')
    expect(src.startsWith('https://yt3')).toBe(true)
  })
})
