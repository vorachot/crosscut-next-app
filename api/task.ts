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
