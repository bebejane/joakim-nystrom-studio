import { NextSeo, DefaultSeo } from 'next-seo';

const DatoSEO = ({seo = {}, site = {}, pathname, title, description}) => {
  
  const meta = parseDatoMetaTags({seo,site,pathname}) 
  const { globalSeo, favicon } = site
  const favicons = favicon ? favicon.map(({ attributes }) => {return {...attributes} }) : [];
  const images = generateImages(meta["og:image"], meta["og:image:width"], meta["og:image:height"])
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname || ''}`

  title = title ? title : globalSeo ? `${globalSeo.siteName} ${globalSeo.titleSuffix}` : 'No Site Title';
  description = description || meta.description || globalSeo ? globalSeo?.fallbackSeo.description : 'Site description';;

  //console.log(url, title, description); console.log(meta)

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url,
        title,
        description,
        images,
        locale:meta["og:locale"],
        type:meta["og:type"],
        site_name:meta["og:site_name"],
      }}
      twitter={ globalSeo && {
        title,
        image: meta["og:image"],
        handle: globalSeo.twitterAccount,
        site: globalSeo.twitterAccount,
        cardType: 'summary_large_image',
      }}
      additionalLinkTags={favicons} 
    />
  )
}

const DefaultDatoSEO = ({site, url}) => {
  const {globalSeo, favicon, globalSeo : {fallbackSeo}} = site
  const twitterSite = globalSeo.twitterAccount ? `https://twitter.com/${globalSeo.twitterAccount.replace("@", "")}` : undefied
  return (
    <DefaultSeo
      openGraph={{
        type: 'website',
        locale: globalSeo.locale,
        site_name: globalSeo.siteName,
      }}
      twitter={{
        handle: globalSeo.twitterAccount,
        site: twitterSite,
        cardType: fallbackSeo.twitterCard,
      }}
    />
  )
}

const generateImages = (url, width, height) => {
  if(!url) return undefined
  const baseURL  = url.split("?")[0]
  const images = [{
    url,
    width,
    height
  }]
  return images
}

const parseDatoMetaTags = ({seo, site, pathname}) => {

	if(!seo || !site) return []
	
	const { globalSeo } = site || {};
  const { fallbackSeo } = globalSeo || {};
	const tags = Array.isArray(seo) ? seo : seo.tags;

	let metaTags = tags || []
	let titleTag = metaTags.filter(m=> m.tag === "title")[0]
  
  if(titleTag){
    if(pathname === "/")
      titleTag.content = globalSeo?.siteName
    else if(!titleTag.content.startsWith(globalSeo.siteName))
      titleTag.content = `${globalSeo.siteName} – ${titleTag.content}`
  }
	metaTags = metaTags.map(t => { return t.tag !== 'title' ? t : titleTag})

  const meta = {}

  metaTags.forEach(t => {
    const prop = t.attributes ? t.attributes.property || t.attributes.name  : t.tag;
    const value = t.attributes ?  t.attributes.content || t.attributes : t.content;  
    meta[prop] = value
  })

  if(!meta['og:image'] && fallbackSeo?.image){
    const width = 1000;
    const scaleRatio = 1.0-((fallbackSeo.image.width-width)/fallbackSeo.image.width)
    meta['og:image'] = `${fallbackSeo.image.url}?w=1000`
    meta["og:image:width"] = width
    meta["og:image:height"] = Math.round(fallbackSeo.image.height * scaleRatio)
  }
	return meta
}

export { DefaultDatoSEO };
export default DatoSEO;