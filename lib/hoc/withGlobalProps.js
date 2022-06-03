import { apiQuery, SEOQuery } from "/lib/dato/api";
import { GetGlobal, GetAllArtwork, GetStart, GetStudio, GetAllAssignments} from '/graphql';

export default function withGlobalProps(opt = {}, callback){

  callback = typeof opt === 'function' ? opt : callback;

  const revalidate = parseInt(process.env.REVALIDATE_TIME || 60)
  
  const queries = [GetGlobal, GetAllArtwork, GetAllAssignments, GetStart, GetStudio]
  
  if(opt.query) 
    queries.push(opt.query)
  if(opt.queries) 
    queries.push.apply(queries, opt.queries)
  if(opt.model) 
    queries.push(SEOQuery(opt.model))

  return async (context) => {
    
    const props = await apiQuery(queries, {}, context.preview);
    const slides = props.start.slides.map((slide) => {
      
      const subtitles = []
      if(slide.assignment?.year)
        subtitles.push({type:'Year', value:slide.assignment?.year})
      if(slide.assignment?.client)
        subtitles.push({type:'Client', value:slide.assignment?.client.name})
      if(slide.assignment?.collaborator?.length)
        subtitles.push({type:'Collaborator', value:slide.assignment?.collaborator.map(c => c.name).join(', ')})
      
      return {
        type: slide.type.replace('_slide', ''),
        assignmentId: slide.assignment?.id || null,
        title: slide.assignment?.title || null,
        subtitle: subtitles.map(({type, value}) => `${type}: ${value}`).join(' · '),
        data: slide.data,
        margin: slide.margin || null
      }
    })
    
    props.slides = slides

    if(callback)
      return await callback({context, props: {...props}, revalidate});
    else
      return { props:{...props}, context, revalidate};
  }
}