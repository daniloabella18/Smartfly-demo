import React from 'react'

function apiServelerss(props) {
    return (
        <div>
            Hola
        </div>
    )
}

export async function getServerSideProps(context) {

  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data
    }, // will be passed to the page component as props
  }
}
export default apiServelerss
