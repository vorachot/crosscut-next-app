export async function requestTicket(
  namespaceUrn: string,
  glideletUrn: string,
  namespaceId: string,
  cpu: number,
  gpu: number,
  memory: number,
): Promise<any> {
  const body = {
    namespace_urn: namespaceUrn,
    glidelet_urn: glideletUrn,
    namespace_id: namespaceId,
    spec: [
      {
        type: "compute",
        pool_id: crypto.randomUUID(),
        resource: [
          { name: "cpu", quantity: cpu.toString(), unit: "default_unit" },
          { name: "gpu", quantity: gpu.toString(), unit: "default_unit" },
          { name: "memory", quantity: memory.toString(), unit: "default_unit" },
        ],
      },
    ],
    redeem_timeout: "default_redeem_timeout",
    lease: "default_lease",
    signature: "default_signature",
  };

  const response = await fetch("http://localhost:8080/ticket/handleticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to request ticket");
  }

  return response.json();
}

export async function getTicketsByNamespaceId(nsId: string): Promise<any> {
  const response = await fetch(`http://localhost:8080/ticket/getticket`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ namespace_id: nsId }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    return errorText;
  }

  return response.json();
}
export async function getTickets(): Promise<any[]> {
  const response = await fetch("http://localhost:8080/ticket/history", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch tickets");
  }

  return response.json();
}
