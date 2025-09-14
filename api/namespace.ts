import { Namespace, Project, ResourceDetail } from "@/types/resource";

export async function getProjectsFromCH(): Promise<Project[]> {
  const response = await fetch("http://localhost:8090/projects/all", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch projects");
  }

  return response.json();
}

export async function getProjectUsageByProjectIdFromCH(
  projectId: string,
): Promise<any> {
  const response = await fetch(
    `http://localhost:8090/projects/${projectId}/usage`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch project usage");
  }

  return response.json();
}

export async function getNamespacesByProjectIdFromCH(
  projectId: string,
): Promise<Namespace[]> {
  const response = await fetch(
    `http://localhost:8090/namespaces/all/${projectId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch namespaces");
  }

  return response.json();
}
export async function getQuotasByNamespaceIdFromCH(
  namespaceId: string,
): Promise<any> {
  const response = await fetch(
    `http://localhost:8090/quota/namespace/${namespaceId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch quotas");
  }

  return response.json();
}
export async function getResourceDetailByResourceIdFromCH(
  resourceId: string,
): Promise<ResourceDetail> {
  const response = await fetch(
    `http://localhost:8090/resources/${resourceId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch resource unit");
  }

  return response.json();
}
