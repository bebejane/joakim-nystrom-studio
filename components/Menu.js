import styles from "./Menu.module.scss";
import Link from "next/link";
import cn from "classnames";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Twirl as Hamburger } from "hamburger-react";

export default function Menu({}) {

	return (
		<menu id="menu" className={styles.menu}>
			<div className={styles.logo}>
        <Link href="/">Joakim Nyström Studio</Link>
      </div>
			<nav className={styles.nav}>
				<ul>
					<Link href="/artwork">
						<a>
							<li>Artwork</li>
						</a>
					</Link>
					<Link href="/studio">
						<a>
							<li>Studio</li>
						</a>
					</Link>
				</ul>
			</nav>
		</menu>
	);
}
