"use client";

import { useEffect, useState } from "react";
import { Chip } from "@heroui/chip";

import ResourceTableClient from "./resource-table-client";

import { Namespace } from "@/types/resource";
import { getNamespaces } from "@/api/namespace";
import Loading from "@/app/loading";

const columns = [
  { name: "NAMESPACE", uid: "namespace", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

const NamespaceList = ({ projectId }: { projectId: string }) => {
  const [namespaces, setNamespaces] = useState<Namespace[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [data] = await Promise.all([
          getNamespaces(),
          new Promise((res) => setTimeout(res, 500)), // artificial delay
        ]);
        const { namespace } = data;

        setNamespaces(namespace);
      } catch {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNamespaces: Namespace[] = namespaces.filter(
    (ns) => ns.project === projectId,
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Namespaces
        </h2>
        <Chip color="primary" size="sm" variant="flat">
          {filteredNamespaces.length} namespaces
        </Chip>
      </div>
      <ResourceTableClient
        columns={columns}
        pathTemplate="project-to-namespace"
        rows={filteredNamespaces}
      />
    </div>
  );
};

export default NamespaceList;
