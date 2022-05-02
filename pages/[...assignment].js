import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { apiQuery } from '/lib/dato/api';
import { GetAllAssignments, GetAssignment } from '/graphql';
import { Image } from 'react-datocms';
import Content from '/components/Content';

export default function Assignment({assignment:{ title, description, images, slug, open, assignmentTypes}}){
	
	return (
		<Content className={styles.assignment}>
			<h1>{title}</h1>
      <p>{description}</p>
      {images.map((image, idx)=>
        image.responsiveImage && <Image key={idx} data={image.responsiveImage}/>
      )}
      <br/>
      {assignmentTypes.map(t => t.value).join(', ')}
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

export const getStaticProps = withGlobalProps({mode:'assignment'}, async ({props, context, revalidate }) => {
  const { assignment } = await apiQuery(GetAssignment, {slug:context.params.assignment[0]})
	
  if(!assignment) return { notFound:true}

  return {
		props :{
      ...props,
			assignment
    },
		revalidate
	};
});