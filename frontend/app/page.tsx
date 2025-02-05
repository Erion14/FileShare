'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WorldMapBackground } from "./_components/WorldMapBackground";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <WorldMapBackground />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 top-0 w-full p-4 flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          FileShare
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/pages/upload" className="black-button">
            Upload Files
          </Link>
          <Link href="/pages/signup" className="black-button">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen text-center px-4 mt-20">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider">
          Welcome to FileShare
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-6 leading-relaxed">
          Experience the future of file sharing. Secure, decentralized, and 
          lightning-fast. Share your files with confidence, knowing your data 
          remains truly yours.
        </p>

        <div className="space-y-4 mb-4">
          <Link
            href="/pages/signup"
            className="black-button"
          >
            Get Started
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl">
          <div className="p-4 rounded-lg">
            <h3 className="text-white text-lg font-bold mb-2">Decentralized Storage</h3>
            <p className="text-gray-400 text-sm">Your files are distributed across our secure network, ensuring maximum reliability.</p>
          </div>
          <div className="p-4 rounded-lg">
            <h3 className="text-white text-lg font-bold mb-2">End-to-End Encryption</h3>
            <p className="text-gray-400 text-sm">Advanced encryption keeps your data private and secure at all times.</p>
          </div>
          <div className="p-4 rounded-lg">
            <h3 className="text-white text-lg font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">Experience rapid file transfers with our optimized network infrastructure.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;