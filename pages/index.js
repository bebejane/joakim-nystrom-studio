import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import Content from '/components/Content';
import Gallery from '/components/Gallery';
import { GetAllAssignments } from '/graphql';

export default function Start({assignments}){	
	return (
		<Content id="container" className={styles.container}>
			<Gallery slides={assignments.map(({images, title, slug}) => ({image:images[0], title, slug}))} />
		</Content>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllAssignments]}, async ({props, revalidate }) => {
	return {
		props:{
			...props,
			backgroundImage:props.assignments[0].images[0]
		},
		revalidate
	};
});