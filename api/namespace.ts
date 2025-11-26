import apiClient from "@/utils/apiClient";

export async function getNamespacesByProjectIdFromCH(
  projectId: string,
): Promise<any> {
  const response = await apiClient.get(`/ns/namespaces/all/${projectId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch namespaces");
  }

  return response.data;
}
export async function getNamespaceDetailFromCH(
  namespaceId: string,
): Promise<any> {
  const response = await apiClient.get(`/ns/namespaces/${namespaceId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch namespace details");
  }

  return response.data;
}
export async function getNamespaceUsageByNamespaceIdFromCH(
  namespaceId: string,
): Promise<any> {
  const response = await apiClient.get(`/ns/namespaceUsage/${namespaceId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch namespace usage");
  }

  return response.data;
}
