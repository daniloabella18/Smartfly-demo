import '../styles/globals.css'
import Link from 'next/link'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className="py-4 px-12 flex border-b border-gray-300">
        <Link href="/">
          <a>
            <p>Home</p>
          </a>
        </Link>
        <Link href="/profile">
          <a>
            <p>Profile</p>
          </a>
        </Link>
        <Link href="/apiServerless">
          <a>
            <p>apiServerless</p>
          </a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp