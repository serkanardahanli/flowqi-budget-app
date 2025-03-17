// src/pages/_app.js
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  // Voorkom hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Als de app nog niet gemount is, geef dan niets terug
  if (!mounted) {
    return null;
  }

  return <Component {...pageProps} />;
}

export default MyApp;