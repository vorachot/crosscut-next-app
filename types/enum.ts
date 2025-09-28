export enum Status {
  ready = "AVAILABLE",
  cancelled = "CANCELLED",
  active = "RUNNING",
  succeeded = "SUCCEEDED",
  inactive = "STOPPED",
}
export enum ResourceType {
  cpu = "CPU",
  gpu = "GPU",
  memory = "MEMORY",
}
