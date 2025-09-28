import { RequestTicketPayload } from "@/types/payload";

export async function getTicketByNamespaceId(nsId: string): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/getTickets/${nsId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch ticket");
  }

  return response.json();
}
export async function getUserTickets(): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/getUserTickets`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch user tickets");
  }

  return response.json();
}
export async function requestTicketToCH(
  ticketPayload: RequestTicketPayload,
): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/requestTicketToCH`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(ticketPayload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to create ticket");
  }

  return response.json();
}
export async function cancelTicket(ticketId: string): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/cancelTicket/${ticketId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to cancel ticket");
  }

  return response.json();
}
