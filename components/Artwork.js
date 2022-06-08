import styles from './Artwork.module.scss';
import cn from 'classnames'
import { Image } from 'react-datocms';
import ArtworkGallery from './ArtworkGallery';
import { useEffect, useState } from 'react';

export default function Artwork({ artwork, onShowGallery, onIndexChange, prevRoute }) {

	const [galleryIndex, setGalleryIndex] = useState()

	useEffect(() => { 
		onShowGallery?.(galleryIndex !== undefined) 
		onIndexChange?.(galleryIndex) 
	}, [galleryIndex])
	
	return (
		<>
			<section className={styles.artwork}>
				<ul>
					{artwork.map(({ image, dimensions, sold, title }, idx) =>
						<li key={idx} onClick={() => setGalleryIndex(idx)}>
							<Image 
								data={image.responsiveImage} 
								className={styles.image} 
								pictureClassName={styles.picture}
							/>
							{sold && <span className={styles.sold}>Sold</span>}
						</li>
					)}
				</ul>
			</section>
		</>
	)
}