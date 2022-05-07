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
export default function Start({start:{slides}}){
	
	const [assignment, setAssignment] = useState()
	const [active, setActive] = useState('upper')
	const [animating, setAnimating] = useState(false)
	const [lowerIndex, setLowerIndex] = useState(0)

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
					slides={slides.map(({images, title, slug, text, link}) => ({image:images?.[0], title, slug, text, link}))} 
					onIndexChange={(idx)=> !slides[idx].text && setAssignment(slides[idx])}
					onIndexSelected={(idx)=>setActive('lower')}
					active={active === 'upper'}
				/>
				<Gallery 
					id={'lower'}
					key={assignment?.id}
					slides={(assignment ? assignment.images : []).map((image) => ({image, title:image.title, slug:assignment.slug}))} 
					onIndexChange={(idx)=>{}}
					onIndexSelected={(idx)=>setActive('upper')}
					active={active === 'lower'}
					index={lowerIndex}
				/>
			</motion.div>
			<Gallery 
				id={'overlay'}
				key={'overlay'}
				slides={!assignment ? [] : [{image:assignment.images[0], title:assignment.images[0].title, slug:assignment.slug}]} 
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
	
	return {
		props:{
			...props,
		},
		revalidate
	};
});