import nookies from 'nookies'

const requireAuthentication = (gssp) => {
    return async (context) => {
        const cookies = nookies.get(context)
        console.log("ENTRO-be")

        if (cookies.accessTokenJWT) {
            return await gssp({ context, cookies }); // Continue on to call `getServerSideProps` logic
        } else {
            return {
                redirect: {
                    destination: '/', // Redirect to login page
                    statusCode: 302,
                }
            };
        }
    }
}

export default requireAuthentication;