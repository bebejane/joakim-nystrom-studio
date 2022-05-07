import styles from './Gallery.module.scss'
import cn from 'classnames'
import Link from 'next/link';
//import { Image } from 'react-datocms';
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'rooks';
import smoothscroll from 'smoothscroll-polyfill';
//import { motion, useForceUpdate } from 'framer-motion';
import { useRouter } from 'next/router';

const duration = 0.7;
const galleryTransition = {
	initial: {
		translateY:'100vh',
		opacity: 1,
	},
	enter: {
		translateY:'0vh',
		transition:{ duration}
	},
	exit: {
		translateY:'-100vh',
		transition:{ duration},
		transitionEnd: {
			translateY:'unset',
		}
	},
	fadeIn:{
		opacity:1
	},
	fadeOut:{
		opacity:1
	}
}

export default function Gallery({id, slides, className, style = {}, onIndexChange, onIndexSelected, active, index:indexFromProps}){	
	
  const router = useRouter()
  const [index, setIndex] = useState(0)
	const [dimensions, setDimensions] = useState({innerHeight: 0, innerWidth: 0})
	const { innerWidth, innerHeight } = useWindowSize();
	
	const allSlides = slides.concat(slides).concat(slides)
	const galleryRef = useRef(null)
	const initRef = useRef(false)
	
  const scrollTo = (idx, behavior = active ? 'smooth' : 'instant', skipIndex = false) => {
		
		if(dimensions.innerWidth === 0) return
		
		const slide = document.getElementById(`slide-${idx}-${id}`)
		if(!slide) return console.log('slide not found')
		
    const left = Math.floor(slide.offsetLeft - ((dimensions.innerWidth-slide.clientWidth)/2))
		galleryRef.current.scrollTo({left, behavior : initRef.current === true ? behavior : 'instant'})

		if(!initRef.current)
			setTimeout(()=>initRef.current = true, 100);
	
  }

	const back = () => {
		if(index-1 >= 0) return setIndex(index-1)
		scrollTo(slides.length, 'instant', true)
		setIndex(slides.length-1)
	}

	const forward = () => {
		if(index+1 >= slides.length) scrollTo(-1, 'instant', true)
		setIndex(index+1 < slides.length ? index+1 : 0)
	}
	
	useEffect(()=> { setDimensions({innerHeight, innerWidth}); }, [innerHeight, innerWidth])
	useEffect(()=> { scrollTo(index) }, [index, slides.length, dimensions, id])
	useEffect(()=> { onIndexChange(index) }, [index])
	useEffect(()=> { indexFromProps !== undefined && setIndex(indexFromProps) }, [indexFromProps])
	useEffect(()=>{ smoothscroll.polyfill()}, []) // Safari
	
	return (
		<div ref={galleryRef} key={`gallery-${id}`} className={cn(styles.gallery, className)} style={style}>
			<ul>
				{allSlides.map(({title, slug, image, text, link}, idx) => {

					const maxWidth = dimensions.innerWidth * 0.8;
					const width = !image ? maxWidth : Math.min((dimensions.innerHeight/image.height)*image.width, maxWidth);
					const realIndex = idx-(slides.length);
					const isIntroSlide = realIndex >= -1 && realIndex <= 1;
					const isNavSlide = (index-1 === realIndex || index+1 === realIndex)
					const isCenterSlide = realIndex === index
					const allExit = ['/artwork', '/studio'].includes(router.asPath) 
					
					const slideStyles = {
						maxWidth:`${width}px`, 
						width:`${width}px`, 
						height:`${dimensions.innerHeight}px`, 
						visibility: `${(slides.length <= 1 && isNavSlide) ? 'hidden' : 'visible'}`,
						
					}

					slug = !link ? slug : link.__typename === 'AboutRecord' ? '/studio' : link.__typename === 'ArtworkRecord' ? '/artwork' : null

					return (
						<li
							id={`slide-${realIndex}-${id}`}
							key={`slide-a-${idx}-${id}`} 
							className={cn(isNavSlide && styles.nav)}
							style={slideStyles}
							initial={realIndex === 0 && isIntroSlide ? undefined : 'initial'}
							animate={realIndex !== 0 ? 'enter' : undefined}
							exit={allExit ? 'fadeOut' : realIndex !== index ? "exit" : undefined}
							variants={galleryTransition} 
							onClick={()=> isNavSlide ? (index-1 === realIndex ? back() : forward()) : text ? router.push(slug) : onIndexSelected(index)}
						>
								{ text ? 
									<TextSlide text={text} width={maxWidth}/>
								: image?.responsiveImage ?
									<ImageSlide image={image} width={width}/>	
								: image?.mimeType.startsWith('video') ? 
									<VideoSlide key={`slide-video-${idx}-${id}`} data={image} active={index === realIndex}/>
								:
									null
							}
								<div key={`slide-caption-${idx}-${id}`} className={cn(styles.caption, isCenterSlide && styles.show)}>
									<span>{title}</span>
								</div>
							</li>
					)})}

			</ul>
		</div>
	)
}

const TextSlide = ({text, slug, width}) => {

	return (
		<div className={styles.text} style={{minWidth:`${width}px`}}>
			<div className={styles.content} style={{minWidth:`${width}px`}}>
				{text}
			</div>
			<div className={styles.label}>
				Read more
			</div>
		</div>
	)
}
const ImageSlide = ({image, width}) => {

	return (
		<picture>
			<img 
			className={styles.image}
			src={`${image.url}?w=1400`} 
			style={{ width:`${width}px`, maxWidth:`${width}px`, height:'100vh'}} 
		/>	
		</picture>
	)
}

const VideoSlide = ({data, active}) => {
	
	const videoRef = useRef();
	
	useEffect(()=>{
		if(!videoRef.current) return
		if(active) {
			videoRef.current.currentTime = 0
			videoRef.current.play()
		}else{
			videoRef.current.pause();
			
		}
	}, [active])

	return (
		<div className={styles.video}>
			<video 
				src={data.url} 
				ref={videoRef} 
				autoPlay={false} 
				type={data.mimeType} 
				disablePictureInPicture={true} 
				loop={true}
			/>
			<div className={styles.play}></div>
		</div>
	)

}