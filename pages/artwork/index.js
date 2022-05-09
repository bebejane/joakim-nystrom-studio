import styles from './Artwork.module.scss'
import { withGlobalProps } from "/lib/hoc";
import cn from 'classnames'
import { Image } from 'react-datocms';
import { GetAllArtwork } from '/graphql';
import Content from '/components/Content';
import { motion } from 'framer-motion';
import ArtworkGallery from '/components/ArtworkGallery';
import { useState } from 'react';

export default function Artwork({artwork}){	

	const [galleryIndex, setGalleryIndex] = useState()

	return (
		<>
		<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
			<Content className={styles.artwork}>
				<ul>
					{artwork.map(({image, dimensions, sold}, idx) => 
						<li key={idx} onClick={()=>setGalleryIndex(idx)}>
							<Image data={image.responsiveImage} className={styles.image} pictureClassName={styles.picture}/>
							<span className={styles.dimensions}>{dimensions}</span>
							<span className={cn(styles.availability, sold && styles.sold)}>{sold ? 'Sold' : 'Buy'}</span>
						</li>
					)}
				</ul>
			</Content>
		</motion.div>
		{galleryIndex !== undefined && 
			<ArtworkGallery 
				images={artwork.map(({image}) => image)}
				index={galleryIndex} 
				onClose={()=>setGalleryIndex(undefined)}
			/>
		}
		</>
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