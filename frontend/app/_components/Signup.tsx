"use client";
import React from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { api } from "../utils/api";

export function Signup() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      Cookies.set("accessToken", data.accessToken);
      // You might want to redirect here after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-white">
      <h2 className="font-bold text-xl text-neutral-200 dark:text-neutral-800">
        Welcome to FileSharing
      </h2>
      <p className="text-neutral-300 text-sm max-w-sm mt-2 dark:text-neutral-600">
       Login to use the File Sharing services.
      </p>

      <form className="my-8" onSubmit={handleLogin}>
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
          />
        </LabelInputContainer>

        <button
          className="bg-white text-black relative group/btn block w-full rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#00000040_inset,0px_-1px_0px_0px_#00000040_inset] dark:shadow-[0px_1px_0px_0px_var(--white)_inset,0px_-1px_0px_0px_var(--white)_inset]"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-700 dark:via-neutral-300 to-transparent my-8 h-[1px] w-full" />
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
