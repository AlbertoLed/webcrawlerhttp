const { JSDOM } = require('jsdom')

function normalizeURL (urlString) {
  if (urlString.length === 0) {
    return urlString
  }
  const url = new URL(urlString)
  if (url.pathname.slice(-1) === '/') {
    return `${url.hostname}${url.pathname.slice(0, -1)}`
  }
  return `${url.hostname}${url.pathname}`
}

function getURLsFromHTML (html, baseURL) {
  const urls = []
  const dom = new JSDOM(html)
  const linkElements = dom.window.document.querySelectorAll('a')

  for (const linkElement of linkElements) {
    const url = linkElement.href
    if (url.slice(0, 1) === '/') {
      // Relative url
      try {
        const tryurl = new URL(`${baseURL}${url}`)
        urls.push(tryurl.href)
      } catch (err) {
        console.error('Invalid URL', err.message)
        return []
      }
    } else {
      // Absolute url
      try {
        const tryurl = new URL(url)
        urls.push(tryurl.href)
      } catch (err) {
        console.error('Invalid URL', err.message)
        return []
      }
    }
  }
  return urls
}

module.exports = {
  normalizeURL,
  getURLsFromHTML
}
