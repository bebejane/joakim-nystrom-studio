import styles from './Artwork.module.scss';
import cn from 'classnames'
import { Image } from 'react-datocms';
import { GetAllArtwork } from '/graphql';
import Content from './Content';
import ArtworkGallery from './ArtworkGallery';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const duration = 0.4;
const variants =  { 
	initial:{
		opacity:0
	},
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

export default function Artwork({artwork, onShowGallery, prevRoute}){	

	const [galleryIndex, setGalleryIndex] = useState()
	useEffect(()=>{ onShowGallery?.(galleryIndex !== undefined) }, [galleryIndex])

	return (
		<>
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