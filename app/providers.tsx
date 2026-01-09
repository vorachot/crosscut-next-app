"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import { UserProvider } from "@/context/UserContext";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider
      disableRipple
      skipFramerMotionAnimations
      navigate={router.push}
    >
      <NextThemesProvider
        {...themeProps}
        enableSystem
        attribute="class"
        defaultTheme="dark"
      >
        <Toaster position="top-center" />
        <UserProvider>{children}</UserProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
