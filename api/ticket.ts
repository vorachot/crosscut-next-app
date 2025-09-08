import { RequestTicketPayload } from "@/types/payload";

// export async function requestTicket(
//   payload: RequestTicketPayload,
// ): Promise<any> {
//   const response = await fetch("http://localhost:8080/ticket/handleticket", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     body: JSON.stringify(payload),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();

//     throw new Error(errorText || "Failed to request ticket");
//   }

//   return response.json();
// }

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
export async function getTickets(): Promise<any> {
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

export async function createTicketToCH(
  ticketPayload: RequestTicketPayload,
): Promise<any> {
  const response = await fetch("http://localhost:8090/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(ticketPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to create ticket");
  }

  return response.json();
}
