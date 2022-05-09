import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '../components/Gallery';
import { GetStart} from '/graphql';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'

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
export default function Start({slides}){
	console.log(slides)
	const [assignment, setAssignment] = useState()
	const [active, setActive] = useState('upper')
	const [animating, setAnimating] = useState(false)
	const [lowerIndex, setLowerIndex] = useState(0)

	const upperSlides = slides.map(({images, title, slug, text, type}) => ({image:images?.[0], title, slug, text, type}))
	const lowerSlides = (assignment ? assignment.images : []).map((image) => ({image, title:image.title, slug:assignment.slug, type: image.mimeType.startsWith('video') ? 'video' : 'image' }))
	const overlaySlides = !assignment ? [] : [{image:assignment.images[0], title:assignment.images[0].title, slug:assignment.slug, type: assignment.images[0].mimeType.startsWith('video') ? 'video' : 'image' }]

	useEffect(()=>{ setTimeout(()=>setLowerIndex(active === 'upper' ? 0 : undefined), duration*1000) }, [active])
	
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
					onIndexChange={(idx)=> !slides[idx].text && setAssignment(slides[idx])}
					onIndexSelected={(idx)=>setActive('lower')}
					active={active === 'upper'}
				/>
				<Gallery 
					id={'lower'}
					key={assignment?.id}
					slides={lowerSlides} 
					onIndexChange={(idx)=>{}}
					onIndexSelected={(idx)=>setActive('upper')}
					active={active === 'lower'}
					index={lowerIndex}
				/>
			</motion.div>
			<Gallery 
				id={'overlay'}
				key={'overlay'}
				slides={overlaySlides} 
				style={{display: animating && (active === 'lower' || lowerIndex == 0) ? 'flex' : 'none'}}
				active={false}
				nocaption={true}
				className={styles.overlay}
				onIndexChange={(idx)=>{}}
			/>
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