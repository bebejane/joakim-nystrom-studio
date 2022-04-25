import styles from "./Sound.module.scss"
import cn from "classnames";

export default function Sound({ soundcloudUrl }) {
	const embedUrl = `https://w.soundcloud.com/player/?url=${soundcloudUrl}&amp;color=ff6600&amp;auto_play=false&amp;show_artwork=true`
	return (
		<div className={styles.sound}>
			<iframe
				src={embedUrl}
				width="100%"
				height="auto"
				scrolling="no"
				frameBorder="no"
			/>
		</div>
	);
}