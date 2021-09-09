import React from 'react'

import { Auth } from 'aws-amplify'
import '../configureAmplify'

import requiresNotBeAuthenticated from '../src/requiresNotBeAuthenticated'

const LoginOAuth = () => {

    return (
        <div>
            <h1> Logeate con OAuth </h1>
            <button onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}> Sign in with Google </button>
            <button onClick={() => { Auth.federatedSignIn({ provider: "SignInWithApple" }) }}> Sign in with Apple </button>
        </div>
    )

}

export const getServerSideProps = requiresNotBeAuthenticated(() => {
    return {
        props: {}
    }
});

export default LoginOAuth;
