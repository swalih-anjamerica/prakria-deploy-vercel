import Link from 'next/link'
import React from 'react'

function NotFoundPage() {
  return (
    <div className='flex flex-col h-screen justify-center items-center'>
      <div className="flex flex-col items-center ">
        <img
          className="h-18 mx-auto"
          src="/notFound.png"
          alt="Prakria Logo	"
          width="400"
          height="600"
        />
        <span>Sorry! This Page Couldn&apos;t be found</span>
        <Link passHref href={"/"}><button className='my-10 bg-primary-yellow px-3 py-1 rounded-md hover:opacity-70'>Home</button></Link>
      </div>
    </div>
  )
}

export default NotFoundPage

NotFoundPage.getLayout = ({ children }) => {
  return (
    <>
      {
        children
      }
    </>
  )
}