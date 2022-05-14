import styles from './Gallery.module.scss'
import cn from 'classnames'
import { useState, useEffect, useRef } from 'react';
import { useWindowSize } from 'rooks';
import { motion, useElementScroll } from 'framer-motion';
import { useRouter } from 'next/router';
import { clamp } from '/utils';

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

	const router = useRouter()
	const [isMobile, setIsMobile] = useState(false)
	const [hoverIndex, setHoverIndex] = useState()
	const [index, setIndex] = useState(indexFromProps !== undefined ? indexFromProps : 0)
	const [transition, setTransition] = useState({ offset: undefined, duration: undefined })
	const [dimensions, setDimensions] = useState({ innerHeight: 0, innerWidth: 0 })

	const { innerWidth, innerHeight } = useWindowSize();
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

		const offset = -Math.floor(slide.offsetLeft - (isMobile ? 0 : ((dimensions.innerWidth - slide.clientWidth) / 2)))
		setHoverIndex(undefined)
		setTransition({ offset, duration })
		
		idx+1 === slides.length && onEndReached?.(true)
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

	const handleIndexSelected = () => slides[index].type !== 'text' && onIndexSelected?.(index)

	useEffect(() => { setDimensions({ innerHeight, innerWidth }) }, [innerHeight, innerWidth])
	useEffect(() => { scrollTo(index) }, [index, slides, dimensions, id])
	useEffect(() => { onIndexChange?.(index) }, [index])
	useEffect(() => { indexFromProps !== undefined && setIndex(indexFromProps) }, [indexFromProps])
	useEffect(() => { setIsMobile(innerWidth && innerWidth <= 768) }, [innerWidth])

	const updateIndexOnScroll = (p) => onIndexChange(clamp(Math.floor(slides.length * p), 0, slides.length - 1))
	useEffect(() => {	
		if(isMobile && onIndexChange)
			return scrollXProgress.onChange(updateIndexOnScroll)
	}, [isMobile])
	
	const handleKeyDown = ({key}) => active && (key === 'ArrowRight' ? forward() : key === 'ArrowLeft' ? back() :  key === 'ArrowUp' ? onClose?.() : key === 'ArrowDown' ? 	handleIndexSelected(index) : null)	
	useEffect(()=>{
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [index, active])

	return (
		<div id={id} ref={galleryRef} key={`gallery-${id}`} className={cn(styles.gallery, className)} style={{ ...style, visibility: !isReady ? 'hidden' : 'visible' }}>
			<motion.ul
				id={'slide-list'}
				layoutScroll
				animate={{ translateX: `${transition.offset || 0}px` }}
				transition={{ duration: transition.duration || 0 }}
			>
				{allSlides.map(({ title, slug, image, text, year, type }, idx) => {

					const maxWidth = dimensions.innerWidth * (isMobile ? 1 : 0.8);
					const width = !image ? maxWidth : Math.min((dimensions.innerHeight / image.height) * image.width, isMobile ? image.width : maxWidth);
					const realIndex = isMobile ? idx : idx - (slides.length);
					const isIntroSlide = realIndex >= -1 && realIndex <= 1;
					const isNavSlide = isMobile ? false : (index - 1 === realIndex || index + 1 === realIndex)
					const isCenterSlide = realIndex === index
					const allExit = ['/artwork', '/studio'].includes(router.asPath)

					const slideStyles = {
						maxWidth: isMobile ? 'unset' : `${width}px`,
						width: isMobile ? 'auto' : `${width}px`,
						height: `${dimensions.innerHeight}px`,
						visibility: `${(slides.length <= 1 && isNavSlide) || !isReady ? 'hidden' : 'visible'}`,
					}
					
					return (
						<li
							id={`slide-${realIndex}-${id}`}
							key={`slide-a-${idx}-${id}`}
							className={cn(isNavSlide && styles.nav)}
							style={slideStyles}
							onClick={() => isNavSlide ? (index - 1 === realIndex ? back() : forward()) : type !== 'text' && handleIndexSelected(realIndex)}
							onMouseMove={()=>{
								if(!isCenterSlide || idx === hoverIndex) return
								setHoverIndex(isCenterSlide ? idx : undefined)
							}}
							onMouseOut={()=>{
								setHoverIndex(undefined)
							}}
						>
							{type === 'text' || type == 'empty' ?
								<TextSlide text={text} year={year} width={maxWidth} isMobile={isMobile} slug={slug} />
								: type === 'image' ?
									<ImageSlide image={image} width={width} isMobile={isMobile} />
									: type === 'video' ?
										<VideoSlide key={`slide-video-${idx}-${id}`} data={image} active={index === realIndex} width={width} isMobile={isMobile} />
										:
										null
							}
							{!caption &&
								<div key={`slide-caption-${idx}-${id}`} className={cn(styles.caption, (isCenterSlide || isMobile) && styles.show)}>
									<p className={cn(hoverIndex === idx && !isMobile && styles.hover)}>
										{title}<span className={styles.arrow}>→</span>
									</p>
								</div>
							}
						</li>
					)
				})}
			</motion.ul>
			{caption &&
				<div className={cn(styles.caption, styles.reverse, styles.fixed, styles.show, isMobile && styles.mobile)} onClick={onClose}>
					<p className={cn(hoverIndex && !isMobile && styles.hover)}>
						{caption}<span className={styles.arrow}>→</span>
					</p>
				</div>
			}
		</div>
	)
}

const TextSlide = ({ text, year, slug, width }) => {

	return (
		<div className={styles.textSlide} style={{ minWidth: `${width}px` }}>
			<div className={styles.content} style={{ minWidth: `${width}px` }}>
				{text &&
					<>
						<div>{text}</div>
						{year}
						<div className={styles.meta}>Client: Bonobo • Year: 2021 • Type: Exhibition design</div>
					</>
				}
			</div>
		</div>
	)
}
const ImageSlide = ({ image, width }) => {

	return (
		<picture>
			<img
				className={styles.imageSlide}
				src={`${image.url}?w=1400`}
				style={{ width: `${width}px`, maxWidth: `${width}px`, height: '100vh' }}
			/>
		</picture>
	)
}

const VideoSlide = ({ data, active, width }) => {

	const videoRef = useRef();

	useEffect(() => {
		if (!videoRef.current) return
		if (active) {
			videoRef.current.play().catch(() => { })
		} else {
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
			style={{ width: `${width}px`, maxWidth: `${width}px` }}
		/>
	)
}