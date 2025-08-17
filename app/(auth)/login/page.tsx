"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Google } from "@mui/icons-material";

import { loginUser } from "@/api/auth";
import Loading from "@/app/loading";
import { useUser } from "@/context/UserContext";

const LoginPage = () => {
  const router = useRouter();
  const { fetchUser } = useUser();
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
      const response = await loginUser(username, password);

      if (response.ok) {
        // Fetch user data after successful login
        await fetchUser();
        router.push("/projects");
      } else {
        const errorText = await response.text();

        setError(errorText || "Login failed. Please check your credentials.");
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
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Button
        className="w-80 py-2 rounded bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        disabled={isLoading}
        type="button"
        onPress={() => {
          router.push("http://localhost:8080/users/auth/google");
        }}
      >
        <div className="flex gap-3 items-center justify-center">
          <Google />
          Continue with Google
        </div>
      </Button>
      <div className="my-2">or</div>
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
          className="w-full py-2 mt-4 text-white rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
