"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { googleAuthWithCH } from "@/api/auth";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  // const code = searchParams.get("code");

  useEffect(() => {
    if (queryString) {
      googleAuthWithCH(queryString);
    }
  }, [queryString]);

  console.log("Callback page code:", queryString);

  return <div>Callback Page</div>;
};

export default CallbackPage;
