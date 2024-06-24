"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../../components/buttons/button";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/modal/Modal";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLoginClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/login",
        formData
      );
      console.log(response);
      if (response.status === 201) {
        alert("Login Successfully");
      }
    } catch (error: any) {
      console.log(error.message);
      alert("Invalid Credentials");
      return error;
    }
  };

  const handleRegisterClick = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    router.push("/registration");
  };

  const handleForgotPasswordClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password" className="font-medium pl-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-6"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button title="Login" onClick={handleLoginClick} />
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

      <Modal isVisible={isModalVisible} onClose={closeModal}>
        <h2 className="text-lg mb-2 font-medium">Forgot Password</h2>
        <p className="text-sm mb-6 text-gray-500">
          Please enter your email to reset your password.
        </p>
        <label htmlFor="" className="text-sm font-medium">
          Your Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
        />
        <Button title="Submit" />
      </Modal>
    </div>
  );
};

export default Login;
