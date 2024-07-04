"use client";
import { useState } from "react";
import Layout from "@/app/components/Layout";
import { useUser } from "@/context/UserProvider";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    profileImage: user?.profileImage || "",
    imageFile: null as File | null, // State to hold selected image file
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        imageFile: e.target.files[0], // Set the selected file in state
      });

      // Optionally, you can preview the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setFormData({
          ...formData,
          profileImage: url,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const formDataWithImage = new FormData();
      formDataWithImage.append("username", formData.username);
      formDataWithImage.append("image", formData.imageFile as File);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/update-profile`,
        formDataWithImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
      setIsEditing(false);
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
        {user && (
          <div className="flex flex-col gap-6">
            <div className="mb-4">
              <h1 className="font-bold text-2xl">Your Profile</h1>
            </div>
            <div className="flex flex-col items-center gap-4 p-2">
              <span className="rounded-full shadow-lg">
                <Image
                  src={formData.profileImage || user.profileImage}
                  alt="profile"
                  width={200}
                  height={300}
                  className="rounded-full"
                />
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
                    <span className="text-xl font-medium">{user.username}</span>
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
