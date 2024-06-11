const { crawlPage } = require('./crawl.js')

async function main () {
  if (process.argv.length !== 3) {
    console.error('No website provided or too many arguments.')
    process.exit(1)
  }
  const baseURL = process.argv[2]
  console.log(baseURL)

  const pages = await crawlPage(baseURL, baseURL, {})
  console.log('==============================')
  console.log('==========  REPORT  ==========')
  console.log('==============================')
  console.log('Found - URL')
  for (const page of Object.entries(pages)) {
    console.log(page[1].toString().padStart(5) + '   ' + page[0])
  }
  console.log('==============================')
  console.log('========  END REPORT  ========')
  console.log('==============================')
}

main()
