import styles from './Studio.module.scss'
import cn from 'classnames'
import Content from '/components/Content';
import Markdown from '/lib/dato/components/Markdown';

export default function Studio({studio: {email, phone, description, background, clients}, show, revRoute}){	
	
	return (
		<Content className={cn(styles.studio, show && styles.show)}>
			<p>
			{email}<br/>
			{phone}
			</p>
			<Markdown>{description}</Markdown>
			<Markdown>{background}</Markdown>
				<ul>
				{clients.map(({name}, idx) => 
					<li key={idx}>{name}</li>
				)}
				</ul>
		</Content>
	)
}
