"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { googleAuthWithCH } from "@/api/auth";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    if (queryString) {
      googleAuthWithCH(queryString);
    }
  }, [queryString]);

  return <div>Callback Page</div>;
};

export default CallbackPage;
