import React from 'react'
import { withSSRContext } from 'aws-amplify'
import './../configureAmplify'

import nookies from 'nookies'

const Profile = (props) => {

    console.log("props: ", props)

    return (
        <div>
            {!props.authenticated ?
                <div>
                    <h1>Not Authenticated</h1>
                </div>
                :
                <div>
                    <h1> Hello {props.user.username} from SSR route!! </h1>
                </div>
            }
        </div>
    )

}

export async function getServerSideProps(context) {

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
                httpOnly: true,
                path: '/',
            });

            nookies.set(context, 'idTokenJWT', idTokenJWT, {
                maxAge: 86400,
                httpOnly: true,
                path: '/',
            });

            nookies.set(context, 'username', username, {
                maxAge: 86400,
                httpOnly: true,
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
