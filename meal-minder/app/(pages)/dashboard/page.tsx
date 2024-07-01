"use client";
import Layout from "@/app/components/Layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  checkTokenExpiration,
  getAccessToken,
  setupTokenExpirationCheck,
  logout,
} from "@/app/auth";

const Dashboard = () => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    checkTokenExpiration().catch(console.error);
    setupTokenExpirationCheck();
    const fetchData = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          logout(); // Redirect to login if no token is available
          return;
        }
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/auth/protected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Welcome to Protected Dashboard</h1>
      </div>
    </Layout>
  );
};

export default Dashboard;
