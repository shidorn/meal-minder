import { useEffect } from "react";
import { AppProps } from "next/app";
import { checkTokenExpiration, setupTokenExpirationCheck } from "../auth";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Check token expiration on initial load
    checkTokenExpiration().catch(console.error);

    // Set up periodic token expiration check
    setupTokenExpirationCheck();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
