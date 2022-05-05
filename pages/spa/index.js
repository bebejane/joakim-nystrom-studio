import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '/components/GallerySPA';
import { GetAllAssignments } from '/graphql';
import { useState } from 'react';
import { motion } from 'framer-motion'

const duration = .4;
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
		transition:{ease:'easeOut', duration}
	}
}
export default function Start({assignments}){
	const [assignment, loadAssignment] = useState()
	const [active, setActive] = useState('upper')
	const [animating, setAnimating] = useState(false)
	
	return (
		<Content id="container" className={styles.container}>
			<motion.div
				initial={false}
				animate={active}
				variants={variants}
				onAnimationStart={()=>setAnimating(true)}
				onAnimationComplete={()=>setAnimating(false)}
			>
				<Gallery 
					id={'upper'}
					key={'upper'}
					slides={assignments.map(({images, title, slug}) => ({image:images[0], title, slug}))} 
					onIndexChange={(idx)=>assignment?.id !== assignments[idx] && loadAssignment(assignments[idx])}
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
				/>
			</motion.div>
			{assignment && 
				<Gallery 
					id={'temp'}
					key={'temp'}
					slides={[{image:assignment.images[0], title:assignment.images[0].title, slug:assignment.slug}]} 
					style={{display: animating && active === 'lower' ? 'flex' : 'none'}}
					active={false}
					nocaption={true}
					className={styles.temp}
					onIndexChange={(idx)=>{}}
				/>
			}
		</Content>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllAssignments]}, async ({props, revalidate }) => {
	
	return {
		props:{
			...props
		},
		revalidate
	};
});