"use client";

import React, { createContext, useContext } from "react";

type NamespaceContextType = {
  glidelet_urn?: string;
  namespace_id: string;
  quota_id: string;
};

const NamespaceContext = createContext<NamespaceContextType | undefined>(
  undefined,
);

export const NamespaceProvider = ({
  children,
  quota_id,
  glidelet_urn,
  namespace_id,
}: NamespaceContextType & { children: React.ReactNode }) => {
  return (
    <NamespaceContext.Provider value={{ quota_id, glidelet_urn, namespace_id }}>
      {children}
    </NamespaceContext.Provider>
  );
};

export const useNamespace = (): NamespaceContextType => {
  const context = useContext(NamespaceContext);

  if (!context) {
    throw new Error("useNamespace must be used within a NamespaceProvider");
  }

  return context;
};
