import { ResourceDetail } from "@/types/resource";

export async function getResourceDetailByResourceIdFromCH(
  resourceId: string,
): Promise<ResourceDetail> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ns/resource/${resourceId}`,
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
