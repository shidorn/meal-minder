"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/buttons/button";
import Modal from "@/app/components/modal/Modal";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [isCodeVerificationModalVisible, setCodeVerificationModalVisible] =
    useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/registration");
  };

  const handleForgotPasswordClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setForgotPasswordModalVisible(true);
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalVisible(false);
  };

  const closeCodeVerificationModal = () => {
    setCodeVerificationModalVisible(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleForgotPasswordSubmit = async () => {
    // Typically, send the email to the backend here
    setForgotPasswordModalVisible(false);
    setCodeVerificationModalVisible(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleCodeVerificationSubmit = async () => {
    // Typically, verify the code with the backend here
    const isValid = true;

    if (isValid) {
      setCodeVerificationModalVisible(false);
      router.push("/reset-password");
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  return (
    <div className="container flex flex-row justify-around items-center p-6">
      {/* left side */}
      <div className="flex flex-col items-center">
        <Image src={`/images/logo.png`} alt="logo" width={600} height={600} />
        <h1 className="text-3xl font-medium">
          Feeding Efficiency, one byte at a time!
        </h1>
      </div>

      {/* right side */}
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-4xl font-medium text-blue-900">
            Welcome <span className="text-blue-400">Back!</span>
          </h1>
          <p className="pl-2">Login to get started</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form action="" className="flex flex-col gap-2 w-96">
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
            <Button title="Login" />
            <a
              href=""
              className="text-red-900 hover:text-red-600 self-center"
              onClick={handleRegisterClick}
            >
              Register
            </a>
          </form>

          <div className="self-start pt-10">
            <a
              href=""
              className="pl-60 text-blue-400 hover:text-blue-500"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password
            </a>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isVisible={isForgotPasswordModalVisible}
        onClose={closeForgotPasswordModal}
      >
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <p className="mb-4 text-sm">Enter your email to reset your password.</p>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
        />
        <Button title="Submit" onClick={handleForgotPasswordSubmit} />
      </Modal>

      {/* Code Verification Modal */}
      <Modal
        isVisible={isCodeVerificationModalVisible}
        onClose={closeCodeVerificationModal}
      >
        <h2 className="text-2xl mb-4">Enter Verification Code</h2>
        <p className="mb-4 text-sm">
          We have sent a verification code to {email}. Please enter the code
          below.
        </p>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter your verification code"
          className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
        />
        <Button title="Verify Code" onClick={handleCodeVerificationSubmit} />
      </Modal>
    </div>
  );
};

export default Login;
