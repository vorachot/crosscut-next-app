"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";

import InfoCard from "./info-card";
import ResourceCard from "./resource-card";

import { useBreadcrumbData } from "@/hooks/useBreadCrumb";
import NamespaceList from "@/components/namespace-list";
import { formatDate } from "@/utils/helper";
import Loading from "@/app/loading";
import { getProjectUsageByProjectIdFromCH } from "@/api/namespace";
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
  const usageData: ResourceUsage[] = data.usage || [];

  return (
    <div className="flex flex-col justify-center gap-7">
      <div className="flex gap-5">
        <InfoCard
          createdAt={formatDate("2022-01-01")}
          projectId={projectId}
          updatedAt={formatDate("2022-01-02")}
        />
        <ResourceCard usageData={usageData} />
      </div>

      <NamespaceList projectId={projectId} />
    </div>
  );
};

export default ProjectDetailPage;
