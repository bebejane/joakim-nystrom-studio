import styles from './Studio.module.scss'
import Content from '/components/Content';
import Artwork from '/components/Artwork';
import Markdown from '/lib/dato/components/Markdown';
import useStore from '/store';
import shallow from 'zustand/shallow'

export default function Studio({ artwork, studio: { email, phone, description, address, postal, background, clients }, show, revRoute }) {

	const [galleryIndex, setGalleryIndex] = useStore((state) => [state.galleryIndex, state.setGalleryIndex], shallow)

	return (
		<>
			<Content className={styles.studio}>
				<aside>
					<h2>Contact</h2>
					<p>
						<a href={`mailto:${email}`}>{email}</a><br />
						{phone}<br />
						<h2>Studio</h2>
						{address}<br />
						{postal}
					</p>
				</aside>
				<article>
					<h2>About</h2>
					<Markdown>{description}</Markdown>
					<h2>Clients</h2>
					<ul>
						{clients.sort((a, b) => a.name > b.name ? 1 : -1).map(({ name }, idx) =>
							<li key={idx}>{name}</li>
						)}
					</ul>
					<h2>Photo credit</h2>
					<Markdown>{background}</Markdown>
					<h2>Website credit</h2>
					<p>Designed and developed by <a href="http://www.konst-teknik.se">Konst & Teknik</a>.</p>
					<hr />
					<h2>Paintings</h2>
					<Artwork
						artwork={artwork}
						onIndexChange={setGalleryIndex}
					/>
				</article>

			</Content>

		</>
	)
}
