"use client";

import { useEffect, useRef } from "react";

import { useBreadcrumb } from "@/context/BreadCrumbContext";
import { getProjectDetailFromCH } from "@/api/project";
import { getNamespaceDetailFromCH } from "@/api/namespace";
import { getResourcePoolDetailById } from "@/api/quota";

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

          const { project } = await getProjectDetailFromCH(projectId);

          updateBreadcrumbItem(projectId, project.name);
        }
        if (
          namespaceId &&
          !breadcrumbData[namespaceId] &&
          !fetchedIds.current.has(namespaceId)
        ) {
          fetchedIds.current.add(namespaceId);

          const { namespace } = await getNamespaceDetailFromCH(namespaceId);

          updateBreadcrumbItem(namespaceId, namespace.name);
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
        if (
          resourcePoolId &&
          !breadcrumbData[resourcePoolId] &&
          !fetchedIds.current.has(resourcePoolId)
        ) {
          fetchedIds.current.add(resourcePoolId);

          const { resourcePool } =
            await getResourcePoolDetailById(resourcePoolId);

          updateBreadcrumbItem(resourcePoolId, resourcePool.name);
        }
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
