"use client";

import { Chip } from "@heroui/chip";
import useSWR from "swr";

import ResourceTableClient from "./resource-table-client";

import { getQuotasByNamespaceIdFromCH } from "@/api/quota";
import Loading from "@/app/loading";
import { Quota } from "@/types/resource";

const ResourcePoolList = ({ namespaceId }: { namespaceId: string }) => {
  const { data, error, isLoading } = useSWR(
    ["quotas", namespaceId],
    () => getQuotasByNamespaceIdFromCH(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading quotas</div>;
  const quotas: Quota[] = data.quotas || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Resource Pools
        </h2>
        <Chip color="primary" size="sm" variant="flat">
          {quotas.length} pools
        </Chip>
      </div>
      <ResourceTableClient
        parentId={namespaceId}
        pathTemplate="namespace-to-resourcepool"
        rows={quotas}
      />
    </div>
  );
};

export default ResourcePoolList;
