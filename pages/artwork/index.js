import styles from './Artwork.module.scss'
import { withGlobalProps } from "/lib/hoc";
import cn from 'classnames'
import { Image } from 'react-datocms';
import { GetAllArtwork } from '/graphql';
import Content from '/components/Content';
import { motion } from 'framer-motion';

export default function Artwork({artwork}){	
	return (
		<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
			<Content className={styles.container}>
				{artwork.map(({image, dimensions, sold}, idx) => 
					<div key={idx} className={styles.artwork}>
						<Image data={image.responsiveImage} className={styles.image} pictureClassName={styles.picture}/>
						<span className={styles.dimensions}>{dimensions}</span>
						<span className={cn(styles.availability, sold && styles.sold)}>{sold ? 'Sold' : 'Buy'}</span>
					</div>
				)}
			</Content>
		</motion.div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllArtwork]}, async ({props, revalidate }) => {
	
	return {
		props:{
			...props,
		},
		revalidate
	};
});