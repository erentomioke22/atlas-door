import Link from 'next/link';

const Custom404 = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/">
        <a>Go back to Home</a>
      </Link>
    </div>
  );
};

Custom404.displayName = 'Custom404';

export default Custom404;


  