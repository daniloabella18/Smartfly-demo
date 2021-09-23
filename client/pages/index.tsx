import { useState, useEffect } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import { GetServerSideProps } from 'next'

import { Auth } from 'aws-amplify'
import '../configureAmplify'

import { setCookie } from 'nookies'

import styles from '../styles/Home.module.css'


const Home = () => {

  const [cargado, setCargado] = useState<any>(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setCargado(false)
    Auth.currentAuthenticatedUser()
      .then(resp => {
        console.log("User: ", resp)
        setCargado(true)
        setUser(resp)

        const accessTokenJWT = resp.signInUserSession.accessToken.jwtToken
        const idTokenJWT = resp.signInUserSession.idToken.jwtToken
        const username = resp.username

        setCookie(null, 'accessTokenJWT', accessTokenJWT, {
          maxAge: 86400,
          //httpOnly: true,
          path: '/',
        });

        setCookie(null, 'idTokenJWT', idTokenJWT, {
          maxAge: 86400,
          //httpOnly: true,
          path: '/',
        });

        setCookie(null, 'username', username, {
          maxAge: 86400,
          //httpOnly: true,
          path: '/',
        });

      })
      .catch((err) => {
        console.log("User: ", err)
        setCargado(true)
      })

  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title> Hola {user ? user.username : 'viajero'} !! </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {<main className={styles.main}>

        <h3 className={styles.title}>
          Smartfly
        </h3>

        <div className={styles.description}>
          <main className={styles.main}>
            {cargado ?
              <p>  Hola {user ? user.username : 'viajero'} !! </p>
              :
              <p> Cargando... </p>
            }
          </main>
        </div>
      </main>
      }

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )

}

export const getServerSideProps: GetServerSideProps = async (context) => {

  return {
    props: {
      number: 1,
    }
  }

}

export default Home;