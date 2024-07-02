"use client";
import { ReactNode } from "react";
import { UserProvider } from "@/context/UserProvider";
import { GroceryProvider } from "@/context/GroceryContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <GroceryProvider>{children}</GroceryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
