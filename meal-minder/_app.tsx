"use client";
import type { AppProps } from "next/app";
import { UserProvider } from "./context/UserProvider";
import { GroceryProvider } from "./context/GroceryContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <GroceryProvider>
      <Component {...pageProps} />
      </GroceryProvider>
    </UserProvider>
  );
}

export default MyApp;
