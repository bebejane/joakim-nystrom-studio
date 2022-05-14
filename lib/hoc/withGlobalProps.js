import { apiQuery, SEOQuery } from "/lib/dato/api";
import { GetGlobal, GetAllArtwork, GetStart, GetStudio} from '/graphql';

export default function withGlobalProps(opt = {}, callback){

  callback = typeof opt === 'function' ? opt : callback;

  const revalidate = parseInt(process.env.REVALIDATE_TIME || 60)
  
  const queries = [GetGlobal, GetAllArtwork, GetStart, GetStudio]
  
  if(opt.query) 
    queries.push(opt.query)
  if(opt.queries) 
    queries.push.apply(queries, opt.queries)
  if(opt.model) 
    queries.push(SEOQuery(opt.model))

  return async (context) => {
    
    const props = await apiQuery(queries, {}, context.preview);
    const assignments = props.start.slides.filter(s => s.__typename === 'AssignmentRecord')
    const slides = props.start.slides.map((slide) => ({
      assignmentId: slide.id,
      title: slide.title || null,
      image: slide.images?.[0] || null,
      text: slide.text || null,
      year: slide.text || null,
      type: slide.text ? 'text' : slide.images?.[0].mimeType.startsWith('video') ? 'video' : 'image',
      slug: !slide.link ? slide.slug : slide.link.__typename === 'StudioRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
    }))

    // Duplicate slides temp
    slides.push.apply(slides, props.start.slides.filter(s => !s.text).map(slide => ({
      title: slide.title || null,
      assignmentId: slide.id,
      image: slide.images?.[1] || slide.images?.[0] || null,
      text: slide.text || null,
      type: slide.text ? 'text' : (slide.images?.[1] || slide.images?.[0]).mimeType.startsWith('video') ? 'video' : 'image',
      slug: !slide.link ? slide.slug : slide.link.__typename === 'StudioRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
    })))
    
    props.slides = slides
    props.assignments = assignments

    if(callback)
      return await callback({context, props: {...props}, revalidate});
    else
      return { props:{...props}, context, revalidate};
  }
}