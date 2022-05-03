const cacheFile = './.cache'

global.ApiCache = global.ApiCache || {
  enabled: process.env.NODE_ENV === 'development' && process.env.DEV_CACHE,
  key: (query, params = {}) => ((Array.isArray(query) ? query.reduce((prev, curr) => prev += JSON.stringify(curr.definitions), '') : JSON.stringify(query.definitions)) + JSON.stringify(params)).replace(/[^a-zA-Z]/g, ""),
  setCache: (key, res) => { 
    if(!ApiCache.enabled) return
    const fs = require('fs')
    const queries = JSON.parse(fs.readFileSync(cacheFile))
    queries[key] = res
    ApiCache.save(queries)
  },
  getCache:(query, params) => {
    if(!ApiCache.enabled) return
    const fs = require('fs')
    const queries = JSON.parse(fs.readFileSync(cacheFile))
    const res = queries[ApiCache.key(query, params)]
    if(!res) console.log('notcached')
    return res
  },
  save : (data) => {
    if(!ApiCache.enabled) return
    const fs = require('fs')
    fs.writeFile(cacheFile, JSON.stringify(data), ()=>{})
  },
  clear :() => {
    const fs = require('fs')
    if(fs.existsSync(vacheFile))
      fs.unlinkSync(cacheFile)
  },
}

module.exports = ApiCache