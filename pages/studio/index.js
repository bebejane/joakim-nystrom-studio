import styles from './Studio.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';
import Content from '/components/Content';
import Markdown from '/lib/dato/components/Markdown';

export default function Studio({about : {email, phone, description, background, clients}}){	

	return (
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