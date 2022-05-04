import styles from './Studio.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Content from '/components/Content';
import Markdown from '/lib/dato/components/Markdown';
import { motion } from 'framer-motion'

export default function Studio({about : {email, phone, description, background, clients}}){	

	return (
		<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
			<Content className={styles.container}>
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
		</motion.div>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAbout]}, async ({props, revalidate }) => {
	
	return {
		props:{
			...props,
		},
		revalidate
	};
});