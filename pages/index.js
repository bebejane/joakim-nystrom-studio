import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '/components/Gallery';
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
		opacity:1,
		translateY:'-100vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
	artwork:{
		opacity:1,
		translateY:'0vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
	gallery:{
		opacity:1,
		translateY:'0vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
}

export default function Start({slides, assignments, artwork, studio, slug}){
	console.log(slides)
	const setShowMenu = useStore((state) => state.setShowMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const [isMobile, setIsMobile] = useState(false)
	const isShowingArtworkGallery = useStore((state) => state.isShowingArtworkGallery)
	const { innerWidth } = useWindowSize();

	const [animating, setAnimating] = useState(false)
	
	const isReverted = active === 'studio'
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
	
	useEffect(()=>{ setIsMobile(innerWidth && innerWidth <= 768) }, [innerWidth])
	
	const backStyles = cn(styles.back, active !== 'gallery' && styles.show, isReverted && styles.reverted)

	if(!active) return null
	
	return (
		<>
			<Content id="container" key={'container'} className={styles.container}>
				<motion.div
					key={'animation'}
					initial={'initial'}
					animate={active}	
					variants={variants}
					onAnimationStart={() => setAnimating(true)}
					onAnimationComplete={() => setAnimating(false)}
				>	
					<Gallery 
						id={'gallery'}
						key={'gallery'}
						slides={slides} 
						active={true}
					/>	
					<Studio studio={studio}	artwork={artwork}/>	
				</motion.div>
			</Content>
			{!isShowingArtworkGallery &&
				<div className={backStyles} onClick={() => setActive('gallery')}>
					Back
				</div>
			}
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