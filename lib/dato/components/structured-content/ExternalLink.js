import styles from "./ExternalLink.module.scss"
import cn from "classnames";

export default function ExternmalLink({ linkText, url }) {
	return (
		<a href={url} className={styles.externalLink}>
			{linkText}
		</a>
	);
}