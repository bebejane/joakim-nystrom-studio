import styles from './Studio.module.scss'
import cn from 'classnames'
import Content from '/components/Content';
import Markdown from '/lib/dato/components/Markdown';

export default function Studio({ studio: { email, phone, description, address, postal, background, clients }, show, revRoute }) {

	return (
		<Content className={styles.studio}>
			<aside>
				<h2>Contact</h2>
				<p>
					{email}<br />
					{phone}<br />
					<h2>Studio</h2>
					{address}<br />
					{postal}
				</p>
			</aside>
			<article>
				<Markdown>{description}</Markdown>
				<h2>Clients</h2>
				<ul>
					{clients.map(({ name }, idx) =>
						<li key={idx}>{name}</li>
					)}
				</ul>
				<h2>Photo credit</h2>
				<Markdown>{background}</Markdown>

			</article>
		</Content>
	)
}
