import { useState, React } from 'react'

import { Auth } from 'aws-amplify'
import '../configureAmplify'

import { useRouter } from 'next/router'

import requiresNotBeAuthenticated from '../src/requiresNotBeAuthenticated'

const Login = () => {
    // Home
    const router = useRouter()

    // Logeo
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Logeo
    async function signIn() {
        try {
            const userSignIn = await Auth.signIn(username, password);
            console.log("userSignIn: ", userSignIn)
            router.push('/')
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    return (
        <div>
            <h2> Login </h2>
            <label htmlFor="usu_name"> Nombre </label><br />
            <input type="text" id="usu_name" name="usu_name" value={username} onChange={(event) => { setUsername(event.target.value) }} />
            <br />
            <label htmlFor="password"> Password </label><br />
            <input type="password" id="password" name="password" value={password} onChange={(event) => { setPassword(event.target.value) }} />
            <br />
            <button onClick={() => { signIn() }}> SignIn </button>
        </div>
    )

}

export const getServerSideProps = requiresNotBeAuthenticated(() => {
    return {
        props: {}
    }
});

export default Login
