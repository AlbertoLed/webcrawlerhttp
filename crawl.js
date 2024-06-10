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

async function crawlPage (currentURL) {
  try {
    const res = await fetch(currentURL)

    if (res.status >= 400) {
      console.error(`Failed to fetch url. Status code ${res.status}`)
      return
    }

    const contentType = res.headers.get('content-type')
    if (contentType !== 'text/html; charset=utf-8') {
      console.error(`No html response. content-type: ${contentType}`)
    }

    const text = await res.text()
    console.log(text)
  } catch (e) {
    console.error('Failed to fetch url:', e.message)
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}
