import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'
import '../configureAmplify'

import { destroyCookie } from 'nookies'

import { useRouter } from 'next/router'

function Profile() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then(user => {
                console.log("User: ", user)
                setUser(user)
            })
            .catch(() => setUser(null))
    }, []);

    const DestroyCookies = () => {

        destroyCookie(null, 'accessTokenJWT');
        destroyCookie(null, 'idTokenJWT');
        destroyCookie(null, 'username');

        Auth.signOut();
    }

    return (
        <div>
            {!user ?
                <div>
                    <h1> CSR Not Authenticated </h1>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}> Sign in with Google </button>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "SignInWithApple" }) }}> Sign in with Apple </button>
                </div>
                :
                <div>
                    <h1> CSR Hello {user.username} from SSR route!! </h1>
                    <button onClick={() => { DestroyCookies() }}> Logout </button>
                </div>
            }
        </div>
    )
}

export default Profile;
