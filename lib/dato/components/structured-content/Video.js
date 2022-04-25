import styles from "./Video.module.scss"
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "rooks"

export default function Video({ provider, providerUid, title, url, thumbnailUrl }) {
	const ref = useRef()
	const [height, setHeight] = useState(360);
	const { innerWidth } = useWindowSize()

	const vimeoId = provider === 'vimeo' && url.indexOf('/') > -1 ? url.substring(url.lastIndexOf('/')+1) : undefined
	
	const video = provider === 'youtube' ?
		<iframe
			ref={ref}
			id="ytplayer"
			type="text/html"
			width="100%"
			height={height}
			allowFullScreen
			allow="autoplay; fullscreen; picture-in-picture"
			src={`https://www.youtube.com/embed/${providerUid}?autoplay=0&origin=http://example.com`}
			frameBorder="0"
		/>
		: provider === 'vimeo' ?
			<iframe
				ref={ref}
				type="text/html"
				src={`https://player.vimeo.com/video/${providerUid}?h=${vimeoId}`}
				width="100%"
				height={height}
				frameBorder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowFullScreen
			/>
			: null;

	useEffect(() => setHeight((ref.current?.clientWidth / 16) * 9), [innerWidth]) // Set to 16:9

	return (
		video ?
			<section className={styles.video}>
				{video}
			</section>
			:
			<span>Video {provider} not supported!</span>
	)
}