"use client";
import { AuthProvider } from "./app/utils/authContext";
import type { AppProps } from "next/app";
import { GroceryProvider } from "./context/GroceryContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GroceryProvider>
        <Component {...pageProps} />
      </GroceryProvider>
    </AuthProvider>
  );
}

export default MyApp;
