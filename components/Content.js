import styles from './Content.module.scss'
import cn from 'classnames'

export default function Content({children, className, id}){

	return (
		<main id={id} className={cn(styles.content, className && className)}>
      {children}
		</main>
	)
}