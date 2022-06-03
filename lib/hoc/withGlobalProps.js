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
      
      return {
        type: slide.type.replace('_slide', ''),
        assignmentId: slide.assignment?.id || null,
        title: slide.assignment?.title || null,
        description: slide.assignment?.description || null,
        year: slide.assignment?.year || null,
        client: slide.assignment?.client?.name || null,
        collaborator: slide.assignment?.collaborator ? slide.assignment.collaborator.map(({name}) => name).join(', ') : null,
        data: slide.data,
        margin: slide.margin || false
      }
    })
    
    props.slides = slides

    if(callback)
      return await callback({context, props: {...props}, revalidate});
    else
      return { props:{...props}, context, revalidate};
  }
}