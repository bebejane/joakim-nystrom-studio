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
							<Image data={image.responsiveImage} className={styles.image} pictureClassName={styles.picture} />
							<span className={cn(styles.availability, sold && styles.sold)}>
								{sold ?
									<>Sold</>
								:
									<a
										href={`mailto:info@joakimnystrom.com${title ? `?subject=${encodeURIComponent(title)}` : ''}`}
										onClick={e => e.stopPropagation()}
									>
										Buy
									</a>
								}
							</span>
						</li>
					)}
				</ul>
			</section>
		</>
	)
}