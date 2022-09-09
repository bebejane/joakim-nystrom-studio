import styles from './Artwork.module.scss';
import { Image } from 'react-datocms';
import { useEffect } from 'react';
import shallow from 'zustand/shallow'
import useStore from '/lib/store';

export default function Artwork({ artwork, onShowGallery, onIndexChange, prevRoute }) {

	const [galleryIndex, setGalleryIndex] = useStore((state) => [state.galleryIndex, state.setGalleryIndex], shallow)

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