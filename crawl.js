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
        if (baseURL.slice(-1) === '/') {
          baseURL = baseURL.slice(0, -1)
        }
        const tryurl = new URL(`${baseURL}${url}`)
        urls.push(tryurl.href)
      } catch (err) {
        console.error('Invalid URL', err.message)
      }
    } else {
      // Absolute url
      try {
        const tryurl = new URL(url)
        urls.push(tryurl.href)
      } catch (err) {
        console.error('Invalid URL', err.message)
      }
    }
  }
  return urls
}

async function crawlPage (baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    // currentURL is outside of the the baseURL page
    return pages
  }

  const normalizedCurrentURL = normalizeURL(currentURL)
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++
    return pages
  }

  pages[normalizedCurrentURL] = 1

  console.log(`Crawling ${currentURL}`)

  try {
    const res = await fetch(currentURL)

    if (res.status >= 400) {
      console.error(`Failed to fetch url. Status code ${res.status}`)
      return pages
    }

    const contentType = res.headers.get('content-type')
    if (contentType !== 'text/html; charset=utf-8') {
      console.error(`No html response. content-type: ${contentType}`)
    }

    const htmlPage = await res.text()
    const nextURLs = getURLsFromHTML(htmlPage, baseURL)
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages)
    }
  } catch (e) {
    console.error('Failed to fetch url:', e.message)
  }
  return pages
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}
