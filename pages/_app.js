import '/styles/index.scss'
import useTransitionFix from '/lib/hooks/useTransitionFix';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';
import { AnimatePresence } from 'framer-motion'
import Menu from '/components/Menu';
import DatoSEO from '/lib/dato/components/DatoSEO';

function MyApp({ Component, pageProps, pageProps: { site, seo, backgroundImage }}) {
  
  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker
  
  const fix = useTransitionFix()
  const router = useRouter()
  const { asPath : pathname } = router  
  const title = ''

  useEffect(()=>{ smoothscroll.polyfill()}, []) // Safari

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
        <Component {...pageProps} key={router.asPath}/>
      </AnimatePresence>
    </>
  )
}

export default MyApp
