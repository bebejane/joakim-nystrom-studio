require('dotenv').config({path:'./.env.local'})
const contentful = require("contentful");
const { SiteClient } = require('datocms-client');
const datoClient = new SiteClient(process.env.GRAPHQL_API_TOKEN);
const client = contentful.createClient({space: process.env.CONENTFUL_SPACE_ID, accessToken: process.env.CONENTFUL_API_TOKEN});
const assignmentModelId = '166387'

const migrateMedia = async (url, title) => {
  console.log('upload', url)
  const path = await datoClient.createUploadPath(url);
  const defaultFieldMetadata = title ? {
    en: {
      alt: title,
      title: title,
      customData:{}
    }
  } : null
  
  let data = { path }
  if(defaultFieldMetadata)
    data = {...data, defaultFieldMetadata}

  const upload = await datoClient.uploads.create(data);
  return upload
}

const uploadMedia = async (arr, key, tags) => {
  const uploads = []
  for (let i = 0; i < arr.length; i++) 
    uploads.push(migrateMedia(arr[i][key], tags))
  const res = await Promise.all(uploads)
  return res.map( r => r ? ({upload_id:r.id}) : undefined);
}


// ##################################################### //

(async()=>{

  const aTypes = await datoClient.items.all({filter:{type:'assignment_type'}})
  console.log(aTypes)
  
  const response = await client.getEntries()
  const assignments = response.items.filter(i => i.sys.contentType.sys.id === 'assignment')

  for (let i = 0; i < assignments.length; i++) {
    const item = response.items[i];
    const { title, description, type : types, slug, openAtInit:open, media} = item.fields
    const assignmentType = aTypes.filter(t => types && types.includes(t.value.toLowerCase())).map( t => t.id)
    const images = []
    
    if(media && media.length){
      for (let x = 0; x < media.length; x++) {
        const url = `https:${media[x].fields.file.url}`;
        const title = media[x].fields.title
        const fileName = media[x].fields.file.fileName;
        const upload = await migrateMedia(url, title)
        images.push({upload_id:upload.id, title, alt:title})        
      }
    }
      
    const ass = {
      itemType: assignmentModelId,
      title: title?.trim(),
      description: description?.trim(),
      slug,
      open
    }
    if(assignmentType.length)
      ass.assignmentType = assignmentType
    if(images.length)
      ass.images = images
    console.log(ass.title)
    const assignment = await datoClient.item.create(ass)    
  }
})()
