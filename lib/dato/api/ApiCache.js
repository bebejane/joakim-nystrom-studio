const ApiCache = {
  enabled: process.env.NODE_ENV === 'development' && process.env.DEV_CACHE,
  queries: {},
  key: (query, params) => ((Array.isArray(query) ? query.reduce((prev, curr) => prev += curr.loc.source.body, '') : query.loc.source.body) + JSON.stringify(params)).replace(/[^a-zA-Z]/g, ""),
  setCache: (key, res) => { 
    if(ApiCache.enabled) {
      ApiCache.queries[key] = res
      ApiCache.save()
    }
  },
  getCache:(query, params) => ApiCache.queries[ApiCache.key(query, params)],
  save : () => {
    const fs = require('fs')
    fs.writeFile('./.cache', JSON.stringify(ApiCache.queries))
  },
  clear :() => {
    const fs = require('fs')
    if(fs.existsSync('./.cache'))
      fs.unlinkSync('./.cache')
  }
}

if(ApiCache.enabled){
  const fs = require('fs')
  if(fs.existsSync('./.cache') && Object.keys(ApiCache.queries) === 0)
    ApiCache.queries = JSON.parse(fs.readFileSync('./.cache'))
  console.log('DEV CACHE ENABLED!')
}

export default ApiCache