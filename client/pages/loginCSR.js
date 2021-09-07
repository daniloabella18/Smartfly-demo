import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'
import '../configureAmplify'

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
    return (
        <div>
            {!user ?
                <div>
                    <h1> CSR Not Authenticated </h1>
                    <button onClick={() => { Auth.federatedSignIn({ provider: "Google" }) }}> Sign in with Google </button>
                </div>
                :
                <div>
                    <h1> CSR Hello {user.username} from SSR route!! </h1>
                    <button onClick={() => { Auth.signOut(); }}> Logout </button>
                </div>
            }
        </div>
    )
}

export default Profile;
