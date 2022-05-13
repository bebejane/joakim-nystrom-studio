import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import useStore from "/store";
import { useRouter } from "next/router";

export default function Menu({ }) {

	const router = useRouter()
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const isIndexPage = router.asPath === '/'
	
	const WrapLink = ({href, type, children}) => {
		const content = (
			<a 
				onClick={() => isIndexPage && setActive(active)} href={!isIndexPage ? href : undefined} 
				className={cn(active === type && styles.selected)}
			>
				{children}
			</a>
		)
		return !isIndexPage ? <Link href={href}>{content}</Link> : content
	}

	return (
		<menu id="menu" className={cn(styles.menu, !showMenu && styles.hideNav)}>
			<div className={styles.logo}>
				<WrapLink href="/" type="gallery">
					Joakim Nyström Studio
				</WrapLink>
			</div>
			<nav className={styles.nav}>
				<ul>
					<WrapLink href="/artwork" type="artwork">
						<li>Artwork</li>
					</WrapLink>
					<WrapLink href="/studio" type="studio">
						<li>Studio</li>
					</WrapLink>
				</ul>
			</nav>			
		</menu>
	);
}
