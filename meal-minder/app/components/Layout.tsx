import React, { ReactNode } from "react";
import Sidebar from "./sidebar/page";

import Header from "./header/header";
import { AuthProvider } from "../utils/authContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar />

        <div className="flex flex-col flex-1 ml-64 ">
          <Header />

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Layout;
