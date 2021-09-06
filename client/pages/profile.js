import { useLayoutEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import '../configureAmplify'

function Profile(props) {
    let [user, setUser] = useState(false)

    useLayoutEffect(() => {
        checkUser()
        async function checkUser() {
            await Auth.currentAuthenticatedUser()
                .then((res) => setUser(res))
                .catch((err) => setUser(false))
        }
    }, [])

    console.log(user)
    console.log(props.token)

    return (
        <div>
            {user ?
                <button
                    onClick={() => { Auth.signOut(); }}
                >
                    Logout
                </button>
                :
                <button
                    onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}
                >
                    Sign in with Google
                </button>
            }
        </div>
    )
}

export async function getServerSideProps(params) {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library

    const token = await params.req.cookies["cognito"];

    return {
        props: {
            token: token ? token : null,
        },
    }
}

export default Profile