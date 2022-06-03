import styles from './Studio.module.scss'
import cn from 'classnames'
import Content from '/components/Content';
import Artwork from '/components/Artwork';
import ArtworkGallery from '/components/ArtworkGallery';

import Markdown from '/lib/dato/components/Markdown';
import useStore from '/store';
import { useState, useEffect } from 'react';

export default function Studio({ artwork, studio: { email, phone, description, address, postal, background, clients }, show, revRoute }) {

	const setIsShowingArtworkGallery = useStore((state) => state.setIsShowingArtworkGallery)
	const [galleryIndex, setGalleryIndex] = useState()
	
	useEffect(()=>{setIsShowingArtworkGallery(galleryIndex !== undefined)}, [galleryIndex])

	return (
		<>
			<Content className={styles.studio}>
				<aside>
					<h2>Contact</h2>
					<p>
						{email}<br />
						{phone}<br />
						<h2>Studio</h2>
						{address}<br />
						{postal}
					</p>
				</aside>
				<article>
					<Markdown>{description}</Markdown>
					<h2>Clients</h2>
					<ul>
						{clients.map(({ name }, idx) =>
							<li key={idx}>{name}</li>
						)}
					</ul>
					<h2>Photo credit</h2>
					<Markdown>{background}</Markdown>
					<h2>Paintings</h2>
					<Artwork 
						artwork={artwork} 
						onShowGallery={setIsShowingArtworkGallery} 
						onIndexChange={setGalleryIndex}
					/>
				</article>
				
			</Content>
			{galleryIndex !== undefined &&
				<ArtworkGallery
					images={artwork.map(({ image }) => image)}
					index={galleryIndex}
					onClose={() => setGalleryIndex(undefined)}
				/>
			}
		</>
	)
}
