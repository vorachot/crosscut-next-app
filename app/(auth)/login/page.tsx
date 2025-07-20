"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (response.ok) {
        router.push("/projects");
      } else {
        const errorText = await response.text();

        setError(errorText || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      // eslint-disable-next-line no-console
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
          name="password"
          placeholder="Password"
          type="password"
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <Button
          className="w-full py-2 mt-4 text-white rounded"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
