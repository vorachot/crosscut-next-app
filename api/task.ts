import { RequestTaskPayload } from "@/types/task";
import apiClient from "@/utils/apiClient";

export async function createTask(taskReq: RequestTaskPayload): Promise<any> {
  const response = await apiClient.post(`/ticket/useTickets`, taskReq);

  if (response.status !== 200) {
    throw new Error("Failed to create task");
  }

  return response.data;
}

export async function getTasks(): Promise<any> {
  const response = await apiClient.get(`/ticket/tasks`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch tasks");
  }

  return response.data;
}

export async function stopTask(taskId: string): Promise<any> {
  const response = await apiClient.delete(`/ticket/stopTask/${taskId}`);

  if (response.status !== 200) {
    throw new Error("Failed to stop task");
  }

  return response.data;
}
