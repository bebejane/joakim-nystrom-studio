const cacheFile = './.cache'

global.ApiCache = global.ApiCache || {
  enabled: process.env.NODE_ENV === 'development' && process.env.DEV_CACHE,
  key: (query, params = {}) => ((Array.isArray(query) ? query.reduce((prev, curr) => prev += JSON.stringify(curr.definitions), '') : JSON.stringify(query.definitions)) + JSON.stringify(params)).replace(/[^a-zA-Z]/g, ""),
  setCache: (key, res) => { 
    if(!ApiCache.enabled) return
    const queries = JSON.parse(ApiCache.fs().readFileSync(cacheFile))
    queries[key] = res
    ApiCache.save(queries)
  },
  getCache:(query, params) => {
    if(!ApiCache.enabled) return
    const queries = JSON.parse(ApiCache.fs().readFileSync(cacheFile))
    const res = queries[ApiCache.key(query, params)]
    if(!res) console.log('notcached')
    return res
  },
  save : (data) => {
    if(!ApiCache.enabled) return
    ApiCache.fs().writeFile(cacheFile, JSON.stringify(data), ()=>{})
  },
  clear :() => {
    const fs = require('fs')
    if(ApiCache.fs().existsSync(vacheFile))
      ApiCache.fs().unlinkSync(cacheFile)
  },
  fs:()=>{
    if(!ApiCache.enabled) return
    const fs = require('fs')
    if(!fs.existsSync(cacheFile))
      fs.writeFileSync(cacheFile, '{}')
    return fs;
  }
}

module.exports = ApiCache