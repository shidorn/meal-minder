"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import {
  checkTokenExpiration,
  getAccessToken,
  logout,
  setupTokenExpirationCheck,
} from "@/app/auth";
// import { useUser } from "@/context/UserProvider";

const ProfilePage: React.FC = () => {
  // const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const [formData, setFormData] = useState({
    user_id: parseInt(localStorage.getItem("user_id") || "0", 10),
    username: localStorage.getItem("username")?.toString() || "",
    password: "",
    first_name: "",
    last_name: "",
    photo_path: "/images/default-profile.jpg",
    imageFile: null as File | null,
    email: localStorage.getItem("email")?.toString() || "",
  });

  const favoriteRecipes = [
    { id: 1, name: "Spaghetti Carbonara", image: "/images/spaghetti.jpg" },
    { id: 2, name: "Chocolate Chip Cookies", image: "/images/cookies.jpg" },
    { id: 3, name: "Grilled Salmon", image: "/images/salmon.jpg" },
  ];

  const members = [
    {
      id: 1,
      first_name: "John",
      last_name: "Dela Cruz",
      email: "johndelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Dela Cruz",
      email: "janedelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 3,
      first_name: "Janine",
      last_name: "Dela Cruz",
      email: "janinedelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
    {
      id: 4,
      first_name: "Janella",
      last_name: "Dela Cruz",
      email: "janelladelacruz@example.com",
      image: "/images/default-profile.jpg",
    },
  ];

  useEffect(() => {
    checkTokenExpiration().catch(console.error);
    setupTokenExpirationCheck();
    const token = getAccessToken();
    if (!token) {
      logout(); // Redirect to login if no token is available
      return;
    }

    const fetchData = async () => {
      try {
        const email = {
          userEmail: localStorage.getItem("email"),
        };
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/getUser",
          email
        );
        console.log(response.data);
        setFormData({ ...formData, ...response.data });
        console.log(formData);
      } catch (error) {
        console.log(error);
        logout();
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files?.[0];
      // setFormData({
      //   ...formData,
      //   imageFile: e.target.files[0],
      // });

      const reader = new FileReader();
      reader.onload = () => {
        setFile(selectedFile);
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          photo_path: `/images/${selectedFile.name}`,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async () => {
    // setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      console.log(formData);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/updateUser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (!file) {
        localStorage.setItem("username", response.data.username);
        setIsEditing(false); // Exit edit mode
        setLoading(false);
        return;
      }

      const imgFile = new FormData();
      console.log("imgFile", file);
      imgFile.append("imgFile", file);
      if (response.status === 200) {
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_ENDPOINT + "/recipes/image",
            imgFile,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          console.log("image", response);
        } catch (error) {
          console.log(error);
        }
      }

      // setUser(response.data); // Update user context with new data
      setIsEditing(false); // Exit edit mode
      setLoading(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="h-full p-4">
        {formData && (
          <div className="flex flex-col gap-6">
            <div className="mb-4">
              <h1 className="font-bold text-2xl">Your Profile</h1>
            </div>
            <div className="flex flex-col items-center gap-4 p-2">
              <span className="rounded-full shadow-lg">
                {imagePreview ? (
                  <Image
                    src={imagePreview as string}
                    alt="profile"
                    width={200}
                    height={300}
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src={formData.photo_path}
                    alt="profile"
                    width={200}
                    height={300}
                    className="rounded-full"
                  />
                )}
              </span>
              <div className="flex flex-col items-center gap-8">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="p-2 border rounded-lg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="p-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      className="bg-green-600 p-2 rounded-lg text-sm text-white hover:bg-green-500"
                      onClick={handleProfileUpdate}
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 p-2 rounded-lg text-sm text-white hover:bg-gray-500"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="flex flex-col text-center text-xl font-medium">
                      {formData.username}{" "}
                      <span className="text-sm text-gray-500">
                        {formData.email}
                      </span>
                    </p>

                    <button
                      type="button"
                      className="bg-yellow-600 p-2 rounded-lg text-sm text-white hover:bg-yellow-500"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
            <hr />
            <div className="grid grid-flow-col gap-4 p-6">
              <div className="h-full">
                <h1 className="mb-6 font-semibold">Family Members</h1>
                <div className="grid grid-cols-2">
                  {members.map((mem) => (
                    <div key={mem.id} className="flex items-center p-4 gap-4">
                      <Image
                        src={mem.image}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full shadow-lg"
                      />
                      <span className="flex flex-col">
                        {mem.first_name} {mem.last_name}
                        <span className="text-sm text-gray-400">
                          {mem.email}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="font-semibold">Favorite Recipes</h1>
                <div>
                  {favoriteRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center p-4 gap-4"
                    >
                      <FaStar className="text-yellow-600" />
                      <p className="text-md">{recipe.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
