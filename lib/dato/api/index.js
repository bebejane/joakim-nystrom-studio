import gql from 'graphql-tag';
import { GraphQLClient } from "graphql-request"
import { GetIntl } from '/graphql/intl.graphql';
import { SiteClient } from 'datocms-client';
import ApiCache from './ApiCache';

const isServer = typeof window === 'undefined';
const GRAPHQL_API_ENDPOINT = `https://graphql.datocms.com`;
const GRAPHQL_PREVIEW_API_ENDPOINT = `https://graphql.datocms.com/preview`;
const GRAPHQL_API_TOKEN = isServer ? process.env.GRAPHQL_API_TOKEN : process.env.NEXT_PUBLIC_GRAPHQL_API_TOKEN

const Dato = new SiteClient(GRAPHQL_API_TOKEN)

const apiQuery = async (query, params = {}, preview = false, token = GRAPHQL_API_TOKEN) => {
  
  if(!query) throw "Invalid Query!"

  if(Array.isArray(query) && (query.length === 0)) 
    return {}

  const cachedResponse = ApiCache.getCache(query, params);
  if(cachedResponse) 
    return cachedResponse

  /* Combine queries */
  const batch = (Array.isArray(query) ? query : [query]).map((document, idx) => {
    const variables = Array.isArray(params) && params.length > idx -1 ? params[idx] : params || {}
    return {document, variables}
  })
  
  const headers = {headers: { authorization: 'Bearer ' + token}}
  const client = new GraphQLClient(!preview ? GRAPHQL_API_ENDPOINT : GRAPHQL_PREVIEW_API_ENDPOINT, headers)
  const data = await client.batchRequests(batch)
  let result = {}
  data.forEach((res) => result = {...result, ...res?.data})
  ApiCache.setCache(ApiCache.key(query, params), result)
  return result
}

const SEOQuery = (schema) => {
  return gql`
    query GetSEO {
      seo: ${schema} {
        tags: _seoMetaTags {
          attributes
          content
          tag
        }
      }
    }
  `
}

const intlQuery = async (page, locale, fallbackLocales = ['en']) =>{

  const { messages } = await apiQuery(GetIntl, {page, locale, fallbackLocales})
  const intl = {[page]:{}}
  messages.forEach(({key, value})=> intl[page][key] = value)
  return  intl
}

const datoError = (err) =>{
  console.log(err)
  return err.message || err
}

export {
  apiQuery,
  SEOQuery,
  intlQuery,
  datoError,
  Dato
}
