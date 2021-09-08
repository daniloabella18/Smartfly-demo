import React from 'react'
import { Auth, withSSRContext } from 'aws-amplify'
import '../configureAmplify'

import nookies, { destroyCookie } from 'nookies'

const Profile = (props) => {

    const DestroyCookies = () => {

        destroyCookie(null, 'accessTokenJWT');
        destroyCookie(null, 'idTokenJWT');
        destroyCookie(null, 'username');

        Auth.signOut();
    }

    console.log("props: ", props)

    return (
        <div>
            {!props.authenticated ?
                <div>
                    <h1> SSR Not Authenticated </h1>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}> Sign in with Google </button>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "SignInWithApple" }) }}> Sign in with Apple </button>
                </div>
                :
                <div>
                    <h1> SSR Hello {props.user.username} from SSR route!! </h1>
                    <button onClick={() => { DestroyCookies() }}> Logout </button>
                </div>
            }
        </div>
    )

}

export const getServerSideProps = async (context) => {

    const cookies = nookies.get(context)

    if (cookies.accessTokenJWT) {
        return {
            props: {
                withCookies: true,
                authenticated: true,
                user: {
                    accessTokenJWT: cookies.accessTokenJWT,
                    idTokenJWT: cookies.idTokenJWT,
                    username: cookies.username,
                }
            }
        }
    } else {

        const Auth = await withSSRContext(context).Auth

        try {
            const user = await Auth.currentAuthenticatedUser();

            const accessTokenJWT = await user.signInUserSession.accessToken.jwtToken
            const idTokenJWT = await user.signInUserSession.idToken.jwtToken
            const username = await user.username

            nookies.set(context, 'accessTokenJWT', accessTokenJWT, {
                maxAge: 86400,
                //httpOnly: true,
                path: '/',
            });

            nookies.set(context, 'idTokenJWT', idTokenJWT, {
                maxAge: 86400,
                //httpOnly: true,
                path: '/',
            });

            nookies.set(context, 'username', username, {
                maxAge: 86400,
                //httpOnly: true,
                path: '/',
            });

            console.log("user: ", user)
            return {
                props: {
                    withCookies: false,
                    authenticated: true,
                    user: {
                        accessTokenJWT,
                        idTokenJWT,
                        username,
                    }
                }
            }
        } catch (err) {
            return {
                props: {
                    withCookies: false,
                    authenticated: false
                }
            }
        }
    }

}

export default Profile
