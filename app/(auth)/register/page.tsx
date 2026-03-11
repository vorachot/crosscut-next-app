"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Google } from "@mui/icons-material";

import { registerUser } from "@/api/auth";
import Loading from "@/app/loading";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "user_exists") {
      setError(
        "This Google account is already registered. Please sign in instead.",
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(username, email, password);

      if (response.ok) {
        router.push("/login");
      } else {
        const errorText = await response.text();

        setError(errorText || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <Form className="w-80 space-y-4" onSubmit={handleSubmit}>
        <Input
          required
          disabled={isLoading}
          name="username"
          placeholder="Username"
        />
        <Input
          required
          disabled={isLoading}
          name="email"
          placeholder="Email"
          type="email"
        />
        <Input
          required
          disabled={isLoading}
          name="password"
          placeholder="Password"
          type="password"
        />
        <Input
          required
          disabled={isLoading}
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button
          className="w-full py-2 mt-4 text-white rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </Form>
      <div className="text-sm my-4">OR</div>
      <Button
        className="w-80 py-2 rounded bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        disabled={isLoading}
        type="button"
        onPress={() => {
          router.push("https://onepointfive.life/auth/register/google");
        }}
      >
        <div className="flex gap-3 items-center justify-center">
          <Google />
          Continue with Google
        </div>
      </Button>
      <div className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <Link
          className="text-blue-600 hover:text-blue-700 underline"
          href="/login"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
