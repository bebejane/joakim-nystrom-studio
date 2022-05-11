import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '../components/Gallery';
import { GetStart} from '/graphql';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { arrayMoveImmutable } from 'array-move';
import { useWindowSize } from 'rooks';
import useStore from '/store';
import { useRouter } from 'next/router';
import usePreviousRoute from '/lib/hooks/usePreviousRoute';

const duration = 0.4;
const variants =  { 
	initial:{
		translateY:['100vh', '0vh'],
		transition:{ease:'easeOut', duration}
	},
	initialStudio:{
		opacity:0,
		//transition:{ease:'easeOut', duration}
	},
	fromArtwork:{
		translateY:['100vh', '0vh'],
		transition:{ease:'easeOut', duration}
	},
	fromStudio:{
		opacity:[0,1],
		transition:{ease:'easeOut', duration}
	},
	toArtwork:{
		translateY:'100vh',
		transition:{ease:'linear', duration}
	},
	toStudio:{
		opacity:0,
		transition:{ease:'easeOut', duration}
	},
	upper:{
		opacity:1,
		translateY:'0vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
	lower:{
		opacity:1,
		translateY:'-100vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	},
}

export default function Start({slides, assignments, assignment : assignmentFromProps}){
	
	const router = useRouter()
	const prevRoute = usePreviousRoute()
	const setShowMenu = useStore((state) => state.setShowMenu)
	const showMenu = useStore((state) => state.showMenu)
	const [isMobile, setIsMobile] = useState(false)
	const { innerWidth, innerHeight } = useWindowSize();
	
	const [assignment, setAssignment] = useState(assignmentFromProps || undefined)
	const [active, setActive] = useState(assignmentFromProps ? 'lower':'upper')
	const [animating, setAnimating] = useState(false)
	const [upperIndex, setUpperIndex] = useState(0)
	const [lowerIndex, setLowerIndex] = useState(0)

	const isDuplicate = upperIndex > assignments.length-1
	
	const handleIndexChange = (idx) => {
		const assignment = assignments.find(a => a.id === slides[idx].assignmentId)
		setAssignment(assignment)
		setUpperIndex(idx)
		setLowerIndex(0)
	}

	useEffect(()=>{ 
		if(!active) return
		const isUpper = active === 'upper'
		isUpper && setTimeout(()=>setLowerIndex(0), duration*1000)
		setShowMenu(isUpper)

		!isUpper && window.history.pushState({}, "", `/${assignment.slug}`)	
	}, [active])

	useEffect(()=>{ 
		
		const handlePopState = ({state:{url}}) => url === '/' && setActive('upper')
		const handleKeyPress = ({key}) => key === 'Escape' && setActive('upper')

		window.addEventListener('popstate', handlePopState);
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('keydown', handleKeyPress);
		}
	}, [])
	
	useEffect(()=> { showMenu && active === 'lower' && setActive('upper') }, [showMenu])
	useEffect(()=>{ setIsMobile(innerWidth && innerWidth <= 768)}, [innerWidth])

	const lowerSlides = assignment ? (isDuplicate ? arrayMoveImmutable(assignment.images, 0, 1) : assignment.images).map((image) => ({image, title:image.title, slug:assignment.slug, type: image.mimeType.startsWith('video') ? 'video' : 'image' })) : []	
	if(lowerSlides.length)
		lowerSlides.splice(1, 0, {type:'text', text:assignment.description.split('\n\n').pop(), title:null})
	
	const overlayUrl = slides[upperIndex].type === 'image' ? `${slides[upperIndex].image.url}?w=1400` : null
	const showOverlay = animating && active === 'lower' && overlayUrl && !isMobile
	
	return (
		<Content id="container" key={'container'} className={styles.container}>
			<motion.div
				key={'animation'}
				initial={prevRoute === '/artwork' ? 'initial' : prevRoute === '/studio' ? 'initialStudio' : false}
				animate={active}
				exit={router.asPath === '/studio' ? 'toStudio' : 'toArtwork'}	
				variants={variants}
				onAnimationStart={()=>setAnimating(true)}
				onAnimationComplete={()=>setAnimating(false)}
			>
				<Gallery 
					id={'upper'}
					key={'upper'}
					slides={slides} 
					onIndexChange={handleIndexChange}
					onIndexSelected={(idx)=>{ setActive('lower') }}
					active={active === 'upper'}
				/>	
				<Gallery 
					id={'lower'}
					key={assignment?.id}
					slides={lowerSlides} 
					onIndexChange={(idx)=>{}}
					active={active === 'lower'}
					index={lowerIndex}
					loop={false}
					caption={assignment?.title}
				/>
			</motion.div>
			<div 
				id={'overlay'}
				key={'overlay'}
				style={{visibility: showOverlay ? 'visible' : 'hidden'}}
				className={styles.overlay}
			>
				{overlayUrl && <img src={`${overlayUrl}`}/>}
			</div>
		</Content>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetStart]}, async ({props, revalidate }) => {

	const assignments = props.start.slides.filter(s => s.__typename === 'AssignmentRecord')
	const slides = props.start.slides.map((slide) => ({
		assignmentId:slide.id,
		title: slide.title || null,
		image : slide.images?.[0] || null,
		text:slide.text || null,
		type: slide.text ? 'text' : slide.images?.[0].mimeType.startsWith('video') ? 'video' : 'image',
		slug: !slide.link ? slide.slug : slide.link.__typename === 'StudioRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
	}))
	
	// Duplicate slides temp
	slides.push.apply(slides, props.start.slides.filter(s=>!s.text).map(slide => ({
		title: slide.title || null,
		assignmentId: slide.id,
		image : slide.images?.[1] || slide.images?.[0] || null,
		text:slide.text || null,
		type: slide.text ? 'text' : (slide.images?.[1] || slide.images?.[0]).mimeType.startsWith('video') ? 'video' : 'image',
		slug: !slide.link ? slide.slug : slide.link.__typename === 'StudioRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
	})))
	
	return {
		props:{
			site:props.site,
			assignments,
			slides
		},
		revalidate
	};
});