import nookies from 'nookies'

const checkIfItIsAuthenticated = (gssp) => {
    return async (context) => {
        const cookies = nookies.get(context)
        console.log("ENTRO-check")

        if (cookies.accessTokenJWT) {
            return await gssp({ context, cookies }); // Continue on to call `getServerSideProps` logic
        } else {
            return await gssp({ context }); // Continue on to call `getServerSideProps` logic
        }
    }
}

export default checkIfItIsAuthenticated;