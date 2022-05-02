import styles from './Studio.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';
import Content from '/components/Content';

export default function Studio({about}){	

	return (
		<Content className={styles.container}>
      studio
		</Content>
	)
}

export const getStaticProps = withGlobalProps({queries:[]}, async ({props, revalidate }) => {
	
	return {
		props:{
			...props,
		},
		revalidate
	};
});