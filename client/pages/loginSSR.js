import React from 'react'
import { Auth, withSSRContext } from 'aws-amplify'
import '../configureAmplify'

const Profile = (props) => {

    console.log("user: ", props.user)

    return (
        <div>
            {!props.authenticated ?
                <div>
                    <h1> SSR Not Authenticated </h1>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}> Sign in with Google </button>
                </div>
                :
                <div>
                    <h1> SSR Hello {props.user.username} from SSR route!! </h1>
                    <button onClick={() => { Auth.signOut(); }}> Logout </button>
                </div>
            }
        </div>
    )

}

export const getServerSideProps = async ({ req }) => {

    console.log("UUUUURR")

    const Auth = await withSSRContext({ req }).Auth

    try {
        const user = await Auth.currentAuthenticatedUser();
        console.log("user: ", user)
        return {
            props: {
                authenticated: true,
                user: {
                    atributes: user.attributes,
                    authenticationFlowType: user.authenticationFlowType,
                    pool: user.pool.userPoolId,
                    accessTokenJWT: user.signInUserSession.accessToken.jwtToken,
                    idTokenJWT: user.signInUserSession.idToken.jwtToken,
                    username: user.username,
                }
            }
        }
    } catch (err) {
        return {
            props: {
                authenticated: false
            }
        }
    }

}

export default Profile
