"use client";
import React from "react";
import Image from "next/image";
import Button from "@/app/components/buttons/button";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login");
  };
  return (
    <div className="container flex flex-row justify-around items-center p-6">
      <div className="flex flex-col items-center">
        <Image src={`/images/logo.png`} alt="logo" width={600} height={600} />
        <h1 className="text-3xl font-medium">
          Feeding Efficiency, one byte at a time!
        </h1>
      </div>

      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-4xl font-medium text-blue-900">
            Welcome <span className="text-blue-400">to MealMinder!</span>
          </h1>
          <p className="pl-2">Create an account to begin your journey </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form action="" className="flex flex-col gap-2 w-96">
            <label htmlFor="" className="font-medium pl-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
            />
            <label htmlFor="email" className="font-medium pl-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
            />
            <label htmlFor="password" className="font-medium pl-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-6"
            />
            <a
              href=""
              className="text-red-900 hover:text-red-600 self-center"
              onClick={handleLoginClick}
            >
              Login
            </a>
            <Button title="Register" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
