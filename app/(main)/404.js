// pages/404.js

import Link from 'next/link'
import styles from '../styles/NotFound.module.css' // Assuming you have a CSS module for styling

const Custom404 = () => {
  return (
    <div >
      <h1 >Page Not Found</h1>
      <p >
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link href="/">
        <a >Go back to Home</a>
      </Link>
    </div>
  )
}

export default Custom404;

  