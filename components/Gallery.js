import styles from './Gallery.module.scss'
import cn from 'classnames'
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'rooks';
import { motion, useElementScroll} from 'framer-motion';
import { useRouter } from 'next/router';
import { clamp } from '/utils';
import Link from 'next/link';

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

export default function Gallery({
	id, 
	slides, 
	className, 
	style = {}, 
	active,
	caption,
	loop = true,
	index:indexFromProps,
	onIndexChange, 
	onIndexSelected, 
	onClose
}){	
	
	
  const router = useRouter()
	const [isMobile, setIsMobile] = useState(false)
	const [index, setIndex] = useState(indexFromProps !== undefined ? indexFromProps : 0)	
	const [transition, setTransition] = useState({ offset:undefined, duration:undefined})
	const [dimensions, setDimensions] = useState({ innerHeight: 0, innerWidth: 0 })
	
	const { innerWidth, innerHeight } = useWindowSize();
	const isReady = dimensions.innerWidth > 0 && transition.offset !== undefined
	const galleryRef = useRef(null)
	const { scrollXProgress } = useElementScroll(galleryRef)
	const allSlides = isMobile ? slides : slides.concat(slides).concat(slides)
	
	if(!loop && !isMobile){
		allSlides[slides.length-1] = { type:'empty'}
		allSlides[slides.length*2] = { type:'empty'}
	}
	
  const scrollTo = (idx, duration = active && isReady ? 0.5 : 0, skipIndex = false) => {	
		
		if(dimensions.innerWidth === 0) return
		
		const slide = document.getElementById(`slide-${idx}-${id}`)
		if(!slide) return console.log('slide not found')

    const offset = -Math.floor(slide.offsetLeft - (isMobile ? 0 : ((dimensions.innerWidth-slide.clientWidth)/2)))
		setTransition({offset, duration})
  }

	const back = () => {
		if(index-1 >= 0) return setIndex(index-1)
		if(!loop) return 
		scrollTo(slides.length, 0)
		setTimeout(()=>setIndex(slides.length-1), 20)
	}

	const forward = () => {
		if(index+1 >= slides.length && !loop) return
		if(index+1 >= slides.length) scrollTo(-1, 0);
		setTimeout(()=>setIndex(index+1 < slides.length ? index+1 : 0), 20)
	}
	
	useEffect(()=> { setDimensions({innerHeight, innerWidth}) }, [innerHeight, innerWidth])
	useEffect(()=> { scrollTo(index) }, [index, slides, dimensions, id])
	useEffect(()=> { onIndexChange && onIndexChange(index) }, [index])
	useEffect(()=> { indexFromProps !== undefined && setIndex(indexFromProps) }, [indexFromProps])
	useEffect(()=>{ setIsMobile(innerWidth && innerWidth <= 768)}, [innerWidth])
	useEffect(()=>{
		isMobile && onIndexChange && scrollXProgress.onChange((p)=>onIndexChange(clamp(Math.floor(slides.length*p), 0, slides.length-1)))
	}, [isMobile])
	
	return (
		<div id={id} ref={galleryRef} key={`gallery-${id}`} className={cn(styles.gallery, className)} style={{...style, visibility: !isReady ? 'hidden' : 'visible'}}>
			<motion.ul
				id={'slide-list'}
				layoutScroll
				animate={{translateX: `${transition.offset || 0}px`}}
				transition={{duration: transition.duration || 0}}
			>
			{allSlides.map(({title, slug, image, text, type}, idx) => {

				const maxWidth = dimensions.innerWidth * (isMobile ? 1 : 0.8);
				const width = !image ? maxWidth : Math.min((dimensions.innerHeight/image.height)*image.width, isMobile ? image.width : maxWidth );
				const realIndex = isMobile ? idx : idx-(slides.length);
				const isIntroSlide = realIndex >= -1 && realIndex <= 1;
				const isNavSlide = isMobile ? false : (index-1 === realIndex || index+1 === realIndex)
				const isCenterSlide = realIndex === index
				const allExit = ['/artwork', '/studio'].includes(router.asPath) 
				
				const slideStyles = {
					maxWidth: isMobile ? 'unset' : `${width}px`, 
					width: isMobile ? 'auto' : `${width}px`, 
					height:`${dimensions.innerHeight}px`, 
					visibility: `${(slides.length <= 1 && isNavSlide) || !isReady ? 'hidden' : 'visible'}`,	
				}
				
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
						onClick={()=> isNavSlide ? (index-1 === realIndex ? back() : forward()) : onIndexSelected && type !== 'text' && onIndexSelected(realIndex)}
					>
							{ type === 'text' || type == 'empty' ? 
								<TextSlide text={text} width={maxWidth} isMobile={isMobile} slug={slug}/>
							: type === 'image' ?
								<ImageSlide image={image} width={width} isMobile={isMobile}/>
							: type === 'video' ?
								<VideoSlide key={`slide-video-${idx}-${id}`} data={image} active={index === realIndex} width={width} isMobile={isMobile}/>
							:
								null
						}
							{!caption &&
								<div key={`slide-caption-${idx}-${id}`} className={cn(styles.slideCaption, (isCenterSlide || isMobile) && styles.show)}>
									<span>{title}</span>
								</div>
							}
						</li>
				)})}
			</motion.ul>
			{caption && 
				<div className={cn(styles.caption, styles.show, isMobile && styles.mobile)}>
					<span>{caption}</span>
				</div>
			}
		</div>
	)
}

const TextSlide = ({text, slug, width}) => {
	
	return (
		<div className={styles.textSlide} style={{minWidth:`${width}px`}}>
			<div className={styles.content} style={{minWidth:`${width}px`}}>
				{text}
			</div>
		</div>
	)
}
const ImageSlide = ({image, width}) => {

	return (
		<picture>
			<img 
			className={styles.imageSlide}
			src={`${image.url}?w=1400`} 
			style={{ width:`${width}px`, maxWidth:`${width}px`, height:'100vh'}} 
		/>	
		</picture>
	)
}

const VideoSlide = ({data, active, width}) => {
	
	const videoRef = useRef();
	
	useEffect(()=>{
		if(!videoRef.current) return
		if(active) {
			//videoRef.current.currentTime = 0
			videoRef.current.play().catch(()=>{})
		}else{
			videoRef.current.pause();
			
		}
	}, [active])

	return (
		<video 
			src={data.url} 
			ref={videoRef} 
			autoPlay={false} 
			type={data.mimeType} 
			disablePictureInPicture={true} 
			loop={true}
			className={styles.videoSlide}
			style={{ width:`${width}px`, maxWidth:`${width}px`}}
		/>
	)
}