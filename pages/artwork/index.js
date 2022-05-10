import styles from './Artwork.module.scss'
import { withGlobalProps } from "/lib/hoc";
import cn from 'classnames'
import { Image } from 'react-datocms';
import { GetAllArtwork } from '/graphql';
import Content from '/components/Content';
import { animate, motion } from 'framer-motion';
import ArtworkGallery from '/components/ArtworkGallery';
import { useState } from 'react';
import { useRouter } from 'next/router';
import usePreviousRoute from '/lib/hooks/usePreviousRoute';

const duration = 0.4;
const variants =  { 
	fromIndex:{
		translateY:['-100vh', '0vh'],
		transition:{ease:'easeOut', duration}
	},
	fromStudio:{
		opacity:1,
		transition:{ease:'easeOut', duration}
	},
	toIndex:{
		translateY:'-100%',
		transition:{ease:'linear', duration}
	},
	toStudio:{
		opacity:0,
		transition:{ease:'easeOut', duration}
	}
}

export default function Artwork({artwork}){	

	
	const prevRoute = usePreviousRoute()
	const router = useRouter()
	const [galleryIndex, setGalleryIndex] = useState()
	
	return (
		<>
		<motion.div 
			animate={prevRoute === '/' ? 'fromIndex' : 'fromStudio'} 
			exit={router.asPath === '/' ? 'toIndex' : undefined }
			variants={variants}
		>
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