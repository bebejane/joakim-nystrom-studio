import '/styles/index.scss'
import 'swiper/css';
import DatoSEO from '/lib/dato/components/DatoSEO';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import Menu from '/components/Menu';
import { AnimatePresence } from "framer-motion";
import useTransitionFix from '/lib/hooks/useTransitionFix';
import Content from '/components/Content';
import Gallery from '/components/Gallery';

function MyApp({ Component, pageProps, pageProps: { site, seo, backgroundImage }}) {

  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker
  
  useTransitionFix()
  const router = useRouter()
  const { asPath : pathname } = router  
  const title = ''

  return (
    <>
      <GoogleAnalytics />
      <DatoSEO seo={seo} site={site} title={`Joakim Nyström Studio${title ? ` · ${title}` : ''}`} pathname={pathname} key={pathname}/>
      <Menu {...pageProps}/>
      <AnimatePresence exitBeforeEnter initial={false}>
        <div id="app" key={router.asPath}>
          <Component {...pageProps}/>
        </div>
      </AnimatePresence>
    </>
  )
}

export default MyApp
