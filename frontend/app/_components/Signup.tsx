"use client";
import React from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "../utils/api";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from "react";

export function Signup() {
  const [email, setEmail] = React.useState("");
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/api/auth/register", { email, password });
      if (data) {
        router.push("/pages/logini");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during signup');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="auth-form w-full max-w-md space-y-4">
        <h2 className="font-bold text-xl text-neutral-200 dark:text-neutral-800">
          Create your FileSharing Account
        </h2>
        <p className="text-neutral-300 text-sm max-w-sm mt-2 dark:text-neutral-600">
          Sign up to start sharing files securely.
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
            required
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
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmPassword" className="text-neutral-200 dark:text-neutral-800">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black"
            disabled={isLoading}
            required
          />
        </LabelInputContainer>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-400">Already have an account?</p>
          <Link 
            href="/pages/logini" 
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Login here
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
