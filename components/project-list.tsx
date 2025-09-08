"use client";

import useSWR from "swr";
import { FolderCopy as ProjectIcon } from "@mui/icons-material";

import InfoCard from "./project-card";

import { getProjectsFromCH } from "@/api/namespace";
import Loading from "@/app/loading";
import { Project } from "@/types/resource";

const ProjectList = () => {
  const { data, error, isLoading } = useSWR(
    ["projects"],
    () => getProjectsFromCH(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  const showLoading = isLoading;

  if (showLoading) return <Loading />;
  if (error) return <div>Error loading projects</div>;

  const projects: Project[] = data || [];

  if (projects.length === 0) {
    return (
      <div className="h-[500px] flex flex-col justify-center items-center text-center opacity-50">
        <ProjectIcon className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No Available Projects
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-10">
      {projects.map((project, index) => (
        <InfoCard
          key={index}
          aria-label={`Project ${project.name}`}
          createdDate="30 Nov 2027"
          id={project.id}
          title={project.name}
        />
      ))}
    </div>
  );
};

export default ProjectList;
