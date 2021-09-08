import { useState, React } from 'react'

import { withSSRContext } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import '../configureAmplify'

import nookies, { destroyCookie } from 'nookies'

import { useRouter } from 'next/router'

const Login = (props) => {
    // Home
    const router = useRouter()

    // Logeo
    const [username, setUsername] =  useState('')
    const [password, setPassword] = useState('')
    const [userInfo, setUserInfo] = useState(props.user ? props.user : null)

    // Logeo
    async function signIn() {
        try {
            const userSignIn = await Auth.signIn(username, password);
            console.log("userSignIn: ", userSignIn)
            setUserInfo(userSignIn)
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    const DestroyCookies = async () => {

        destroyCookie(null, 'accessTokenJWT');
        destroyCookie(null, 'idTokenJWT');
        destroyCookie(null, 'username');

        try {
            await Auth.signOut();
            router.push('/')
        }catch(err){
            console.log("err: ", err)
        }

    }

    console.log("props: ", props)
    console.log("userInfo: ", userInfo)

    return (
        <div>
            {!userInfo ?
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
                :
                <div>
                    <h2> Hello {userInfo ? userInfo.username : userInfo.username }!! </h2>
                    <button onClick={() => { DestroyCookies() }}> Logout </button>
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

export default Login
