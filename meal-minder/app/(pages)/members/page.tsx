"use client";
import Layout from "@/app/components/Layout";
import React from "react";
import Image from "next/image";
import { FamilyMember } from "@/app/types/type";
import { FaUserFriends } from "react-icons/fa";
import Button from "@/app/components/buttons/button";

const MembersPage = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   }

  //   axios
  //     .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       router.push("/login");
  //     });
  // }, [router]);

  const members: FamilyMember[] = [
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

  return (
    <Layout>
      <div className="p-2 h-full">
        <h1 className="text-2xl font-bold">Your Members</h1>
        <div className="p-6">
          <p className="text-xl font-medium flex items-center gap-2">
            {" "}
            Dela Cruz Family
            <span>
              <FaUserFriends />
            </span>
          </p>
        </div>
        <div className="grid grid-flow-col gap-6 p-6">
          {members.map((mem) => (
            <div
              key={mem.id}
              className="flex items-center p-4 gap-4 bg-white rounded-lg"
            >
              <Image
                src={mem.image}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full shadow-lg"
              />
              <span className="flex flex-col">
                {mem.first_name} {mem.last_name}
                <span className="text-sm text-gray-400">{mem.email}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button title="Add Member" />
        </div>
      </div>
    </Layout>
  );
};

export default MembersPage;
