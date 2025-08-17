export enum Status {
  ready = "AVAILABLE",
  active = "RUNNING",
  succeeded = "SUCCEEDED",
  inactive = "STOPPED",
}
export enum ResourceType {
  cpu = "CPU",
  gpu = "GPU",
  memory = "MEMORY",
}
export function getStatusLabel(status: string) {
  return Status[status as keyof typeof Status] ?? status;
}
