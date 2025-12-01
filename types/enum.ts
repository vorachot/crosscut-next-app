export enum Status {
  ready = "AVAILABLE",
  cancelled = "CANCELLED",
  failed = "FAILED",
  pending = "PENDING",
  redeemed = "RUNNING",
  expired = "SUCCEEDED",
  stopped = "STOPPED",
}
export enum ResourceType {
  cpu = "CPU",
  gpu = "GPU",
  memory = "RAM",
}
