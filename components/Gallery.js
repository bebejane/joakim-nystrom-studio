import styles from './Gallery.module.scss'
import cn from 'classnames'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'rooks';
import smoothscroll from 'smoothscroll-polyfill';
import useStore from '/store'
import { motion} from 'framer-motion';
import useTraceUpdate from '/lib/hooks/useTraceUpdate';

const duration = 1;
const galleryTransition = {
	initial: {
		translateY:'100vh'
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
	}	
}

export default function Gallery({slides, className, style}){	
	//useTraceUpdate(props);
  
  const [index, setIndex] = useState(0)
  const [init, setInit] = useState(false)
	const [navWidth, setNavWidth] = useState(0)
	const [dimensions, setDimensions] = useState({innerWidth:0, innerHeight:0})
	const { innerWidth, innerHeight } = useWindowSize();
	const [caption, setCaption] = useState()
	const timer = useRef(null);
  const galleryRef = useRef()
	
  const scrollTo = (idx, behavior = 'smooth', skipIndex = false) => {
		
		const slide = document.getElementById(`slide-${idx}`)
    const left = slide.offsetLeft - ((((dimensions.innerWidth-slide.clientWidth)/2)))
		
		setCaption(undefined)
		setNavWidth((dimensions.innerWidth-slide.clientWidth)/2)

		galleryRef.current?.scrollTo({left,top:0, behavior: init ? behavior : 'instant'})

		if(!skipIndex){	
			clearTimeout(timer.current)
			timer.current = setTimeout(()=>setCaption(slides[index].title), 750)
		}
		
    if(!init)
      setTimeout(()=>setInit(true), 500)
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
	
	const handleKeyDown = ({key}) => key === 'ArrowRight' ?  forward() : key === 'ArrowLeft' ? back() : null
	
	useEffect(()=>{ scrollTo(0, 'instant'); smoothscroll.polyfill(); }, [])
	useEffect(()=> setDimensions({innerHeight, innerWidth}), [innerHeight, innerWidth])
	useEffect(()=> scrollTo(index), [index, dimensions.innerWidth, slides])
	useEffect(()=>{
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [index])

  return (
		<div ref={galleryRef} className={cn(styles.gallery, className)} style={style}>
			<ul>
				{slides.concat(slides).concat(slides).map(({title, slug, image}, idx) => {          
					const maxWidth = dimensions.innerWidth*0.8;
					const width = Math.min((dimensions.innerHeight/image.height)*image.width, maxWidth);
					const realIndex = idx-(slides.length);
					const isIntroSlide =  realIndex >= -1 && realIndex <= 1;
					
					return (
						<Link key={`slide-${idx}`} href={`/${slug}`}>
							<motion.a
								initial={realIndex === 0 && isIntroSlide ? undefined : 'initial'}
								animate={realIndex !== 0 ? 'enter' : undefined}
								exit={realIndex !== index  ? "exit" : undefined}
								variants={galleryTransition} 
								id={`slide-${realIndex}`} 
                key={`slide-link-${idx}`} 
                style={{maxWidth:`${width}px`, width:`${width}px`, height:`${dimensions.innerHeight}px`}}
              >
								<li key={`slide-li-${idx}`}>
									{image.responsiveImage ?
                    <Image 
                      data={image.responsiveImage} 
                      className={styles.image} 
                      lazyLoad={true}
                      layout="responsive"
                      objectFit="contain"
                      objectPosition="50% 50%"
                      fadeInDuration={0}
                      usePlaceholder={true}
                      intersectionMargin={'0px 100px 0px 100px'}
                    />
                  : image.mimeType.startsWith('video') ? 
										<Video data={image} active={index === realIndex}/>
									:
										null
								}
								</li>
							</motion.a>
						</Link>
					)})}
			</ul>

			<div key={'caption'} className={cn(styles.caption, caption && styles.show)}>
				<span>{caption}</span>
			</div>
			
			<div key={'nav'} className={styles.nav}>
				<div key={'back'} className={styles.back} onClick={back} style={{width:`${navWidth}px`}}></div>
				<div key={'forward'} className={styles.forward} onClick={forward} style={{width:`${navWidth}px`}}></div>
			</div>
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