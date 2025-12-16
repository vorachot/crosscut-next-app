"use client";

import { useRouter } from "next/navigation";

import NamespaceResourceTable from "./ns-resource-table";

import ResourcePoolTable from "@/components/resource-pool-table";
import { Namespace, Quota } from "@/types/resource";

type ResourceTableClientProps = {
  parentId?: string;
  rows?: (Namespace | Quota)[];
  pathTemplate: "project-to-namespace" | "namespace-to-resource";
};

const ResourceTableClient = ({
  parentId,
  rows,
  pathTemplate,
}: ResourceTableClientProps) => {
  const router = useRouter();

  const getPath = (row: any) => {
    switch (pathTemplate) {
      case "project-to-namespace":
        return `/projects/${row.project_id}/${row.id}`;
      case "namespace-to-resource":
        return `/projects/${row.project_id}/${parentId}/${row.node_id}?quota_id=${row.id}`;
      default:
        return "/";
    }
  };

  return (
    <>
      {pathTemplate === "project-to-namespace" ? (
        <NamespaceResourceTable
          rows={rows! as Namespace[]}
          onRowClick={(row) => router.push(getPath(row))}
        />
      ) : (
        <ResourcePoolTable
          rows={rows! as Quota[]}
          onRowClick={(row) => {
            router.push(getPath(row));
          }}
        />
      )}
    </>
  );
};

export default ResourceTableClient;
