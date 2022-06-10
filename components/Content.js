import styles from './Content.module.scss'
import cn from 'classnames'
import { use100vh } from 'react-div-100vh'

export default function Content({children, className, id}){
	const height = use100vh()

	return (
		<main id={id} className={cn(styles.content, className && className)} style={{maxHeight:height}}>
      {children}
		</main>
	)
}