// app/layout.tsx or app/_app.tsx
import React from "react";
import type { AppProps } from "next/app";
import Sidebar from "./app/components/sidebar/page";
import "@/styles/globals.css"; // Ensure you have global styles if needed

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
};

export default MyApp;
