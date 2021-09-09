import React from 'react'

import requiresToBeAuthenticated from '../src/requiresToBeAuthenticated'

const Profile = ({ user }) => {

    return (
        <div>
            <h1> Hello {user.username} from SSR route!! </h1>
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

export default Profile
