"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

import InfoCard from "./info-card";
import ResourceCard from "./resource-card";

import { useBreadcrumbData } from "@/hooks/useBreadCrumb";
import NamespaceList from "@/components/namespace-list";
import Loading from "@/app/loading";
import { getProjectUsageByProjectIdFromCH } from "@/api/project";
import { ResourceUsage } from "@/types/resource";

const ProjectDetailPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;

  useBreadcrumbData({ projectId });

  const { data, error, isLoading } = useSWR(
    ["project-usage"],
    () => getProjectUsageByProjectIdFromCH(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;
  const usageData: ResourceUsage[] = data.projectUsage.usage || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex">
          <InfoCard projectId={projectId} />
        </div>
        <div className="lg:col-span-2 flex">
          <ResourceCard usageData={usageData} />
        </div>
      </div>

      <div className="w-full">
        <NamespaceList projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
