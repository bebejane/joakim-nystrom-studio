import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '../components/Gallery';
import { GetStart} from '/graphql';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router';
import useStore from '/store';

const duration = 0.4;
const variants =  { 
	initial:{
		translateY:'0vh'
	},
	upper:{
		translateY:'0vh',
		transition:{ease:'easeOut', duration}
	},
	lower:{
		translateY:'-100vh',
		transition:{ease:'easeOut', duration, delay:0.01}
	}
}
export default function Start({slides, assignment : assignmentFromProps}){
	
	const router = useRouter()
	const setShowMenu = useStore((state) => state.setShowMenu)
	const showMenu = useStore((state) => state.showMenu)
	const [assignment, setAssignment] = useState(assignmentFromProps || undefined)
	const [active, setActive] = useState(assignmentFromProps ? 'lower' : 'upper')
	const [animating, setAnimating] = useState(false)
	const [lowerIndex, setLowerIndex] = useState(0)

	const upperSlides = slides.map(({images, title, slug, text, type}) => ({image:images?.[0], title, slug, text, type}))
	const lowerSlides = assignment ? assignment.images.map((image) => ({image, title:image.title, slug:assignment.slug, type: image.mimeType.startsWith('video') ? 'video' : 'image' })) : []
	
	if(assignment){
		const text = assignment.description.split('\n\n').pop()
		lowerSlides.splice(2, 0, {type:'text', text, title:null})
	}
	
	const showOverlay = animating && (active === 'lower' || lowerIndex == 0)
	const overlayUrl = assignment && !assignment.images[0].mimeType.startsWith('video') ? `${assignment?.images[0].url}?w=1400` : null
	
	useEffect(()=>{ 
		setTimeout(()=>setLowerIndex(active === 'upper' ? 0 : undefined), duration*1000) 
		setShowMenu(active === 'upper')
		if(active === 'lower') 
			window.history.pushState({}, "", `/${assignment.slug}`)	
	}, [active])
	useEffect(()=>{ 
		const handlePopState = ({state:{url}}) => url === '/' && setActive('upper')
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [])
	
	useEffect(()=> { showMenu && setActive('upper')}, [showMenu])
	
	return (
		<Content id="container" key={'container'} className={styles.container}>
			<motion.div
				key={'animation'}
				initial={false}
				animate={active}
				variants={variants}
				onAnimationStart={()=>setAnimating(true)}
				onAnimationComplete={()=>setAnimating(false)}
			>
				<Gallery 
					id={'upper'}
					key={'upper'}
					slides={upperSlides} 
					onIndexChange={(idx)=> slides[idx].type !== 'text' && active === 'upper' && setAssignment(slides[idx])}
					onIndexSelected={(idx)=>setActive('lower')}
					active={active === 'upper'}
				/>
				<Gallery 
					id={'lower'}
					key={'lower'}
					slides={lowerSlides} 
					onIndexChange={(idx)=>{}}
					onClose={()=> window.history.back()}
					active={active === 'lower'}
					index={lowerIndex}
					loop={false}
				/>
			</motion.div>
			<div 
				id={'overlay'}
				key={'overlay'}
				style={{display: showOverlay ? 'flex' : 'none'}}
				className={styles.overlay}
			>
				{overlayUrl && <img src={`${overlayUrl}`}/>}
			</div>
		</Content>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetStart]}, async ({props, revalidate }) => {
	const slides = props.start.slides.map((slide) => ({
		...slide,
		type: slide.text ? 'text' : slide.images?.[0].mimeType.startsWith('video') ? 'video' : 'image',
		slug: !slide.link ? slide.slug : slide.link.__typename === 'AboutRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null
	}))
	
	return {
		props:{
			...props.seo,
			slides
		},
		revalidate
	};
});