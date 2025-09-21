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
