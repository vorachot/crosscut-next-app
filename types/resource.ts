// types/resource.ts

import { Status } from "./enum";

export type Namespace = {
  id: string;
  urn: string;
  project: string;
  priority: number;
  quota: number;
  resource_unit_urn: string;
};

export type Project = {
  id: string;
  name: string;
  namespaces: Namespace[];
};

// export type Namespace = {
//   id: string;
//   name: string;
//   resourcePools: ResourcePool[];
// };

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

type Resource = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
};

type Spec = {
  id: string;
  type: string;
  pool_id: string;
  resource: Resource[];
};

export type Ticket = {
  id: string;
  user_id: string;
  spec: Spec[];
  reference_ticket_id: string;
  redeem_timeout: string;
  lease: string;
  signature: string;
  status: Status;
};
// export type Ticket = {
//   id: string;
//   name: string;
//   created: string;
//   resourcePoolId: string;
//   status: Status;
//   usage: ResourceUsage;
// };

export type Task = {
  id: string;
  name: string;
  created: string;
  ticketIds: string[];
  description?: string;
};
