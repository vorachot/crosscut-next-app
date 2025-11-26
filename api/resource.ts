import { ResourceDetail } from "@/types/resource";
import apiClient from "@/utils/apiClient";

export async function getResourceDetailByResourceIdFromCH(
  resourceId: string,
): Promise<ResourceDetail> {
  const response = await apiClient.get(`/ns/resource/${resourceId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch resource details");
  }

  return response.data;
}
