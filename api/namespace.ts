import { Namespace, Project, ResourceDetail } from "@/types/resource";

// export async function getNamespaces(): Promise<{ namespace: Namespace[] }> {
//   const response = await fetch("http://localhost:8080/ns/nsList", {
//     method: "GET",
//     credentials: "include",
//   });

//   if (!response.ok) {
//     const errorText = await response.text();

//     throw new Error(errorText || "Failed to fetch namespaces");
//   }

//   return response.json();
// }
// export async function getProjects(): Promise<Project[]> {
//   const { namespace } = await getNamespaces();

//   const safeNamespaces = Array.isArray(namespace) ? namespace : [];

//   const projectMap = safeNamespaces.reduce<Record<string, Namespace[]>>(
//     (acc, ns) => {
//       if (!acc[ns.project]) {
//         acc[ns.project] = [];
//       }
//       acc[ns.project].push(ns);

//       return acc;
//     },
//     {}
//   );

//   const projects = Object.entries(projectMap).map(
//     ([projectName, namespaces]) => ({
//       id: projectName,
//       name: projectName,
//       namespaces,
//     })
//   );

//   return projects;
// }

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
