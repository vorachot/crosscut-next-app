import { RequestTicketPayload } from "@/types/payload";
import apiClient from "@/utils/apiClient";

export async function getTicketByNamespaceId(nsId: string): Promise<any> {
  const response = await apiClient.get(`/ticket/getTickets/${nsId}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch ticket by namespace ID");
  }

  return response.data;
}
export async function getUserTickets(): Promise<any> {
  const response = await apiClient.get(`/ticket/getUserTickets`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch user tickets");
  }

  return response.data;
}
export async function requestTicketToCH(
  ticketPayload: RequestTicketPayload,
): Promise<any> {
  const response = await apiClient.post(
    `/ticket/requestTicketToCH`,
    ticketPayload,
  );

  if (!(response.status >= 200 && response.status < 300)) {
    throw new Error("Failed to request ticket");
  }

  return response.data;
}
export async function cancelTicket(ticketId: string): Promise<any> {
  const response = await apiClient.get(`/ticket/cancelTicket/${ticketId}`);

  if (response.status !== 200) {
    throw new Error("Failed to cancel ticket");
  }

  return response.data;
}

export async function deleteTickets(ticketIds: string[]): Promise<any> {
  const response = await apiClient.patch(`/ticket/delete`, {
    ticket_ids: ticketIds,
  });

  if (response.status !== 200) {
    throw new Error("Failed to delete tickets");
  }

  return response.data;
}
