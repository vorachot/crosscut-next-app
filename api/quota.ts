export async function getQuotasByNamespaceIdFromCH(
  namespaceId: string,
): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ns/quota/${namespaceId}`,
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
export async function getQuotaUsageByNamespaceIdFromCH(
  quotaId: string,
  namespaceId: string,
): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ns/quotaUsage/${quotaId}/${namespaceId}`,
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
export async function getResourcePoolDetailById(
  resourcePoolId: string,
): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ns/pool/${resourcePoolId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch resource pool details");
  }

  return response.json();
}
