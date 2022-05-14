import { withGlobalProps } from "/lib/hoc";
import { apiQuery } from '/lib/dato/api';
import { GetAssignment, GetAllAssignments } from '/graphql';

import Start from './';

export default Start;

export async function getStaticPaths(context) {
  const { assignments } = await apiQuery(GetAllAssignments)
	const paths = assignments.map(({slug}) => ({params:{slug:[slug]}}))
	paths.push({params:{slug:['artwork']}})
	paths.push({params:{slug:['studio']}})

	return {
		paths,
		fallback: 'blocking'
	}
}

export const getStaticProps = withGlobalProps(async ({props, context, revalidate }) => {
	const { assignment } = await apiQuery(GetAssignment, {slug:context.params.slug[0]})

	return {
		props:{
			...props,
			assignment,
			slug:`/${context.params.slug[0]}`
		},
		revalidate
	};
});