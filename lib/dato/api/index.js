import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GetIntl } from '/graphql/intl.graphql';
import { SiteClient } from 'datocms-client';

const isServer = typeof window === 'undefined';
const GRAPHQL_API_ENDPOINT = `https://graphql.datocms.com`;
const GRAPHQL_PREVIEW_API_ENDPOINT = `https://graphql.datocms.com/preview`;
const GRAPHQL_API_TOKEN = isServer ? process.env.GRAPHQL_API_TOKEN : process.env.NEXT_PUBLIC_GRAPHQL_API_TOKEN

const Dato = new SiteClient(GRAPHQL_API_TOKEN)
const client = new ApolloClient({
  uri: GRAPHQL_API_ENDPOINT,
  cache: new InMemoryCache(),
  headers: { Authorization: `Bearer ${GRAPHQL_API_TOKEN}` },
  ssrMode: isServer,
  defaultOptions: {
    query: {
      fetchPolicy: process.env.DEV_CACHE ? 'cache-first' : 'network-only',
      errorPolicy: 'all',
    }
  }
});

const apiQuery = async (query, params = {}, preview = false, token = GRAPHQL_API_TOKEN) => {
  
  if(!query) throw "Invalid Query!"

  if(Array.isArray(query) && (query.length === 0)) 
    return {}
  
  const batch = (Array.isArray(query) ? query : [query]).map((q, idx) => {
    const variables = Array.isArray(params) && params.length > idx -1 ? params[idx] : params || {}
    return client.query({query:q, variables})
  })
  
  const data = await Promise.all(batch)
  console.log(data)
  let result = {}
  data.forEach((res) => result = {...result, ...res?.data})
  return result
}

const SEOQuery = (schema) => {
  return gql`
    query GetSEO {
      seo: ${schema} {
        id
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
  Dato,
  client
}
