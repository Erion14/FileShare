'use client';
import React from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const redirectToSignup = () => {
    router.push("pages/signup");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1>Hello</h1>
      <button onClick={redirectToSignup} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Go to Signup
      </button>
    </div>
  );
};

export default HomePage;
``