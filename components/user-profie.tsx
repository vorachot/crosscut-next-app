"use client";

import { useState } from "react";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";

import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/api/auth";

export const UserProfile = () => {
  const { user, clearUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      clearUser();
      // Redirect will be handled by middleware after clearing the cookie
      window.location.href = "/login";
    } catch {
      // Handle logout error if needed
      clearUser();
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <Button as="a" href="/login" variant="flat">
        Login
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <User
        avatarProps={{
          src: user.picture,
        }}
        description={user.email}
        name={user.username}
      />
      <Button
        color="danger"
        disabled={isLoggingOut}
        size="sm"
        variant="flat"
        onPress={handleLogout}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
};
