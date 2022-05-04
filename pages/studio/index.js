import styles from './Studio.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Content from '/components/Content';
import Markdown from '/lib/dato/components/Markdown';
import { motion } from 'framer-motion'

export default function Studio({about : {email, phone, description, background, clients}}){	

	return (
		<motion.div initial={{translateY:'100%'}} animate={{translateY:['100%', '0%']}} exit={{translateY:'-100%'}} transition={{duration:1}}>
			<Content className={styles.container}>
				<p>
				{email}<br/>
				{phone}
				</p>
				<p>
					<Markdown>{description}</Markdown>
				</p>
				<p>
					
					<Markdown>{background}</Markdown>
				</p>
				<p>
					<ul>
					{clients.map(({name}, idx) => 
						<li key={idx}>{name}</li>
					)}
					</ul>
				</p>
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