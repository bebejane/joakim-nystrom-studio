import styles from './Gallery.module.scss'
import cn from 'classnames'
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'rooks';
import { motion, useElementScroll } from 'framer-motion';
import { use100vh } from 'react-div-100vh'

export default function Gallery({
	id,
	slides,
	className,
	style = {},
	active,
	caption,
	loop = true,
	index: indexFromProps,
	onIndexChange,
	onIndexSelected,
	onClose,
	onEndReached
}) {

	const [isMobile, setIsMobile] = useState(false)
	const [index, setIndex] = useState(indexFromProps !== undefined ? indexFromProps : 0)
	const [scrollIndex, setScrollIndex] = useState(0)
	const [transition, setTransition] = useState({ offset: undefined, duration: undefined })
	const [dimensions, setDimensions] = useState({ innerHeight: 0, innerWidth: 0 })

	const { innerWidth, innerHeight } = useWindowSize();
	const height = use100vh()

	const isReady = dimensions.innerWidth > 0 && transition.offset !== undefined
	const galleryRef = useRef(null)
	const { scrollXProgress } = useElementScroll(galleryRef)
	const allSlides = isMobile ? slides : slides.concat(slides).concat(slides)

	if (!loop && !isMobile) {
		allSlides[slides.length - 1] = { type: 'empty' }
		allSlides[slides.length * 2] = { type: 'empty' }
	}

	const scrollTo = (idx, duration = active && isReady ? 0.5 : 0, skipIndex = false) => {

		if (dimensions.innerWidth === 0) return

		const slide = document.getElementById(`slide-${idx}-${id}`)
		if (!slide) return console.log('slide not found')
		
		const offset = -Math.floor(slide.offsetLeft - (isMobile ? 0 : ((dimensions.innerWidth - slide.offsetWidth) / 2)))

		setTransition({ offset, duration })
		idx + 1 === slides.length && onEndReached?.(true)
	}

	const back = () => {
		if (index - 1 >= 0) return setIndex(index - 1)
		if (!loop) return
		scrollTo(slides.length, 0)
		setTimeout(() => setIndex(slides.length - 1), 20)
	}

	const forward = () => {
		if (index + 1 >= slides.length && !loop) return onClose?.()
		if (index + 1 >= slides.length) scrollTo(-1, 0);
		setTimeout(() => setIndex(index + 1 < slides.length ? index + 1 : 0), 20)
	}

	const handleIndexSelected = (idx) => slides[idx] && slides[idx].type !== 'text' && onIndexSelected?.(idx)

	useEffect(() => { setDimensions({ innerHeight, innerWidth }) }, [innerHeight, innerWidth])
	useEffect(() => { scrollTo(index); onIndexChange?.(index); }, [index, slides, dimensions, id])
	useEffect(() => { indexFromProps !== undefined && setIndex(indexFromProps) }, [indexFromProps])
	useEffect(() => { setIsMobile(innerWidth && innerWidth <= 768) }, [innerWidth])

	const updateIndexOnScroll = (p, innerWidth) => {
		const items =  Array.prototype.slice.call(document.querySelectorAll(`li[index]`))
		const offset = items.reduce((acc, curr) => acc + curr.clientWidth, 0) * p
		
		for (let i = 0; i < items.length; i++) {
			if(items[i].offsetLeft >= offset)
				return setScrollIndex(i-1)
		}
	}
	useEffect(() => { if(isMobile) return scrollXProgress.onChange(updateIndexOnScroll)}, [isMobile, dimensions, galleryRef])

	const handleKeyDown = ({ key }) => active && (key === 'ArrowRight' ? forward() : key === 'ArrowLeft' ? back() : null)
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [index, active])
	
	return (
		<div 
			id={id} 
			ref={galleryRef} 
			key={`gallery-${id}`} 
			className={cn(styles.gallery, className)} 
			style={{ ...style, visibility: !isReady ? 'hidden' : 'visible'}}
		>
			<motion.ul
				id={'slide-list'}
				animate={{ translateX: `${transition.offset || 0}px` }}
				transition={{ duration: transition.duration || 0 }}
			>
				{allSlides.map(({ title, data, type, description, margin, dark }, idx) => {

					const maxWidth = dimensions.innerWidth * (isMobile ? 1 : 0.8);
					const width = type === 'text' ? maxWidth : Math.min((height / data.height) * data.width, isMobile ? data.width : maxWidth);
					const realIndex = isMobile ? idx : idx - (slides.length);
					const isBackNavSlide = index - 1 === realIndex
					const isForwardNavSlide = index + 1 === realIndex
					const isNavSlide = isMobile ? false : (isBackNavSlide || isForwardNavSlide)
					
					const isCenterSlide = realIndex === index

					const slideStyles = {
						maxWidth: isMobile ? 'unset' : `${width}px`,
						minWidth: isMobile ? 'unset' : `${width}px`,
						width: isMobile ? 'auto' : `${width}px`,
						height: height,
						visibility: `${(slides.length <= 1 && isNavSlide) || !isReady ? 'hidden' : 'visible'}`,
						overflow: isMobile ? 'unset' : 'hidden'
					}

					return (
						<li
							id={`slide-${realIndex}-${id}`}
							index={idx}
							key={`slide-a-${idx}-${id}`}
							className={cn(isNavSlide && styles.nav, isBackNavSlide && styles.back, isForwardNavSlide && styles.forward, margin && styles.padded)}
							style={slideStyles}
							onClick={() => isNavSlide ? (index - 1 === realIndex ? back() : forward()) : handleIndexSelected(realIndex)}
					
						>
							{type === 'text' || type == 'empty' ?
								<TextSlide text={data} width={maxWidth} isMobile={isMobile} />
									: type === 'image' ?
								<ImageSlide image={data} width={width} isMobile={isMobile} margin={margin} />
									: type === 'video' ?
								<VideoSlide key={`slide-video-${idx}-${id}`} data={data} active={index === realIndex || scrollIndex === realIndex} width={width} isMobile={isMobile}/>
									:
								null
							}
							{description &&
								<div key={`slide-caption-${idx}-${id}`} className={cn(styles.caption, (isCenterSlide || isMobile) && styles.show)}>
									<p>
										<div className={cn(styles.title, dark && styles.dark)}>
											<span className={styles.description}>{description}</span>
										</div>
										<div className={styles.bg}></div>
									</p>
								</div>
							}
						</li>
					)
				})}
			</motion.ul>
			
		</div>
	)
}

const TextSlide = ({ text, width }) => {

	return (
		<div className={styles.textSlide} style={{ minWidth: `${width}px` }}>
			<div className={styles.content} style={{ minWidth: `${width}px` }}>
				{text &&
					<div>{text}</div>
				}
			</div>
		</div>
	)
}
const ImageSlide = ({ image, width, margin, isMobile }) => {

	return (
		<img
			className={styles.imageSlide}
			src={`${image.url}?w=1400`}
			style={{ width: isMobile ? `${width}px` : '100%', maxWidth: `${width}px`, height: '100%' }}
			loading={'eager'}
		/>
	)
}

const VideoSlide = ({ data, active, width, isMobile, scrollIndex }) => {

	const videoRef = useRef();
	const play = ()=> {
		videoRef.current.currentTime = 0;
		videoRef.current.play().catch((err) => {})
	}
	const [internalActive, setInternalActive] = useState(false)

	useEffect(() => {
		if (!videoRef.current ) return
		if (active || internalActive)
			videoRef.current.play().catch((err) => {})
		else 
			videoRef.current.pause();
	}, [active, internalActive])

	return (
		<>
			<video
				playsInline
				muted
				src={data.url}
				ref={videoRef}
				autoPlay={false}
				type={data.mimeType}
				disablePictureInPicture={true}
				loop={true}
				poster={data.video?.thumbnailUrl}
				className={styles.videoSlide}
				style={{ width: `${width}px`, maxWidth: `${width}px` }}
			/>
			{/*<div className={styles.play}>
				<img src={'/img/play.svg'} onClick={()=>play()}/>
			</div>*/}
		</>
	)
}