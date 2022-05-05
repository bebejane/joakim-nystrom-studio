import styles from './Assignment.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { apiQuery } from '/lib/dato/api';
import { GetAllAssignments, GetAssignment } from '/graphql';
import Content from '/components/Content';
import Gallery from '../components/Gallery';

export default function Assignment({assignment:{ title, description, images, slug, open, assignmentTypes}}){
	
	return (
		<Content className={styles.assignment}>
			<Gallery slides={images.map((image)=> ({image, title:image.title, slug}))}/>
		</Content>
	)
}

export async function getStaticPaths(context) {
  const { assignments } = await apiQuery(GetAllAssignments)
	const paths = assignments.map(({slug}) => ({params:{assignment:[slug]}}))

	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps({model:'assignment'}, async ({props, context, revalidate }) => {
  const { assignment } = await apiQuery(GetAssignment, {slug:context.params.assignment[0]})
  if(!assignment) return { notFound:true}

  return {
		props :{
      ...props,
			assignment,
			backgroundImage:assignment.images[0]
    },
		revalidate
	};
});