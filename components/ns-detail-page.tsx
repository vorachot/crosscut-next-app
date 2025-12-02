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

  // Helper function to check if a value looks like a UUID
  const isUUID = (str: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return uuidRegex.test(str);
  };

  // Get display names or show loading state
  const namespaceDisplayName = getDisplayName(namespaceId, breadcrumbData);
  const projectDisplayName = getDisplayName(projectId, breadcrumbData);

  const isNamespaceLoading =
    isUUID(namespaceId) &&
    namespaceDisplayName === namespaceId &&
    !breadcrumbData?.[namespaceId];
  const isProjectLoading =
    isUUID(projectId) &&
    projectDisplayName === projectId &&
    !breadcrumbData?.[projectId];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;
  const usageData: ResourceUsage[] = data.namespaceUsage.usage || [];

  return (
    <div className="container mx-auto pt-1 p-4 space-y-3">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isNamespaceLoading ? (
            <span className="inline-block w-48 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          ) : (
            namespaceDisplayName
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-md">
          Namespace in project{" "}
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {isProjectLoading ? (
              <span className="inline-block w-32 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            ) : (
              projectDisplayName
            )}
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
