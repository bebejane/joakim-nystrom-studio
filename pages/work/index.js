import styles from './Work.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';

export default function Work(props){	

	return (
		<div className={styles.container}>
      work
		</div>
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