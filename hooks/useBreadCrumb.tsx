"use client";

import { useEffect, useRef } from "react";

import { useBreadcrumb } from "@/context/BreadCrumbContext";

interface UseBreadcrumbDataProps {
  projectId?: string;
  namespaceId?: string;
  resourcePoolId?: string;
}

export const useBreadcrumbData = ({
  projectId,
  namespaceId,
  resourcePoolId,
}: UseBreadcrumbDataProps) => {
  const { updateBreadcrumbItem, breadcrumbData } = useBreadcrumb();
  const fetchedIds = useRef(new Set<string>());

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          projectId &&
          !breadcrumbData[projectId] &&
          !fetchedIds.current.has(projectId)
        ) {
          fetchedIds.current.add(projectId);
          console.log("Fetching project data for:", projectId);

          const projectResponse = await fetch(
            `http://localhost:8090/projects/${projectId}`,
          );

          if (projectResponse.ok) {
            const project = await projectResponse.json();

            console.log("Project data:", project);
            updateBreadcrumbItem(projectId, project.name);
          } else {
            console.error("Failed to fetch project:", projectResponse.status);
            fetchedIds.current.delete(projectId); // Remove from cache on error
          }
        }

        if (
          namespaceId &&
          !breadcrumbData[namespaceId] &&
          !fetchedIds.current.has(namespaceId)
        ) {
          fetchedIds.current.add(namespaceId);
          console.log("Fetching namespace data for:", namespaceId);

          const namespaceResponse = await fetch(
            `http://localhost:8090/namespaces/${namespaceId}`,
          );

          if (namespaceResponse.ok) {
            const namespace = await namespaceResponse.json();

            updateBreadcrumbItem(namespaceId, namespace.name);
          } else {
            fetchedIds.current.delete(namespaceId);
          }
        }

        // Fetch resource pool data if resourcePoolId exists
        // if (resourcePoolId) {
        //   const resourcePoolResponse = await fetch(
        //     `/api/projects/${projectId}/namespaces/${namespaceId}/resource-pools/${resourcePoolId}`,
        //   );

        //   if (resourcePoolResponse.ok) {
        //     const resourcePool = await resourcePoolResponse.json();

        //     updateBreadcrumbItem(resourcePoolId, resourcePool.name);
        //   }
        // }
      } catch (error) {
        console.error("Failed to fetch breadcrumb data:", error);
        // Remove failed IDs from cache
        if (projectId) fetchedIds.current.delete(projectId);
        if (namespaceId) fetchedIds.current.delete(namespaceId);
        if (resourcePoolId) fetchedIds.current.delete(resourcePoolId);
      }
    };

    fetchData();
  }, [projectId, namespaceId, resourcePoolId]);
};
