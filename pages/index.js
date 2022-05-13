import styles from './index.module.scss'
import galleryStyles from '/components/Gallery.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '/components/Gallery';
import Artwork from '/components/Artwork';
import Studio from '/components/Studio';
import { GetAllArtwork, GetStart, GetStudio} from '/graphql';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { arrayMoveImmutable } from 'array-move';
import { useWindowSize } from 'rooks';
import cn from 'classnames'
import useStore from '/store';
import { useRouter } from 'next/router';

const duration = 0.4;
const variants =  { 
	initial:{
		translateY:'-100vh'
	},
	initialStudio: {
		opacity: 0,
		//transition:{ease:'easeOut', duration}
	},
	fromArtwork: {
		translateY: ['100vh', '0vh'],
		transition: { ease: 'easeOut', duration }
	},
	fromStudio: {
		opacity: [0, 1],
		transition: { ease: 'easeOut', duration }
	},
	toArtwork: {
		translateY: '100vh',
		transition: { ease: 'linear', duration }
	},
	toStudio: {
		opacity: 0,
		transition: { ease: 'easeOut', duration }
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

export default function Start({slides, assignments, assignment : assignmentFromProps, artwork, studio, prevRoute}){
	
	const router = useRouter()
	const setShowMenu = useStore((state) => state.setShowMenu)
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const [isMobile, setIsMobile] = useState(false)
	const [isShowingArtworkGallery, setIsShowingArtworkGallery] = useState(false)
	
	const { innerWidth, innerHeight } = useWindowSize();

	const [assignment, setAssignment] = useState(assignmentFromProps || undefined)
	//const [active, setActive] = useState(assignmentFromProps ? 'lower':'middle')
	const [animating, setAnimating] = useState(false)
	const [galleryIndex, setGalleryIndex] = useState(0)
	const [lowerIndex, setLowerIndex] = useState(0)

	const isDuplicate = galleryIndex > assignments.length-1
	
	const handleIndexChange = (idx) => {
		const assignment = assignments.find(a => a.id === slides[idx].assignmentId)
		setAssignment(assignment)
		setGalleryIndex(idx)
		setLowerIndex(0)
	}

	useEffect(()=>{ 
		if(!active) return
		const isGallery = active === 'gallery'
		isGallery && setTimeout(()=>setLowerIndex(0), duration*1000)
		setShowMenu(isGallery)
		//!isGallery && window.history.pushState({}, "", `/${assignment.slug}`)	
	}, [active])

	useEffect(()=>{ 
		
		const handlePopState = ({state:{url}}) => url === '/' && setActive('gallery')
		const handleKeyPress = ({key}) => key === 'Escape' && setActive('gallery')

		//window.addEventListener('popstate', handlePopState);
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			//window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('keydown', handleKeyPress);
		}
	}, [])
	
	useEffect(()=> { showMenu && active === 'assignment' && setActive('gallery') }, [showMenu])
	useEffect(()=>{ setIsMobile(innerWidth && innerWidth <= 768)}, [innerWidth])

	const lowerSlides = assignment ? (isDuplicate ? arrayMoveImmutable(assignment.images, 0, 1) : assignment.images).map((image) => ({image, title:image.title, slug:assignment.slug, type: image.mimeType.startsWith('video') ? 'video' : 'image' })) : []	
	if(lowerSlides.length)
		lowerSlides.splice(1, 0, {type:'text', text:assignment.description.split('\n\n').pop(), title:null})
	
	const overlayUrl = slides[galleryIndex].type === 'image' ? `${slides[galleryIndex].image.url}?w=1400` : null
	const showOverlay = animating && active === 'assignment' && overlayUrl && !isMobile
	
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
					onIndexSelected={(idx)=>setActive('assignment')}
					active={active === 'gallery'}
				/>	
				<Gallery 
					id={'assignment'}
					key={assignment?.id}
					slides={lowerSlides} 
					onIndexChange={(idx)=>!isMobile && setLowerIndex(idx)}
					onClose={()=>setActive('gallery')}
					active={active === 'assignment'}
					index={lowerIndex}
					loop={false}
					caption={assignment?.title}
				/>
			
			</motion.div>
			
			<div
				id={'overlay'}
				key={'overlay'}
				style={{ visibility: showOverlay ? 'visible' : 'hidden' }}
				className={styles.overlay}
			>
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
		<div 
			className={cn(styles.back, !showMenu && !isShowingArtworkGallery ? active === 'assignment' ? styles.slide : styles.show : false)} 
			onClick={() => setActive('gallery')}
		>
			Back
		</div>
		</>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetStart, GetAllArtwork, GetStudio]}, async ({props, revalidate }) => {

	const assignments = props.start.slides.filter(s => s.__typename === 'AssignmentRecord')
	const slides = props.start.slides.map((slide) => ({
		assignmentId: slide.id,
		title: slide.title || null,
		image: slide.images?.[0] || null,
		text: slide.text || null,
		year: slide.text || null,
		type: slide.text ? 'text' : slide.images?.[0].mimeType.startsWith('video') ? 'video' : 'image',
		slug: !slide.link ? slide.slug : slide.link.__typename === 'StudioRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
	}))

	// Duplicate slides temp
	slides.push.apply(slides, props.start.slides.filter(s => !s.text).map(slide => ({
		title: slide.title || null,
		assignmentId: slide.id,
		image: slide.images?.[1] || slide.images?.[0] || null,
		text: slide.text || null,
		type: slide.text ? 'text' : (slide.images?.[1] || slide.images?.[0]).mimeType.startsWith('video') ? 'video' : 'image',
		slug: !slide.link ? slide.slug : slide.link.__typename === 'StudioRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
	})))

	return {
		props:{
			site:props.site,
			artwork:props.artwork,
			studio:props.studio,
			assignments,
			slides
		},
		revalidate
	};
});