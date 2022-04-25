import Link from 'next/link'

export default function FourOhFour() {
  return (
    <div id="error-404">
      <h1>404 - Page Not Found</h1>
      <Link prefetch={false} href="/">
        <a>
          Go back home
        </a>
      </Link>
    </div>
  )
}