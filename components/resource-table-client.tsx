"use client";

import { useRouter } from "next/navigation";

import ResourceTable from "@/components/resource-table";
import { Namespace, Quota } from "@/types/resource";

type ResourceTableClientProps = {
  parentId?: string;
  columns?: { name: string; uid: string; sortable: boolean }[];
  rows?: (Namespace | Quota)[];
  pathTemplate: "project-to-namespace" | "namespace-to-resourcepool";
};

const ResourceTableClient = ({
  parentId,
  columns,
  rows,
  pathTemplate,
}: ResourceTableClientProps) => {
  const router = useRouter();

  const getPath = (row: any) => {
    switch (pathTemplate) {
      case "project-to-namespace":
        return `/projects/${row.project_id}/${row.id}`;
      case "namespace-to-resourcepool":
        return `/projects/${row.project_id}/${parentId}/${row.id}`;
      default:
        return "/";
    }
  };

  return (
    <ResourceTable
      columns={columns}
      rows={rows}
      onRowClick={(row) => {
        router.push(getPath(row));
      }}
    />
  );
};

export default ResourceTableClient;
