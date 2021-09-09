import nookies from 'nookies'

const requiresNotBeAuthenticated = (gssp) => {
    return async (context) => {
        const cookies = nookies.get(context)
        console.log("ENTRO-notbe")

        if (!cookies.accessTokenJWT) {
            return await gssp({ context }); // Continue on to call `getServerSideProps` logic
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

export default requiresNotBeAuthenticated;