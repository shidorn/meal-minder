"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/app/components/buttons/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Modal from "@/app/components/modal/Modal";
import { removeProperty } from "@/app/utils/removeProperty";

interface Families {
  family_id: number;
  family_name: string;
  creator: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    family_name: "",
    username: "",
    email: "",
    password: "",
    photo_path: "/images/default-profile.jpg",
    creator: "",
  });

  const [families, setFamilies] = useState<Families[]>([]);

  const [family, setFamily] = useState({
    creator: "",
    family_name: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFamily((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/login");
  };
  const handleRegisterClick = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    const removeFamilyName = removeProperty(formData, "family_name");
    const newFormNoCreator = removeProperty(removeFamilyName, "creator");
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/register",
        newFormNoCreator
      );
      console.log(response);
      if (response.status === 201) {
        // alert("Successfully Registered.");
        router.push("/login");
      } else {
        alert("Registration Failed.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Registration Failed.");
      setLoading(false);
      return error;
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(family);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/add-family",
      family
    );

    console.log(response);
    setFamilies((prevFamilies) => [
      ...prevFamilies,
      {
        family_id: response.data.family_id,
        family_name: response.data.family_name,
        creator: response.data.creator,
      },
    ]);
    // setFamilies((prevFamilies) => [
    //   ...prevFamilies,
    //   { value: family.family_name, label: family.family_name },
    // ]);
    setIsModalVisible(false);
  };

  const handleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/get-families"
        );
        const respData: Families[] = response.data;
        const uniqueFamilies = new Set(families.map((item) => item.family_id));
        respData.forEach((item) => {
          if (!uniqueFamilies.has(item.family_id)) {
            families.push(item);
          }
        });
        setFamilies((families) => [...families]);
        console.log(respData);
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    fetchData();
  }, []);

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
          <form className="flex flex-col gap-2 w-96">
            <div className="flex flex-row items-center gap-2">
              <select
                name="family_name"
                className="p-4 w-72 text-sm border border-gray-300 rounded-md shadow-md mb-4"
                value={formData.family_name}
                onChange={handleChange}
              >
                <option value="">Select your family</option>
                {families.map((family) => (
                  <option key={family.family_id} value={family.family_name}>
                    {family.family_name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="bg-red-900 hover:bg-red-800 text-white text-xs p-2 rounded-lg mb-4 w-30"
                onClick={handleModal}
              >
                Add Family
              </button>
            </div>

            <label htmlFor="username" className="font-medium pl-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="p-4 w-full text-sm border border-gray-300 rounded-md shadow-md mb-4"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

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

            <a
              href=""
              className="text-red-900 hover:text-red-600 self-center"
              onClick={handleLoginClick}
            >
              Login
            </a>

            <Button
              title="Register"
              onClick={handleRegisterClick}
              disabled={loading}
              loader={<ClipLoader size={24} />}
            />
          </form>
        </div>
      </div>

      <Modal isOpen={isModalVisible} onClose={closeModal}>
        <div>
          <form className="flex flex-col gap-4">
            <label htmlFor="creator" className="font-medium">
              Creator
            </label>
            <input
              type="text"
              name="creator"
              placeholder="Creator"
              className="p-4 text-sm border border-gray-300 rounded-md shadow-md"
              value={family.creator}
              onChange={handleModalChange}
            />

            <label htmlFor="familyName" className="font-medium">
              Family Name
            </label>
            <input
              type="text"
              name="family_name"
              placeholder="Family Name"
              className="p-4 text-sm border border-gray-300 rounded-md shadow-md"
              value={family.family_name}
              onChange={handleModalChange}
            />

            <Button title="Save" onClick={handleModalSubmit} />
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
