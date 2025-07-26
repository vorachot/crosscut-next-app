"use client";

import { useEffect, useState } from "react";

import InfoCard from "./info-card";

import { getProjects } from "@/api/namespace";
import { Project } from "@/types/resource";
import Loading from "@/app/loading";

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [data] = await Promise.all([
          getProjects(),
          new Promise((res) => setTimeout(res, 500)), // artificial delay
        ]);

        setProjects(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-row flex-wrap gap-10">
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
