import styles from './index.module.scss'
import galleryStyles from '/components/Gallery.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '/components/Gallery';
import Artwork from '/components/Artwork';
import Studio from '/components/Studio';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { arrayMoveImmutable } from 'array-move';
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
	assignment:{
		opacity:1,
		translateY:'-200vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
}

export default function Start({slides, assignments, assignment : assignmentFromProps, artwork, studio, slug}){
	
	const setShowMenu = useStore((state) => state.setShowMenu)
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const [galleryEndReached, setGalleryEndReached] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [isShowingArtworkGallery, setIsShowingArtworkGallery] = useState(false)
	const { innerWidth } = useWindowSize();

	const [assignment, setAssignment] = useState(assignmentFromProps || undefined)	
	const [animating, setAnimating] = useState(false)
	const [galleryIndex, setGalleryIndex] = useState(0)
	const [lowerIndex, setLowerIndex] = useState(0)

	const isDuplicate = galleryIndex > assignments.length-1
	const activeToSlug = (active) => active === 'gallery' ? '/' : active === 'assignment' ? `/${assignment?.slug}` : active === 'artwork' ? '/artwork' : '/studio'
	const urlToActive = (url) => url === '/' ? 'gallery' : url === '/artwork' ? `artwork` : url === '/studio' ? 'studio' : 'assignment'
	
	const initialIndex = assignmentFromProps ? slides.findIndex(el => el.assignmentId === assignmentFromProps.id) : 0 

	useEffect(()=>setActive(urlToActive(slug)), []) // Set initial active from props

	useEffect(()=>{ 
		if(!active) return
		const isGallery = active === 'gallery'
		setShowMenu(isGallery)
		isGallery && setTimeout(()=>setLowerIndex(0), duration*1000)
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
	
	useEffect(()=> { showMenu && active === 'assignment' && setActive('gallery') }, [showMenu])
	useEffect(()=>{ setIsMobile(innerWidth && innerWidth <= 768)}, [innerWidth])
	useEffect(()=>{ setGalleryEndReached(lowerIndex === lowerSlides.length-1)}, [lowerIndex])

	const handleIndexSelected = (idx) => {
		const assignment = assignments.find(a => a.id === slides[idx].assignmentId)
		setAssignment(assignment)
		setActive('assignment')
	}
	
	const handleIndexChange = (idx) => {		
		const assignment = assignments.find(a => a.id === slides[idx].assignmentId)
		setAssignment(assignment)
		setGalleryIndex(idx)
		setLowerIndex(0)
	}
	
	const lowerSlides = assignment ? (isDuplicate ? arrayMoveImmutable(assignment.images, 0, 1) : assignment.images).map((image) => ({image, title:image.title, slug:assignment.slug, type: image.mimeType.startsWith('video') ? 'video' : 'image' })) : []	
	if(lowerSlides.length)
		lowerSlides.splice(1, 0, {type:'text', text:assignment.description.split('\n\n').pop(), title:null})
	
	const overlayUrl = slides[galleryIndex].type === 'image' ? `${slides[galleryIndex].image.url}?w=1400` : null
	const showOverlay = animating && active === 'assignment' && overlayUrl && !isMobile
	const backStyles = cn(styles.back, !showMenu && !isShowingArtworkGallery ? active === 'assignment' ? styles.slide : styles.show : false)

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
						onIndexChange={handleIndexChange}
						onIndexSelected={handleIndexSelected}
						active={active === 'gallery'}
						index={initialIndex}
					/>	
					<Gallery 
						id={'assignment'}
						key={assignment?.id}
						slides={lowerSlides} 
						onIndexChange={(idx)=>!isMobile && setLowerIndex(idx)}
						onIndexSelected={(idx)=>setActive('gallery')}
						onClose={()=>setActive('gallery')}
						active={active === 'assignment'}
						index={lowerIndex}
						loop={false}
						caption={assignment?.title}
					/>
				</motion.div>
				
				<div id={'overlay'} key={'overlay'} style={{ visibility: showOverlay ? 'visible' : 'hidden' }} className={styles.overlay}>
					{overlayUrl && 
						<>
							<img src={`${overlayUrl}`}/>
							<div className={cn(galleryStyles.caption, galleryStyles.show, isMobile && galleryStyles.mobile)}>
								<p>{assignment?.title}</p>
							</div>
						</>
					}
				</div>
			</Content>
			<div className={backStyles} onClick={() => setActive('gallery')}>
				<span className={cn(styles.arrow, galleryEndReached && styles.show)}>→</span>Back
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