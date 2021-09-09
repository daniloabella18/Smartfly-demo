import { useState, React } from "react";
import { withSSRContext } from "aws-amplify";
import { Auth } from "aws-amplify";
import "./../configureAmplify";

import nookies from "nookies";

const Register = (props) => {
  // Registro
  const [newPassword, setNewPassword] = useState("");
  // Verificar
  const [code, setCode] = useState("");

  // Send confirmation code to user's email
  const forgotPassword = async () => {
    try {
      const emailSended = await Auth.forgotPassword(props.user.username);
      console.log("emailSended: ", emailSended);
    } catch (error) {
      console.log("error sending email", error);
    }
  }

  // Collect confirmation code and new password, then
  const changePassword = async () => {
    try {
      const passSubmit = await Auth.forgotPasswordSubmit(
        props.user.username,
        code,
        newPassword,
      );
      console.log("passSubmit: ", passSubmit);
    } catch (error) {
      console.log("error submiting pass", error);
    }
  }

  return (
    <div>
      {!props.authenticated ?
        <div>
          <h2> Tienes que loguearte para poder cambiar de contraseña </h2>
        </div>
        :
        <div>
          <h2> Pedir cambio de contraseña </h2>
          <button onClick={() => { forgotPassword() }}> Olvidé mi contraseña </button>
          <h2> Cambiar contraseña </h2>

          <br />
          <label htmlFor="new_password"> New Password </label><br />
          <input type="password" id="new_password" name="new_password" value={newPassword} onChange={(event) => { setNewPassword(event.target.value) }} />
          <br />
          <label htmlFor="code_verif"> Código </label><br />
          <input type="text" id="code_verif" name="code_verif" value={code} onChange={(event) => { setCode(event.target.value) }} />
          <br />
          <button onClick={() => { changePassword() }}> Cambiar contraseña </button>
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
