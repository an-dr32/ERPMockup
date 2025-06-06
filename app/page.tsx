"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log("Home page - checking authentication");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    if (isAuthenticated === "true") {
      console.log("User authenticated, redirecting to dashboard");
      router.push("/dashboard");
    } else {
      console.log("User not authenticated, redirecting to login");
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-erp-primary"></div>
    </div>
  );
}
