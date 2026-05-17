"use client";

import { Button } from "@heroui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Google } from "@mui/icons-material";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "user_exists") {
      setError(
        "This Google account is already registered. Please sign in instead.",
      );
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">{error}</div>
      )}
      <Button
        className="w-80 py-2 rounded bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        type="button"
        onPress={() => {
          router.push(`${process.env.NEXT_PUBLIC_CH_URL}/auth/register/google`);
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
