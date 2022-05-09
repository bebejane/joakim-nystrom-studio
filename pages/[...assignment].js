import styles from './Assignment.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { apiQuery } from '/lib/dato/api';
import { GetAllAssignments, GetAssignment, GetStart } from '/graphql';
import Content from '/components/Content';
import Gallery from '../components/Gallery';
import Start from './'

export default Start;
/*
export default function Assignment({assignment, slides}){
	
	return (
		<Content className={styles.assignment}>
			<Gallery slides={slides} active={true}/>
		</Content>
	)
}
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


export const getStaticProps = withGlobalProps({queries:[GetStart]}, async ({props, context, revalidate }) => {
	const { assignment } = await apiQuery(GetAssignment, {slug:context.params.assignment[0]})
	const slides = props.start.slides.map((slide) => ({
		...slide,
		type: slide.text ? 'text' : slide.images?.[0].mimeType.startsWith('video') ? 'video' : 'image',
		slug: !slide.link ? slide.slug : slide.link.__typename === 'AboutRecord' ? '/studio' : slide.link.__typename === 'ArtworkRecord' ? '/artwork' : null,
		imageIndex:0
	}))
	
	return {
		props:{
			//seo:props.seo,
			slides,
			assignment
		},
		revalidate
	};
});