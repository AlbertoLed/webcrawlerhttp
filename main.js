const { crawlPage } = require('./crawl.js')

function main () {
  if (process.argv.length !== 3) {
    console.error('No website provided or too many arguments.')
    process.exit(1)
  }
  const baseURL = process.argv[2]
  console.log(baseURL)

  crawlPage(baseURL)
}

main()
