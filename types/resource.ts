// types/resource.ts

import { Status } from "./enum";

export type Project = {
  id: string;
  name: string;
  namespaces: Namespace[];
};

export type Namespace = {
  id: string;
  name: string;
  resourcePools: ResourcePool[];
};

export type ResourcePool = {
  id: string;
  name: string;
  created: string;
  usage?: ResourceUsage;
  maxUsage?: ResourceUsage;
  tickets: Ticket[];
};

export type ResourceUsage = {
  cpu?: number;
  gpu?: number;
  memory?: number;
};

export type Ticket = {
  id: string;
  name: string;
  created: string;
  resourcePoolId: string;
  status: Status;
  usage: ResourceUsage;
};

export type Task = {
  id: string;
  name: string;
  created: string;
  ticketIds: string[];
  description?: string;
};
