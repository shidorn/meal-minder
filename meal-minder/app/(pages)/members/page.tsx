"use client";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";
import SearchBar from "@/app/components/search-bar/SearchBar";
import Image from "next/image";

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

  return (
    <Layout>
      <div className="p-2 h-full">
        <h1 className="text-2xl font-bold">Your Members</h1>
        <div className="grid grid-flow-row gap-6 p-6">
          <div className="flex items-center justify-between rounded-lg shadow-lg bg-white px-20 py-2 h-20">
            <Image
              src={"/images/default-profile.jpg"}
              alt="member"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p>Jane Dela Cruz</p>
            <p>janedelacruz@gmail.com</p>
            <p>Eldest Daughter </p>
          </div>
          <div className="flex items-center justify-between rounded-lg shadow-lg bg-white px-20 py-2 h-20">
            <Image
              src={"/images/default-profile.jpg"}
              alt="member"
              width={40}
              height={40}
              className="rounded-full"
            />
            <p>John Dela Cruz</p>
            <p>johndelacruz@gmail.com</p>
            <p>Eldest Son </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MembersPage;
