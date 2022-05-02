import styles from './Artwork.module.scss'
import { withGlobalProps } from "/lib/hoc";
import cn from 'classnames'
import { Image } from 'react-datocms';
import { GetAllArtwork } from '/graphql';

export default function Artwork({artwork}){	
	console.log(artwork)
	return (
		<div className={styles.container}>
      {artwork.map(({image, dimensions, sold}) => 
				<div className={styles.artwork}>
					<Image data={image.responsiveImage} className={styles.image} pictureClassName={styles.picture}/>
					<span className={styles.dimensions}>{dimensions}</span>
					<span className={cn(styles.availability, sold && styles.sold)}>{sold ? 'Sold' : 'Buy'}</span>
				</div>
			)}
		</div>
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