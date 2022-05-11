import '/styles/index.scss'
import useTransitionFix from '/lib/hooks/useTransitionFix';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import { AnimatePresence } from 'framer-motion'
import Menu from '/components/Menu';
import DatoSEO from '/lib/dato/components/DatoSEO';
import usePreviousRoute from '/lib/hooks/usePreviousRoute';

function MyApp({ Component, pageProps, pageProps: { site, seo, assignment, backgroundImage }}) {
  
  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker
  
  useEffect(()=>{ smoothscroll.polyfill()}, []) // Safari
  const prevRoute = usePreviousRoute()
  const fix = useTransitionFix()
  const router = useRouter()
  const { asPath : pathname } = router  
  const title = assignment ? assignment.title : router.asPath === '/artwork' ? 'Artwork' : router.asPath === '/studio' ? 'Studio' : ''
  
  return (
    <>
      <GoogleAnalytics />
      <DatoSEO 
        seo={seo} 
        site={site} 
        title={`Joakim Nyström Studio${title ? ` · ${title}` : ''}`} 
        pathname={pathname} 
      />
      <Menu {...pageProps}/>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Component {...pageProps} key={router.asPath} prevRoute={prevRoute}/>
      </AnimatePresence>
    </>
  )
}

export default MyApp
