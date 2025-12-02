"use client";
import { useParams } from "next/navigation";
import useSWR from "swr";

import ResourceCard from "./resource-card";
import ResourcePoolList from "./resource-pool-list";

import { useBreadcrumbData } from "@/hooks/useBreadCrumb";
import { useBreadcrumb } from "@/context/BreadCrumbContext";
import { getDisplayName } from "@/utils/helper";
import { getNamespaceUsageByNamespaceIdFromCH } from "@/api/namespace";
import Loading from "@/app/loading";
import { ResourceUsage } from "@/types/resource";

const NamespaceDetailPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const namespaceId = params.namespaceId as string;

  useBreadcrumbData({ projectId, namespaceId });

  const { breadcrumbData } = useBreadcrumb();

  const { data, error, isLoading } = useSWR(
    ["namespace-usage", namespaceId],
    () => getNamespaceUsageByNamespaceIdFromCH(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;
  const usageData: ResourceUsage[] = data.namespaceUsage.usage || [];

  return (
    <div className="container mx-auto pt-1 p-4 space-y-3">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getDisplayName(namespaceId, breadcrumbData)}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-md">
          Namespace in project{" "}
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {getDisplayName(projectId, breadcrumbData)}
          </span>
        </p>
      </div>

      {/* Resource Quota Overview */}
      <div className="w-full">
        <ResourceCard usageData={usageData} />
      </div>

      {/* Resource Pools Section */}
      <div className="w-full">
        <ResourcePoolList namespaceId={namespaceId} />
      </div>
    </div>
  );
};

export default NamespaceDetailPage;
