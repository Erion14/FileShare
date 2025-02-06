'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  email: string;
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token) as DecodedToken;
        setUserEmail(decoded.email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/');
    setIsOpen(false);
  };

  if (!userEmail) {
    return (
      <Link href="/pages/signup" className="black-button">
        Sign Up
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none"
      >
        <span className="text-sm">{userEmail}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <Link
              href="/pages/upload"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Upload Files
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}