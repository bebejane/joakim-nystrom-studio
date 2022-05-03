import styles from './Background.module.scss'
import cn from 'classnames'
import useStore from '/store';
import { useWindowSize } from 'rooks';
import { useState, useEffect } from 'react';

export default function Background({image}){
	
	const [dimensions, setDimensions] = useState({innerWidth:0, innerHeight:0})
	const { innerWidth, innerHeight } = useWindowSize();

	const backgroundImage = useStore((state) => state.backgroundImage);
	const isTransitioning = useStore((state) => state.isTransitioning);
	
	useEffect(()=> setDimensions({innerHeight, innerWidth}), [innerHeight, innerWidth])
	
	const maxWidth = dimensions.innerWidth*0.8;
	const width = backgroundImage ? Math.min((dimensions.innerHeight/backgroundImage.height)*backgroundImage.width, maxWidth) : 0
	
	return (
		<div className={cn(styles.background, isTransitioning && styles.active)}>
			<div className={styles.imageWrap} style={{maxWidth:`${width}px`, width:`${width}px`, height:`${dimensions.innerHeight}px`}}>
      	{(backgroundImage || image) && <img src={(backgroundImage || image).url}/>}
			</div>
		</div>
	)
}