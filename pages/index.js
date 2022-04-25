import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";
import { GetAllAssignments} from '/graphql'
import Link from 'next/link';
import { Image } from 'react-datocms';
import { useState, useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

export default function Start({assignments}){	

	const [index, setIndex] = useState(0)

	const back = () => setIndex(index > 0 ? index-1 : 0)
	const forward = () => setIndex(index+1 < assignments.length ? index+1 : index)

	const scrollTo = (index, behavior = 'smooth') => {
		const container = document.getElementById('container');
		const slide = document.getElementById(`slide-${index}`)
		const padding = (container.clientWidth*0.2)/2
		container.scrollTo({left: slide.offsetLeft - padding, behavior});
	}

	useEffect(()=>{ smoothscroll.polyfill(); scrollTo(index, 'instant')}, [])
	useEffect(()=>scrollTo(index), [index])
	useEffect(()=>{
		const handleKeyDown = ({key}) => key === 'ArrowRight' ?  forward() : key === 'ArrowLeft' ? back() : null
		window.removeEventListener('keydown', handleKeyDown)
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [index])
	
	return (
		<main id="container" className={styles.container}>
			<ul>
				<li id={`slide-start`}>
					<Image data={assignments[assignments.length-1].images[0].responsiveImage} className={styles.image}/>
				</li>
				{assignments.map(({title, slug, images}, idx) => 
					<li key={idx} id={`slide-${idx}`}>
						<Image data={images[0].responsiveImage} className={styles.image}/>
						<span className={styles.title}>
							<Link href={`/${slug}`}>
								<a>{title}</a>
							</Link>
						</span>
					</li>
				)}
				<li id={`slide-end`}>
					<Image data={assignments[0].images[0].responsiveImage} className={styles.image}/>
				</li>
			</ul>
			<div className={styles.nav}>
				<div className={styles.back} onClick={back}></div>
				<div className={styles.forward} onClick={forward}></div>
			</div>
		</main>
	)
}

export const getStaticProps = withGlobalProps({queries:[GetAllAssignments]}, async ({props, revalidate }) => {

	return {
		props:{
			...props,
		},
		revalidate
	};
});