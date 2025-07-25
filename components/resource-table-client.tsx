"use client";

import { useRouter } from "next/navigation";

import ResourceTable from "@/components/resource-table";

type ResourceTableClientProps = {
  columns?: { name: string; uid: string; sortable: boolean }[];
  rows?: any[];
  pathTemplate: "project-to-namespace" | "namespace-to-resourcepool";
};

const ResourceTableClient = ({
  columns,
  rows,
  pathTemplate,
}: ResourceTableClientProps) => {
  const router = useRouter();

  const getPath = (row: any) => {
    switch (pathTemplate) {
      case "project-to-namespace":
        return `/projects/${row.project}/${row.id}`;
      case "namespace-to-resourcepool":
        return `/projects/${row.project}/${row.id}/${row.resource_unit_urn}`;
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
