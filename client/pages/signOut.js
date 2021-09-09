import React from 'react'
import { Auth } from 'aws-amplify'
import '../configureAmplify'

import { destroyCookie } from 'nookies'

import { useRouter } from 'next/router'

import requiresToBeAuthenticated from '../src/requiresToBeAuthenticated'

const SignOut = ({ user }) => {
    // Home
    const router = useRouter()

    const DestroyCookies = async () => {

        destroyCookie(null, 'accessTokenJWT');
        destroyCookie(null, 'idTokenJWT');
        destroyCookie(null, 'username');

        try {
            await Auth.signOut();
            router.push('/')
        } catch (err) {
            console.log("err: ", err)
        }
    }

    return (
        <div>
            <h1> SSR Hello {user.username} from SSR route!! </h1>
            <button onClick={() => { DestroyCookies() }}> SignOut </button>
        </div>
    )

}

export const getServerSideProps = requiresToBeAuthenticated(({ cookies }) => {
    const { accessTokenJWT, idTokenJWT, username } = cookies
    return {
        props: {
            user: {
                accessTokenJWT, idTokenJWT, username,
            }
        }
    }
})

export default SignOut;
