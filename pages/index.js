import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAllAssignments} from '/graphql'
import cn from 'classnames'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';
import { useWindowSize } from 'rooks';
import smoothscroll from 'smoothscroll-polyfill';

export default function Start({assignments}){	

	const [index, setIndex] = useState(0)
	const [loadedImages, setLoadedImages] = useState(0)
	const [loading, setLoading] = useState(true)
	const { innerWidth } = useWindowSize();

	const back = () => setIndex(index > 0 ? index-1 : 0)
	const forward = () => setIndex(index+1 < assignments.length ? index+1 : index)
	const handleKeyDown = ({key}) => key === 'ArrowRight' ?  forward() : key === 'ArrowLeft' ? back() : null
		
	const scrollTo = (index, behavior = 'smooth') => {
		const container = document.getElementById('container');
		const slide = document.getElementById(`slide-${index}`)
		const padding = (container.clientWidth*0.2)/2
		container.scrollTo({left: slide.offsetLeft - padding, behavior});	
	}

	useEffect(()=>{ smoothscroll.polyfill(); scrollTo(index, 'instant')}, [])
	useEffect(()=> scrollTo(index), [index, innerWidth])
	useEffect(()=>{
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [index])
	
	useEffect(()=>{
		const totalImages = assignments.filter(a => a.images.length > 0).length
		setLoading(loadedImages < totalImages)
	}, [loadedImages])


	return (
		<main id="container" className={styles.container}>
			<ul>
				<a>
					<li id={`slide-start`}>
						<Image data={assignments[assignments.length-1].images[0].responsiveImage} className={cn(styles.image, styles.cropped)} blurupClassName={styles.blurup}/>
					</li>
				</a>
				{assignments.map(({title, slug, images}, idx) => 
					<Link href={`/${slug}`}>
						<a id={`slide-${idx}`}>
							<li key={idx}>
								<Image 
									data={images[0].responsiveImage} 
									className={styles.image} 
									blurupClassName={styles.blurup} 
									onLoad={()=>setLoadedImages(loadedImages+1)}
									//lazyLoad={false}
								/>
								<span className={cn(styles.title, index === idx && styles.show)}>
									{title}
								</span>
							</li>
						</a>
					</Link>
				)}
				<a>
					<li id={`slide-end`}>
						<Image data={assignments[0].images[0].responsiveImage} className={cn(styles.image, styles.cropped)} blurupClassName={styles.blurup}/>
					</li>
				</a>
			</ul>
			<div className={styles.nav}>
				<div className={styles.back} onClick={back}></div>
				<div className={styles.forward} onClick={forward}></div>
			</div>
			{/*loading && <div className={styles.loading}>Loading...</div>*/}
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllAssignments]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});