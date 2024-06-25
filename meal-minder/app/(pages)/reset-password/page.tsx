"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/buttons/button";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const email = searchParam.get("email");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const resetData = {
        email: email,
        newPassword: password,
      };
      console.log(resetData);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/reset-password",
        resetData
      );
      console.log(response);
      if (response.data.message == "Password has been reset successfully") {
        alert("Password has been reset successfully");
        router.push("/login");
      } else {
        alert("Invalid or expired token");
      }
    } catch (error) {
      console.log(error);
      return error;
    }
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
            Reset Your <span className="text-blue-400">Password</span>
          </h1>
          <p className="pl-2">
            Create a new password. Ensure it differs from previous ones <br />{" "}
            for security.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form
            action=""
            className="flex flex-col gap-2 w-96"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="password" className="font-medium pl-2">
              Your New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
              required
            />
            <label htmlFor="confirmPassword" className="font-medium pl-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-6"
              required
            />

            {error && <p className="text-red-500">{error}</p>}

            <Button title="Reset" onClick={handleResetClick} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
