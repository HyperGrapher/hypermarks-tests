import { getAttr } from './helpers.js'

/*
  For any other website the extension saves a generic item
  (packages/shared/lib/utils/scrapers/get-generic.ts):
    - title:       document.title, falls back to the first <h1>
    - description: <meta name="description">, falls back to the first <h2>
*/
describe('Generic page (dev.to article)', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1200, height: 889 })
    await page.goto('https://dev.to/syncfusion/typescript-generics-a-complete-guide-3ie3')
  })

  test('should have a document title', async () => {
    expect(await page.title()).toContain('TypeScript Generics: A Complete Guide')
  })

  test('should have a meta description', async () => {
    const description = await getAttr('meta[name="description"]', 'content')
    expect(description.trim()).not.toBe('')
  })

  test('should have an h1 to fall back to', async () => {
    const h1 = await page.$eval('h1', (el) => el.textContent.trim())
    expect(h1).toBe('TypeScript Generics: A Complete Guide')
  })

  test('should have an h2 to fall back to', async () => {
    const h2 = await page.$eval('h2', (el) => el.textContent.trim())
    expect(h2).not.toBe('')
  })
})
