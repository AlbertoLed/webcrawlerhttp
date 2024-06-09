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

module.exports = {
  normalizeURL
}
