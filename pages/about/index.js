import styles from './About.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAbout } from '/graphql'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';

export default function About({about : { email, phone, description, background, clients }}){	
  return (
		<div className={styles.container}>
      {email}<br/>
      {phone}<br/>
      {description}<br/>
      {background}<br/>
      {clients.map(({name, url}) => name).join(', ')}
		</div>
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