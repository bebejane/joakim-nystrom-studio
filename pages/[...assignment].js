import styles from './Assignment.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { apiQuery } from '/lib/dato/api';
import { GetAllAssignments, GetAssignment } from '/graphql';
import Content from '/components/Content';
import Gallery from '/components/Gallery';

export default function Assignment({assignment, slides}){
	
	return (
		<Content className={styles.assignment}>
			<Gallery slides={slides} active={true} caption={assignment.title}/>
		</Content>
	)
}
/*
export const getStaticProps = withGlobalProps({model:'assignment'}, async ({props, context, revalidate }) => {
  const { assignment } = await apiQuery(GetAssignment, {slug:context.params.assignment[0]})
  if(!assignment) return { notFound:true}

	const slides = assignment.images.map((slide) => ({
		...slide,
		image:slide,
		type: slide.text ? 'text' : slide.images?.[0].mimeType.startsWith('video') ? 'video' : 'image',
	}))

  return {
		props :{
      ...props,
			assignment,
			slides,
			backgroundImage:assignment.images[0]
    },
		revalidate
	};
});
*/
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
	const slides = assignment.images.map((image) => ({
		image,
		type:'image',
		slug: assignment.slug
	}))
	
	
	return {
		props:{
			seo:props.seo,
			slides,
			assignment
		},
		revalidate
	};
});