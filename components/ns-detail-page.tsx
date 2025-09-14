"use client";
import { useParams } from "next/navigation";

import ResourceCard from "./resource-card";
import ResourcePoolList from "./resource-pool-list";

import { useBreadcrumbData } from "@/hooks/useBreadCrumb";
import { useBreadcrumb } from "@/context/BreadCrumbContext";
import { getDisplayName } from "@/utils/helper";

const NamespaceDetailPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const namespaceId = params.namespaceId as string;

  useBreadcrumbData({ projectId, namespaceId });

  const { breadcrumbData } = useBreadcrumb();

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getDisplayName(namespaceId, breadcrumbData)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Namespace in project{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {getDisplayName(projectId, breadcrumbData)}
            </span>
          </p>
        </div>
      </div>

      {/* Resource Quota Overview */}
      <ResourceCard usageData={[]} />

      {/* Resource Pools Section */}
      <ResourcePoolList namespaceId={namespaceId} />
    </div>
  );
};

export default NamespaceDetailPage;
