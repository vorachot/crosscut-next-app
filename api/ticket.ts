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
