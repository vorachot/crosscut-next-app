"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface BreadcrumbData {
  [key: string]: string; // Maps IDs to names
}

interface BreadcrumbContextType {
  breadcrumbData: BreadcrumbData;
  setBreadcrumbData: (data: BreadcrumbData) => void;
  updateBreadcrumbItem: (id: string, name: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }

  return context;
};

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [breadcrumbData, setBreadcrumbDataState] = useState<BreadcrumbData>({});
  const pathname = usePathname();

  // Clear breadcrumb data when route changes significantly
  useEffect(() => {
    const shouldClearData = () => {
      // Don't clear if we're still in the projects section
      if (pathname.startsWith("/projects")) return false;

      // Add other conditions as needed
      return true;
    };

    if (shouldClearData()) {
      setBreadcrumbDataState({});
    }
  }, [pathname]);

  const setBreadcrumbData = (data: BreadcrumbData) => {
    setBreadcrumbDataState(data);
  };

  const updateBreadcrumbItem = (id: string, name: string) => {
    setBreadcrumbDataState((prev) => ({ ...prev, [id]: name }));
  };

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbData, setBreadcrumbData, updateBreadcrumbItem }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
