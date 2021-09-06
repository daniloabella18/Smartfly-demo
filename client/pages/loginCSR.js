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
            {user && <h1>Welcome, {user.username}</h1>}
            <button onClick={() => { Auth.signOut(); }}> Logout </button>
        </div>
    )
}

export default Profile;
