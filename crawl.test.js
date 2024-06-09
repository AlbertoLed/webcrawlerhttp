const { test, expect, describe } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML } = require('./crawl.js')

describe('normalizeURL', () => {
  test('without path', () => {
    const input = 'https://blog.boot.dev'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev'
    expect(actual).toEqual(expected)
  })
  test('with path', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  test('with slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
  test('empty string', () => {
    const input = ''
    const actual = normalizeURL(input)
    const expected = ''
    expect(actual).toEqual(expected)
  })
})

describe('getURLsFromHTML', () => {
  test('absolute urls', () => {
    const inputHTML = `
<html>
    <body>
        <a href="https://blog.boot.dev/">
        Boot.dev
        </a>
        <a href="https://blog.boot.dev/some/path/">
        Boot.dev
        </a>
    </body>
</html>
    `
    const inputURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTML, inputURL)
    const expected = ['https://blog.boot.dev/', 'https://blog.boot.dev/some/path/']
    expect(actual).toEqual(expected)
  })
  test('relative urls', () => {
    const inputHTML = `
<html>
    <body>
        <a href="/path/">
        Boot.dev
        </a>
        <a href="/some/really/long/path/">
        Boot.dev
        </a>
    </body>
</html>
    `
    const inputURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTML, inputURL)
    const expected = ['https://blog.boot.dev/path/', 'https://blog.boot.dev/some/really/long/path/']
    expect(actual).toEqual(expected)
  })
  test('invalid urls', () => {
    const inputHTML = `
<html>
    <body>
        <a href="invalid">
        Boot.dev
        </a>
    </body>
</html>
    `
    const inputURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTML, inputURL)
    const expected = []
    expect(actual).toEqual(expected)
  })
})
