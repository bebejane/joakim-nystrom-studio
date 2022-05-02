import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAllAssignments} from '/graphql'
import cn from 'classnames'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';
import { useWindowSize } from 'rooks';
import smoothscroll from 'smoothscroll-polyfill';
import Content from '/components/Content';

export default function Start({assignments}){	

	const [index, setIndex] = useState(0)
	const [navWidth, setNavWidth] = useState(0)
	const [loadedImages, setLoadedImages] = useState(0)
	const [loading, setLoading] = useState(true)
	const { innerWidth, innerHeight } = useWindowSize();

	const back = () => setIndex(index > 0 ? index-1 : 0)
	const forward = () => setIndex(index+1 < assignments.length ? index+1 : 0)
	const handleKeyDown = ({key}) => key === 'ArrowRight' ?  forward() : key === 'ArrowLeft' ? back() : null
		
	const scrollTo = (index, behavior = 'smooth') => {
		const container = document.getElementById('container');
		const slide = document.getElementById(`slide-${index}`)
		const left = slide.offsetLeft - ((innerWidth-slide.clientWidth)/2)
		container.scrollTo({left, behavior});
		setNavWidth((innerWidth-slide.clientWidth)/2)
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
		<Content id="container" className={styles.container}>
			<ul>
				{assignments.map(({title, slug, images}, idx) => {
					const maxWidth = innerWidth*0.8;
					const image = images[0]
					const rotation = image.width > image.height ? 'landscape' : 'portrait'
					const width = Math.min((innerHeight/image.height)*image.width, maxWidth);
					
					return (
						<Link key={idx}href={`/${slug}`}>
							<a id={`slide-${idx}`} style={{maxWidth:`${width}px`, width:`${width}px`}}>
								<li key={idx}>
									<Image 
										data={image.responsiveImage} 
										className={styles.image} 
										pictureClassName={styles.picture} 
										blurupClassName={styles.blurup} 
										onLoad={()=>setLoadedImages(loadedImages+1)}
									/>
									<div className={cn(styles.title, index === idx && styles.show)}>
										<span>{title}</span>
									</div>
								</li>
							</a>
						</Link>
					)})}
				
			</ul>
			<a className={styles.slideEnd}>‹</a>
			<div className={styles.nav}>
				<div className={styles.back} onClick={back} style={{width:`${index === 0 ? 0 : navWidth}px`}}></div>
				<div className={styles.forward} onClick={forward} style={{width:`${index === 0 ? navWidth*2 : navWidth}px`}}></div>
			</div>
			{/*loading && <div className={styles.loading}>Loading...</div>*/}
		</Content>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllAssignments]}, async ({props, revalidate }) => {
	return {
		props,
		revalidate
	};
});