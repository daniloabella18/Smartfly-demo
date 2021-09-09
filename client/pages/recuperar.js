import { useState, React } from "react";

import { Auth } from "aws-amplify";
import "./../configureAmplify";

import requiresToBeAuthenticated from '../src/requiresToBeAuthenticated'

const Register = ({ user }) => {
  // Registro
  const [newPassword, setNewPassword] = useState("");
  // Verificar
  const [code, setCode] = useState("");

  // Send confirmation code to user's email
  const forgotPassword = async () => {
    try {
      const emailSended = await Auth.forgotPassword(user.username);
      console.log("emailSended: ", emailSended);
    } catch (error) {
      console.log("error sending email", error);
    }
  }

  // Collect confirmation code and new password, then
  const changePassword = async () => {
    try {
      const passSubmit = await Auth.forgotPasswordSubmit(
        user.username,
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

export default Register;
