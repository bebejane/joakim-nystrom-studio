import styles from './Studio.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Content from '/components/Content';
import Markdown from '/lib/dato/components/Markdown';
import { motion } from 'framer-motion'
import { useRouter } from 'next/router';
import usePreviousRoute from '/lib/hooks/usePreviousRoute';

const duration = 0.4;
const variants =  { 
	fromIndex:{
		opacity:[0, 1],
		transition:{ease:'easeOut', duration}
	},
	fromArtwork:{
		opacity:[0,1],
		transition:{ease:'easeOut', duration}
	},
	toIndex:{
		opacity:0,
		transition:{ease:'easeOut', duration}
	},
	toArtwork:{
		opacity:[1, 0],
		transition:{ease:'easeOut', duration}
	}
}

export default function Studio({about : {email, phone, description, background, clients}}){	

	const router = useRouter()
	const prevRoute = usePreviousRoute()

	return (
		<motion.div 
			animate={prevRoute === '/' ? 'fromIndex' : 'fromArtwork'} 
			exit={router.asPath === '/' ? 'toIndex' : 'toArtwork' }
			variants={variants}
		>
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