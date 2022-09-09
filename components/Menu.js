import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import useStore from "/lib/store";
import { useRouter } from "next/router";

export default function Menu({ }) {

	const router = useRouter()
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const isIndexPage = router.asPath === '/'

	const WrapLink = ({ href, type, children }) => {
		const content = (
			<a onClick={() => setActive(type)} className={cn(active === type && styles.selected)}>
				{children}
			</a>
		)
		return !isIndexPage ? <Link href={href}>{content}</Link> : content
	}

	return (
		<menu id="menu" className={cn(styles.menu, !showMenu && styles.hideNav, active === 'studio' && styles.reverted)}>
			<div className={styles.logo}>
				<WrapLink href="/" type="gallery">
					Joakim Nyström Studio
				</WrapLink>
			</div>
			<nav className={styles.nav}>
				<ul>
					<WrapLink href="/studio" type="studio">
						<li>About</li>
					</WrapLink>
				</ul>
			</nav>
		</menu>
	);
}
