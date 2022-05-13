import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import useStore from "/store";
import usePreviousRoute from "/lib/hooks/usePreviousRoute";
import { useRouter } from "next/router";

export default function Menu({ }) {

	const router = useRouter()
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const isIndexPage = router.asPath === '/'

	return (
		<menu id="menu" className={cn(styles.menu, !showMenu && styles.hideNav)}>
			<div className={styles.logo}>
				<a onClick={() => isIndexPage && setActive('gallery')} href={!isIndexPage ? '/' : undefined}>
					Joakim Nyström Studio
				</a>
			</div>
			<nav className={styles.nav}>
				<ul>
					<a onClick={()=>isIndexPage && setActive('artwork')} href={!isIndexPage ? '/artwork' : undefined}>
						<li>Artwork</li>
					</a>
					<a onClick={()=>isIndexPage && setActive('studio')} href={!isIndexPage ? '/studio' : undefined}>
						<li>Studio</li>
					</a>				
				</ul>
			</nav>			
		</menu>
	);
}
