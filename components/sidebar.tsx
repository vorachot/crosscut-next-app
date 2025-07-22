"use client";

import {
  Assignment,
  ConfirmationNumber,
  WorkRounded,
} from "@mui/icons-material";
import Link from "next/link";

import { ThemeSwitch } from "./theme-switch";

const iconClass = "!w-6 !h-6";
const navigationItems = [
  // { title: "Home", icon: <Home className={iconClass} />, url: "/" },
  {
    title: "Projects",
    icon: <WorkRounded className={iconClass} />,
    url: "/projects",
  },
  {
    title: "Tickets",
    icon: <ConfirmationNumber className={iconClass} />,
    url: "/tickets",
  },
  { title: "Tasks", icon: <Assignment className={iconClass} />, url: "/tasks" },
];

const Sidebar = () => {
  return (
    <aside
      aria-label="Sidebar navigation"
      className="hidden md:flex w-[260px] px-4 py-4 bg-white dark:bg-gray-800 shadow-md fixed top-16 left-0 h-[calc(100vh-4rem)] flex-col border-r border-gray-200 dark:border-gray-700 z-30 overflow-y-auto"
    >
      <div className="flex-1 flex flex-col gap-1">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            className="flex items-center gap-4 py-3 px-3 rounded-2xl text-[14px] font-semibold text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            href={item.url}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
      <div className="pt-6 pb-2 flex items-center justify-center border-t border-gray-200 dark:border-gray-700 mt-4">
        <ThemeSwitch />
      </div>
    </aside>
  );
};

export default Sidebar;
