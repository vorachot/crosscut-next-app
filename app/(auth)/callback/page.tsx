"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { googleAuthWithCH } from "@/api/auth";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      googleAuthWithCH(code);
    }
  }, [code]);

  console.log("Callback page code:", code);

  return <div>Callback Page</div>;
};

export default CallbackPage;
