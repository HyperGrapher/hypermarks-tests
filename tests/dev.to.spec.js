import { getText, getAttr, getAllProps } from './helpers.js'

describe('dev.to article', () => {
  const articleUrl = 'https://dev.to/syncfusion/typescript-generics-a-complete-guide-3ie3'

  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 889 })
    await page.goto(articleUrl)
  })

  test('should have correct tags', async () => {
    const hrefs = await getAllProps('a.crayons-tag', 'href')

    expect(hrefs).toHaveLength(4)
    expect(hrefs).toEqual(
      expect.arrayContaining([
        'https://dev.to/t/javascript',
        'https://dev.to/t/javascriptprogrammin',
        'https://dev.to/t/typescript',
        'https://dev.to/t/webdev',
      ])
    )
  })

  test('should have correct publish time', async () => {
    // The first <time.date> is the article's publish time
    expect(await getAttr('time.date', 'datetime')).toBe('2025-01-02T12:12:27Z')
    expect(await getAttr('time.date', 'title')).toBe('Thursday, January 2, 2025 at 3:12:27 PM')
  })

  test('should have correct title', async () => {
    expect(await getText('header#main-title h1')).toBe('TypeScript Generics: A Complete Guide')
  })
})
