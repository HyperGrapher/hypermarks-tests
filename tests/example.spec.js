import { getText } from './helpers.js'

describe('Example.com', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 889 })
    await page.goto('https://example.com/')
  })

  // example.com no longer renders an <h1>; the heading text is only in <title>
  test('should have correct title', async () => {
    expect(await page.title()).toBe('Example Domain')
  })

  test('should have correct description', async () => {
    const text = await getText('p')
    expect(text.startsWith('This domain is for use in documentation examples')).toBe(true)
  })
})
