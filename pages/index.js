import styles from './index.module.scss'
import { withGlobalProps } from "/lib/hoc";

export default function Start({start, image, color}){
	
	return (
		<div className={styles.container}>
			Joakim Nyström Studio		
		</div>
	)
}

export const getStaticProps = withGlobalProps(async ({props, revalidate }) => {
	
	return {
		props:{
			...props,
		},
		revalidate
	};
});