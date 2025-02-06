"use client";
import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "../utils/api";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export function Login() {
  const [email, setEmail] = React.useState("");
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      if (data.token) {
        Cookies.set('accessToken', data.token);
        router.push("/pages/upload");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during login');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="auth-form w-full max-w-md space-y-4">
        <h2 className="font-bold text-xl text-neutral-200 dark:text-neutral-800">
          Welcome Back to FileSharing
        </h2>
        <p className="text-neutral-300 text-sm max-w-sm mt-2 dark:text-neutral-600">
          Login to use the File Sharing services.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-neutral-200 dark:text-neutral-800">
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="example@mail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black"
            disabled={isLoading}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-neutral-200 dark:text-neutral-800">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black"
            disabled={isLoading}
          />
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-400">Don't have an account?</p>
          <Link 
            href="/pages/signup" 
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
