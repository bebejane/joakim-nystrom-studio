import styles from './GallerySPA.module.scss'
import cn from 'classnames'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'rooks';
import smoothscroll from 'smoothscroll-polyfill';
import { motion, useForceUpdate } from 'framer-motion';
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

export default function Gallery({id, slides, className, style = {}, onIndexChange, onIndexSelected, active}){	
	
  const router = useRouter()
  const [index, setIndex] = useState(0)
	const [loaded, setLoaded] = useState(0)
  const [init, setInit] = useState(false)
	const [dimensions, setDimensions] = useState({innerHeight: 0, innerWidth: 0})
	const { innerWidth, innerHeight } = useWindowSize();
	
	const allSlides = slides.concat(slides).concat(slides)
	const timer = useRef(null);
  const galleryRef = useRef(null)
	const captionRef = useRef(null)
	
  const scrollTo = (idx, behavior = active ? 'smooth' : 'instant', skipIndex = false) => {
		
		if(dimensions.innerWidth === 0) return
		
		const slide = document.getElementById(`slide-${idx}-${id}`)
		if(!slide) return console.log('slide not found')
    const left = Math.floor(slide.offsetLeft - ((dimensions.innerWidth-slide.clientWidth)/2))
		const navWidth = (dimensions.innerWidth-slide.clientWidth)/2
		
		//captionRef.current.style.display = 'none'
		//captionRef.current.innerHTML = ''
		galleryRef.current.scrollTo({left, top:0, behavior : init ? behavior : 'instant'})
		//console.log('scroll', id, behavior)
		if(!init) setInit(true)

		return
		if(skipIndex) return

		clearTimeout(timer.current)
		timer.current = setTimeout(() => {
			if(!captionRef.current) return
			captionRef.current.innerHTML = slides[index]?.title
			captionRef.current.style.display = 'flex'
		}, 750)
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
	
	//useEffect(()=>{ smoothscroll.polyfill(); }, [])
	useEffect(()=> scrollTo(index), [index, slides.length, dimensions, id])
	useEffect(()=> setDimensions({innerHeight, innerWidth}), [innerHeight, innerWidth])
	useEffect(()=> onIndexChange(index), [index])
	
	

  return (
		<div ref={galleryRef} className={cn(styles.gallery, className)} style={style}>
			<ul>
				{allSlides.map(({title, slug, image}, idx) => {
					if(!image) return null
					const maxWidth = dimensions.innerWidth * 0.8;
					const width = Math.min((dimensions.innerHeight/image.height)*image.width, maxWidth);
					const realIndex = idx-(slides.length);
					const isIntroSlide = realIndex >= -1 && realIndex <= 1;
					const isNavSlide = (index-1 === realIndex || index+1 === realIndex)
					const allExit = ['/artwork', '/studio'].includes(router.asPath) 
					
					return (
						
							<li
								id={`slide-${realIndex}-${id}`}
								key={`slide-a-${idx}`} 
								className={cn(isNavSlide && styles.nav)}
								style={{maxWidth:`${width}px`, width:`${width}px`, height:`${dimensions.innerHeight}px`}}
								initial={realIndex === 0 && isIntroSlide ? undefined : 'initial'}
								animate={realIndex !== 0 ? 'enter' : undefined}
								exit={allExit ? 'fadeOut' : realIndex !== index ? "exit" : undefined}
								variants={galleryTransition} 
								onClick={()=> index-1 == realIndex ? back() : index+1 == realIndex ? forward() : onIndexSelected(index)}
              >
									{image.responsiveImage ?
                    <Image 
											key={`slide-image-${idx}`}
                      data={image.responsiveImage}     
                      className={styles.image}
                      layout="responsive"
                      objectFit="contain"
                      objectPosition="50% 50%"
                      fadeInDuration={0}
                      usePlaceholder={true}
											lazyLoad={true}
											//onLoad={()=>setLoaded(loaded+1)}
                      intersectionMargin={'0px 0px 0px 0px'}
											intersectionThreshold={0.0}
											
                    />										
                  : image.mimeType.startsWith('video') ? 
										<Video key={`slide-video-${idx}`} data={image} active={index === realIndex}/>
									:
										null
								}
								</li>
							
						
					)})}
			</ul>
			{/*<div key={'caption'} className={styles.caption}>
				<span ref={captionRef}></span>
							</div>*/}
		</div>
	)
}

const Video = ({data, active}) => {
	
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