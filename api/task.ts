import { TaskReq } from "@/types/task";

export async function createTask(taskReq: TaskReq): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/useTickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(taskReq),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to create task");
  }

  return response.json();
}

export async function getTasks(): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/tasks`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to fetch tasks");
  }

  return response.json();
}

export async function stopTask(taskId: string): Promise<any> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NAMESPACE_MANAGER_URL}/ticket/stopTask`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ task_id: taskId }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to stop task");
  }

  return response.json();
}
