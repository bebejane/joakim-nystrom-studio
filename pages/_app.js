import '/styles/index.scss'
import 'swiper/css';
import DatoSEO from '/lib/dato/components/DatoSEO';
import useTransitionFix from '/lib/hooks/useTransitionFix';
import { GoogleAnalytics, usePagesViews } from "nextjs-google-analytics";
import { useRouter } from 'next/router';
import Menu from '/components/Menu';

function MyApp({ Component, pageProps, pageProps: { site, seo, backgroundImage }}) {
  
  if(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) usePagesViews(); // Google Analytics page view tracker
  
  const fix = useTransitionFix()
  const router = useRouter()
  const { asPath : pathname } = router  
  const title = ''

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
      <Component {...pageProps} key={router.asPath}/>
    </>
  )
}

export default MyApp
