import { useState, React } from 'react'

import { Auth } from 'aws-amplify'
import './../configureAmplify'

import requiresNotBeAuthenticated from '../src/requiresNotBeAuthenticated'

const Register = () => {
    // Registro
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // Verificar
    const [usernameVerif, setUsernameVerif] = useState('')
    const [codeVerif, setCodeVerif] = useState('')

    // Registro
    async function signUp() {

        try {
            const { user } = await Auth.signUp({
                username,
                password,
                attributes: {
                    email,
                }
            });
            console.log(user);
        } catch (error) {
            console.log('error signing up:', error);
        }

    }

    // Verificar código
    async function confirmSignUp() {
        try {
            const verification = await Auth.confirmSignUp(usernameVerif, codeVerif);
            console.log("verification: ", verification)
        } catch (error) {
            console.log('error confirming sign up', error);
        }
    }

    return (
        <div>
            <h2> Registro </h2>

            <label htmlFor="usu_name"> Nombre </label><br />
            <input type="text" id="usu_name" name="usu_name" value={username} onChange={(event) => { setUsername(event.target.value) }} />
            <br />
            <label htmlFor="usu_name"> Email </label><br />
            <input type="text" id="email" name="email" value={email} onChange={(event) => { setEmail(event.target.value) }} />
            <br />
            <label htmlFor="password"> Password </label><br />
            <input type="password" id="password" name="password" value={password} onChange={(event) => { setPassword(event.target.value) }} />
            <br />
            <button onClick={() => { signUp() }}> Register </button>

            <h2> Verificar </h2>

            <label htmlFor="usu_name_verif"> Nombre </label><br />
            <input type="text" id="usu_name_verif" name="usu_name_verif" value={usernameVerif} onChange={(event) => { setUsernameVerif(event.target.value) }} />
            <br />
            <label htmlFor="code_verif"> Código </label><br />
            <input type="text" id="code_verif" name="code_verif" value={codeVerif} onChange={(event) => { setCodeVerif(event.target.value) }} />
            <br />
            <button onClick={() => { confirmSignUp() }}> Confirmar </button>
        </div>
    )

}

export const getServerSideProps = requiresNotBeAuthenticated(() => {
    return {
        props: {}
    }
});

export default Register
