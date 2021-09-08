import { useState, React } from 'react'
import { withSSRContext } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import './../configureAmplify'

import nookies from 'nookies'

const Register = (props) => {
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
            {!props.authenticated ?
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
                :
                <div>
                    <h2> Hello {props.user.username}!! </h2>
                    <h2> Tienes que desloguearte para poder registrar un usuario </h2>
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
                //httpOnly: true,
                path: '/',
            });

            nookies.set(context, 'idTokenJWT', idTokenJWT, {
                maxAge: 86400,
                //httpOnly: true,
                path: '/',
            });

            nookies.set(context, 'username', username, {
                maxAge: 86400,
                //httpOnly: true,
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

export default Register
