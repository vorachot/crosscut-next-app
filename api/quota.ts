import apiClient from "@/utils/apiClient";

export async function getQuotasByNamespaceIdFromCH(
  namespaceId: string,
): Promise<any> {
  const response = await apiClient.get(`/ns/quota/${namespaceId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch quotas");
  }

  return response.data;
}
export async function getQuotaUsageByNamespaceIdFromCH(
  quotaId: string,
  namespaceId: string,
): Promise<any> {
  const response = await apiClient.get(
    `/ns/quotaUsage/${quotaId}/${namespaceId}`,
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch quota usage");
  }

  return response.data;
}
export async function getResourcePoolDetailById(
  resourcePoolId: string,
): Promise<any> {
  const response = await apiClient.get(`/ns/pool/${resourcePoolId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch resource pool details");
  }

  return response.data;
}
