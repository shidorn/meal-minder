"use client";
import Layout from "@/app/components/Layout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import axios from "axios";

const MembersPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        console.log(error);
        router.push("/login");
      });
  }, [router]);

  return (
    <Layout>
      <div>
        <h1>Your Members</h1>
      </div>
    </Layout>
  );
};

export default MembersPage;
