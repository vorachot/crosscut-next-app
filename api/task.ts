import { Key } from "react";

export async function createTask(ticketIds: Key[]): Promise<any> {
  const response = await fetch("http://localhost:8080/ticket/useTickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(ticketIds),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to create task");
  }

  return response.json();
}

export async function getTasks(): Promise<any> {
  const response = await fetch("http://localhost:8080/ticket/tasks", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch tasks");
  }

  return response.json();
}
