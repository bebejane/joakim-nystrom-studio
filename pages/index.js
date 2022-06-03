import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '/components/Gallery';
import Artwork from '/components/Artwork';
import Studio from '/components/Studio';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { useWindowSize } from 'rooks';
import cn from 'classnames'
import useStore from '/store';

const duration = 0.4;
const variants =  { 
	initial:{
		translateY:'0vh'
	},
	studio:{
		opacity:0,
		transition:{ease:'easeOut', duration, delay:0.01}
	},
	artwork:{
		opacity:1,
		translateY:'0vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
	gallery:{
		opacity:1,
		translateY:'-100vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
}

export default function Start({slides, assignments, artwork, studio, slug}){
	
	const setShowMenu = useStore((state) => state.setShowMenu)
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const [isMobile, setIsMobile] = useState(false)
	const [isShowingArtworkGallery, setIsShowingArtworkGallery] = useState(false)
	const { innerWidth } = useWindowSize();

	const [animating, setAnimating] = useState(false)
	
	const activeToSlug = (active) => active === 'gallery' ? '/' : active === 'assignment' ? `/${assignment?.slug}` : active === 'artwork' ? '/artwork' : '/studio'
	const urlToActive = (url) => url === '/' ? 'gallery' : url === '/artwork' ? `artwork` : url === '/studio' ? 'studio' : 'assignment'
	
	useEffect(()=>setActive(urlToActive(slug)), []) // Set initial active from props

	useEffect(()=>{ 
		if(!active) return
		const isGallery = active === 'gallery'
		setShowMenu(isGallery)
		if(activeToSlug(active) !== document.location.pathname)
			window.history.pushState({url:activeToSlug(active)}, "", activeToSlug(active))
	}, [active])

	useEffect(()=>{ 
		
		const handlePopState = ({state, state:{url}}) => setActive(urlToActive(url))
		const handleKeyPress = ({key}) => key === 'Escape' && setActive('gallery')

		window.addEventListener('popstate', handlePopState);
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('keydown', handleKeyPress);
		}
	}, [])
	
	useEffect(()=>{ setIsMobile(innerWidth && innerWidth <= 768)}, [innerWidth])
	
	const backStyles = cn(styles.back, active !== 'gallery' && styles.show)

	if(!active) return null

	return (
		<>
			<Content id="container" key={'container'} className={styles.container}>
				<Studio studio={studio} show={active === 'studio'}/>	
				<motion.div
					key={'animation'}
					initial={'initial'}
					animate={active !== 'studio' ? active : false}	
					variants={variants}
					onAnimationStart={() => setAnimating(true)}
					onAnimationComplete={() => setAnimating(false)}
				>	
					<Artwork artwork={artwork} onShowGallery={setIsShowingArtworkGallery}/>
					<Gallery 
						id={'gallery'}
						key={'gallery'}
						slides={slides} 
						active={true}
					/>	
				</motion.div>
			</Content>
			<div className={backStyles} onClick={() => setActive('gallery')}>
				Back
			</div>
		</>
	)
}

export const getStaticProps = withGlobalProps(async ({props, revalidate }) => {

	return {
		props:{
			...props,
			slug:'/'
		},
		revalidate
	};
});