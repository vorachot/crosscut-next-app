"use client";

import useSWR from "swr";

import InfoCard from "./info-card";

import { getProjects } from "@/api/namespace";
import Loading from "@/app/loading";

const ProjectList = () => {
  const { data, error, isLoading } = useSWR(["projects"], () => getProjects(), {
    revalidateOnFocus: false,
    dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
  });

  const showLoading = isLoading;

  if (showLoading) return <Loading />;
  if (error) return <div>Error loading projects</div>;

  const projects: any[] = data || [];

  if (projects.length === 0) {
    return <div className="text-gray-500">No projects available</div>;
  }

  return (
    <div className="mt-5 flex flex-row flex-wrap gap-10">
      {projects.map((project, index) => (
        <InfoCard
          key={index}
          aria-label={`Project ${project.name}`}
          createdDate="30 Nov 2027"
          id={project.name}
          title={project.name}
        />
      ))}
    </div>
  );
};

export default ProjectList;
