import apiClient from "@/utils/apiClient";

export async function getProjectsFromCH(): Promise<any> {
  const response = await apiClient.get("/ns/projects");

  return response.data;
}
export async function getProjectDetailFromCH(projectId: string): Promise<any> {
  const response = await apiClient.get(`/ns/projects/${projectId}`);

  return response.data;
}
export async function getProjectUsageByProjectIdFromCH(
  projectId: string,
): Promise<any> {
  const response = await apiClient.get(`/ns/projectUsage/${projectId}`);

  return response.data;
}
