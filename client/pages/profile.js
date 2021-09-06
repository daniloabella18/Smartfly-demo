import React from 'react'
import { withSSRContext } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import './../configureAmplify'

const Profile = (props) => {

    console.log("user: ", props.user)

    return (
        <div>
            {!props.authenticated ?
                <div>
                    <h1>Not Authenticated</h1>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}> Sign in with Google </button>
                </div>
                :
                <div>
                    <h1> Hello {props.user.username} from SSR route!! </h1>
                    <button onClick={() => { Auth.signOut(); }}> Logout </button>
                </div>
            }
        </div>
    )

}

export async function getServerSideProps({ req }) {

    const { Auth } = withSSRContext({ req })

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
