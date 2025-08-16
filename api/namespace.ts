import { Namespace, Project } from "@/types/resource";

export async function getNamespaces(): Promise<{ namespace: Namespace[] }> {
  const response = await fetch("http://localhost:8080/ns/nsList", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch namespaces");
  }

  return response.json();
}
export async function getProjects(): Promise<Project[]> {
  const { namespace } = await getNamespaces();

  const safeNamespaces = Array.isArray(namespace) ? namespace : [];

  const projectMap = safeNamespaces.reduce<Record<string, Namespace[]>>(
    (acc, ns) => {
      if (!acc[ns.project]) {
        acc[ns.project] = [];
      }
      acc[ns.project].push(ns);

      return acc;
    },
    {},
  );

  const projects = Object.entries(projectMap).map(
    ([projectName, namespaces]) => ({
      id: projectName,
      name: projectName,
      namespaces,
    }),
  );

  return projects;
}
