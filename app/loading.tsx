import React from "react";

interface LoadingProps {
  children?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ children }) => {
  return (
    <div className="relative">
      {children}
      <div className="ml-[260px] mt-16 fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-black/30">
        <svg
          className="animate-spin h-24 w-24 text-blue-500"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            fill="none"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            className="opacity-75"
            cx="12"
            cy="12"
            fill="none"
            r="10"
            stroke="currentColor"
            strokeDasharray="60"
            strokeDashoffset="15"
            strokeWidth="2"
          />
        </svg>
        <span className="mt-10 text-2xl text-gray-700 dark:text-gray-200 tracking-wide animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;
