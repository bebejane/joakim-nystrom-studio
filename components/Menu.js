import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import useStore from "/store";
import usePreviousRoute from "/lib/hooks/usePreviousRoute";

export default function Menu({ }) {
	const showMenu = useStore((state) => state.showMenu)
	const setActive = useStore((state) => state.setActive)
	const active = useStore((state) => state.active)
	const galleryIndex = useStore((state) => state.galleryIndex)
	
	return (
		<menu id="menu" className={cn(styles.menu, !showMenu && styles.hideNav)}>
			<div className={styles.logo}>
				<a onClick={() => setActive('gallery')}>Joakim Nyström Studio</a>
			</div>
			<nav className={styles.nav}>
				<ul>
					<a onClick={()=>setActive('artwork')}>
						<li>Artwork</li>
					</a>
					<a onClick={()=>setActive('studio')}>
						<li>Studio</li>
					</a>				
				</ul>
			</nav>			
		</menu>
	);
}
