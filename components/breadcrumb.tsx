"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SwitchAccessShortcut } from "@mui/icons-material";

import { UserProfile } from "./user-profie";

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    return (
      <li key={href} className="inline-flex items-center">
        {!isLast ? (
          <Link
            className="text-[18px] hover:text-blue-600 hover:underline"
            href={href}
          >
            {decodeURIComponent(seg)}
          </Link>
        ) : (
          <span className="text-[18px] text-gray-500 dark:text-gray-400 cursor-default">
            {decodeURIComponent(seg)}
          </span>
        )}
        {!isLast && (
          <svg
            className="text-[18px] mx-2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </li>
    );
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-16 bg-gray-100 fixed top-0 w-full dark:bg-gray-800 py-2 z-40 flex justify-between items-center"
    >
      <div className="w-fit flex-1 px-4">
        <ol className="container py-4 flex items-center text-gray-700 dark:text-gray-300 text-sm">
          <li className="inline-flex items-center">
            <Link
              aria-label="Home"
              className="flex items-center gap-2 no-underline"
              href="/"
            >
              <span className="rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 shadow-md">
                <SwitchAccessShortcut className="!w-8 !h-8 text-white" />
              </span>
              <span className="ml-2 font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-tr from-blue-600 to-purple-500 tracking-tight select-none logo-font">
                CrossCut
              </span>
            </Link>
            {segments.length > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </li>
          {crumbs}
        </ol>
      </div>
      <div className="w-fit flex justify-end items-end px-4">
        <UserProfile />
      </div>
    </nav>
  );
};

export default Breadcrumb;
