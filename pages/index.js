import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { Image } from 'react-datocms'
import Content from '/components/Content';
import Gallery from '/components/Gallery';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { GetAllAssignments } from '/graphql';
import useStore from '/store';

const duration = 1;
const galleryTransition = {
	initial: {
		translateY:'0vh'
	},
	animate: {
		translateY:'0vh',
		transition:{ duration}
	},
	exit: {
		translateY:'-100vh',
		transition:{ duration}
	}	
}

export default function Start({assignments}){	

	const [index, setIndex] = useState(0)
	const [animating, setAnimating] = useState(false)
	const setIsTransitioning = useStore((state) => state.setIsTransitioning)

	return (
		<motion.div
			initial="initial" 
			exit={"exit"}
			variants={galleryTransition} 
			onAnimationComplete={()=>setIsTransitioning(false)}
			onAnimationStart={()=>setIsTransitioning(true)}
		>
			<Content id="container" className={styles.container}>
				<Gallery 
					slides={assignments.map(({images, title, slug}) => ({image:images[0], title, slug}))} 
					onIndexChange={(idx)=>setIndex(idx)}
				/>
			</Content>
		</motion.div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllAssignments]}, async ({props, revalidate }) => {
	return {
		props:{
			...props,
			backgroundImage:props.assignments[0].images[0]
		},
		revalidate
	};
});