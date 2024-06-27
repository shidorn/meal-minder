"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Dashboard = () => {
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
        <h1>Welcome to Protected Dashboard</h1>
      </div>
    </Layout>
  );
};

export default Dashboard;
