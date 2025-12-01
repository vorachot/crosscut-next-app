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
    <div className="flex flex-col justify-center gap-7">
      <div className="flex gap-5">
        <InfoCard projectId={projectId} />
        <ResourceCard usageData={usageData} />
      </div>

      <NamespaceList projectId={projectId} />
    </div>
  );
};

export default ProjectDetailPage;
