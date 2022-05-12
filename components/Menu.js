import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import useStore from "/store";
import usePreviousRoute from "/lib/hooks/usePreviousRoute";

export default function Menu({ }) {

	const showMenu = useStore((state) => state.showMenu)
	const setShowMenu = useStore((state) => state.setShowMenu)
	const setActive = useStore((state) => state.setActive)
	
	return (
		<menu id="menu" className={cn(styles.menu, !showMenu && styles.hideNav)}>
			<div className={styles.logo}>
				<Link href="/">
					<a onClick={() => setActive('gallery')}>Joakim Nyström Studio</a>
				</Link>
			</div>
			<nav className={styles.nav}>
				<ul>
					<a onClick={()=>setActive('artwork')}>
						<li>Artwork</li>
					</a>
					<Link href="/studio">
						<a>
							<li>Studio</li>
						</a>
					</Link>
				</ul>
			</nav>
			<div className={cn(styles.close, !showMenu && styles.show)} onClick={() => window.history.back()}>Back</div>
		</menu>
	);
}
