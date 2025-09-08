"use client";

import { Chip } from "@heroui/chip";
import useSWR from "swr";

import ResourceTableClient from "./resource-table-client";

import Loading from "@/app/loading";
import { getNamespacesByProjectIdFromCH } from "@/api/namespace";
import { Namespace } from "@/types/resource";

const columns = [
  { name: "NAMESPACE", uid: "namespace", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

const NamespaceList = ({ projectId }: { projectId: string }) => {
  const { data, error, isLoading } = useSWR(
    ["namespaces", projectId],
    () => getNamespacesByProjectIdFromCH(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );
  const namespaces: Namespace[] = data || [];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading namespaces</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Namespaces
        </h2>
        <Chip color="primary" size="sm" variant="flat">
          {namespaces.length} namespaces
        </Chip>
      </div>
      <ResourceTableClient
        columns={columns}
        pathTemplate="project-to-namespace"
        rows={namespaces}
      />
    </div>
  );
};

export default NamespaceList;
