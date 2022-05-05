import { Dato } from "/lib/dato/api"

const timeout = 8000;

const getPathsFromPayload = async (payload) => {
  
  const record = await getRecordFromPayload(payload)
  const paths = []
  const { apiKey } = record;

  if(apiKey === 'assignment'){
    paths.push(`/${record.slug}`)
    paths.push(`/`)
  }else if(apiKey === 'artwork'){
    paths.push(`/artwork`)
  }else if(apiKey === 'about'){
    paths.push(`/about`)
  }
  return paths;
}

export default async (req, res) => {

  if(!basicAuth(req)) return res.status(401).send('Access denied')
  
  try{
    
    const payload = req.body?.entity;
    if(!payload) throw 'Payload is empty'

    const paths = await getPathsFromPayload(payload)
    
    if(!paths.length) 
      throw new Error(`Nothing to revalidate`);
    
    const t = new Date().getTime()
    const res = Promise.all(paths.map(path => res.unstable_revalidate(path)))
    const duration = (new Date().getTime()-t)/1000
    res.json({ revalidated: true, paths, duration })

  }catch(err){
    console.error(err)
    res.status(500).send(`Error revalidating: ${err.message || err }`)
  }
}

const getRecordFromPayload = async (payload) => {
  
  const modelId = payload?.relationships?.item_type?.data?.id
  
  if(!modelId) throw 'Model id not found in payload!'

  const models = await Dato.itemTypes.all();
  const model = models.filter(m => m.id === modelId)[0]
  const record = (await Dato.items.all({filter: {type: model.apiKey, fields:{id: {eq:payload.id }}}},{allPages: true}))[0]
  if(!record) 
    throw `No record found with modelId: ${modelId}`
  return record
}

const basicAuth = (req) => {
  const basicAuth = req.headers.authorization
  if (!basicAuth) return true;

  const auth = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  return user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD
} 