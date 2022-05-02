import styles from './Artwork.module.scss'
import { withGlobalProps } from "/lib/hoc";
import cn from 'classnames'
import { Image } from 'react-datocms';
import { GetAllArtwork } from '/graphql';
import Content from '/components/Content';

export default function Artwork({artwork}){	
	return (
		<Content className={styles.container}>
			{artwork.map(({image, dimensions, sold}) => 
				<div className={styles.artwork}>
					<Image data={image.responsiveImage} className={styles.image} pictureClassName={styles.picture}/>
					<span className={styles.dimensions}>{dimensions}</span>
					<span className={cn(styles.availability, sold && styles.sold)}>{sold ? 'Sold' : 'Buy'}</span>
				</div>
			)}
		</Content>
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