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
	const [dimensions, setDimensions] = useState({innerWidth:0, innerHeight:0})
	const { innerWidth, innerHeight } = useWindowSize();

	const [loadedImages, setLoadedImages] = useState(0)
	const [loading, setLoading] = useState(true)
	const [caption, setCaption] = useState()
	
	const back = () => {
		if(index-1 >= 0) return setIndex(index-1)
		scrollTo(assignments.length, 'instant', true)
		setIndex(assignments.length-1)
	}
	const forward = () => {
		if(index+1 >= assignments.length) scrollTo(-1, 'instant', true)
		setIndex(index+1 < assignments.length ? index+1 : 0)
	}
	const handleKeyDown = ({key}) => key === 'ArrowRight' ?  forward() : key === 'ArrowLeft' ? back() : null
		
	const scrollTo = (index, behavior = 'smooth', skipIndex = false) => {
		
		const container = document.getElementById('container');
		const slide = document.getElementById(`slide-${index}`)
		const left = slide.offsetLeft - ((dimensions.innerWidth-slide.clientWidth)/2)
		
		console.log('scroll', index, left)
		setNavWidth((dimensions.innerWidth-slide.clientWidth)/2)
		if(!skipIndex){
			setCaption()
			setTimeout(()=>setCaption(assignments[index].title), 1000)
		}
		requestAnimationFrame(()=>container.scrollTo({left, behavior, block: 'start'}))	
	}
	
	useEffect(()=>{ scrollTo(index, 'instant')}, [])
	useEffect(()=> scrollTo(index), [index, dimensions.innerWidth, assignments])
	useEffect(()=>setDimensions({innerHeight, innerWidth}), [innerHeight, innerWidth])

	/*
	useEffect(()=>{
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [index])
	*/

	/*
	useEffect(()=>{
		const totalImages = assignments.filter(a => a.images.length > 0).length
		setLoading(loadedImages < totalImages)
		console.log('hej')
	}, [loadedImages])
	*/
	const slides = assignments.concat(assignments).concat(assignments)

	console.log('render')
	return (
		<Content id="container" className={styles.container}>
			<ul>
				{slides.map(({title, slug, images}, idx) => {
					const maxWidth = dimensions.innerWidth*0.8;
					const image = images[0]
					const rotation = image.width > image.height ? 'landscape' : 'portrait'
					const width = Math.min((dimensions.innerHeight/image.height)*image.width, maxWidth);

					return (
						<Link key={`slide-${idx}`} href={`/${slug}`}>
							<a key={`slide-link-${idx}`} id={`slide-${idx-(slides.length/3)}`} style={{maxWidth:`${width}px`, width:`${width}px`}}>
								<li key={`slide-li-${idx}`}>
									<Image 
										data={image.responsiveImage} 
										className={styles.image} 
										pictureClassName={styles.picture} 
										blurupClassName={styles.blurup} 
										//onLoad={()=>setLoadedImages(loadedImages+1)}
										//lazyLoad={false}
									/>
								</li>
							</a>
						</Link>
					)})}
			</ul>
			<div className={cn(styles.caption, caption && styles.show)}>
				<span>{caption}</span>
			</div>
			
			<div className={styles.nav}>
				<div className={styles.back} onClick={back} style={{width:`${navWidth}px`}}></div>
				<div className={styles.forward} onClick={forward} style={{width:`${navWidth}px`}}></div>
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