"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { googleAuthWithCH } from "@/api/auth";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryString = searchParams.toString();

  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (queryString) {
          const response = await googleAuthWithCH(queryString);

          if (response.ok) {
            // Refresh auth status to get user data
            // await checkAuthStatus();
            router.replace("/projects");
          } else {
            throw new Error(`Authentication failed: ${response.statusText}`);
          }
        } else {
          setError("No authentication data received");
          setTimeout(() => router.replace("/login"), 2000);
        }
      } catch {
        setError("Authentication failed");
        setTimeout(() => router.replace("/login?error=callback_failed"), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [queryString, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto" />
            <p className="mt-4 text-lg">Processing authentication...</p>
          </>
        ) : (
          <p className="text-lg">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
