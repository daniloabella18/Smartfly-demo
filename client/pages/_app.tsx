import type { AppProps } from "next/app";
import Link from "next/link";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className="py-4 px-12 flex border-b border-gray-300">
        <Link href="/">
          <a>
            <p> Home </p>
          </a>
        </Link>
        <Link href="/profile">
          <a>
            <p> Profile </p>
          </a>
        </Link>
        <Link href="/loginOAuth">
          <a>
            <p> loginOAuth </p>
          </a>
        </Link>
        <Link href="/register">
          <a>
            <p> register </p>
          </a>
        </Link>
        <Link href="/login">
          <a>
            <p> login </p>
          </a>
        </Link>
        <Link href="/recuperar">
          <a>
            <p> recuperar contraseña </p>
          </a>
        </Link>
        <Link href="/signOut">
          <a>
            <p> signOut </p>
          </a>
        </Link>
        <Link href="/storage">
          <a>
            <p> storage </p>
          </a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
