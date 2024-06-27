import React, { ReactNode } from "react";
import Sidebar from "./sidebar/page";
import { UserProvider } from "../../context/UserProvider";
import Header from "./header/header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <UserProvider>
      <div className="flex h-full w-full bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
};

export default Layout;
