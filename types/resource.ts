// types/resource.ts

import { Key } from "react";

export type Namespace = {
  id: string;
  name: string;
  description: string;
  credit: number;
  project_id: string;
  quotas: Quota[];
  namespace_members: any;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  organization_id: string;
  // namespaces: Namespace[];
  // quotas: Quota[];
  // project_members: any[];
  // project_admins: any[];
};

export type Quota = {
  id: string;
  name: string;
  description: string;
  project_id: string;
  project_quota_id: string;
  resource_pool_id: string;
  resources: Resource[];
};

type Resource = {
  id: string;
  namespace_quota_id: string;
  quantity: number;
  resource_property_id: string;
  resource_prop: ResourceProp;
};

type ResourceProp = {
  id: string;
  resource_id: string;
  price: number;
  max_duration: number;
};

export type ResourceDetail = {
  id: string;
  name: string;
  quantity: number;
  resource_type_id: string;
  resource_type: ResourceType;
  resource_pool_id: string;
};

type ResourceType = {
  id: string;
  name: string;
  unit: string;
};

type TicketResource = {
  resource_id: string;
  quantity: number;
};

export type Ticket = {
  id: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  owner_id: string;
  namespace_id: string;
  resource_pool_id: string;
  quota_id: string;
  resources: TicketResource[];
};

export type ResourceUsage = {
  type_id: string;
  type: string;
  quota: number;
  usage: number;
};

// export type Namespace = {
//   id: string;
//   name: string;
//   resourcePools: ResourcePool[];
// };

// export type ResourcePool = {
//   id: string;
//   name: string;
//   created: string;
//   usage?: ResourceUsage;
//   maxUsage?: ResourceUsage;
//   tickets: Ticket[];
// };

// export type ResourceUsage = {
//   cpu?: number;
//   gpu?: number;
//   memory?: number;
// };

// type Spec = {
//   id: string;
//   type: string;
//   pool_id: string;
//   resource: Resource[];
// };

// export type Ticket = {
//   id: string;
//   user_id: string;
//   spec: Spec[];
//   reference_ticket_id: string;
//   redeem_timeout: string;
//   lease: string;
//   signature: string;
//   status: Status;
//   created_at: string;
//   updated_at: string;
// };
// export type Ticket = {
//   id: string;
//   name: string;
//   created: string;
//   resourcePoolId: string;
//   status: Status;
//   usage: ResourceUsage;
// };
export type TaskReq = {
  title: string;
  description?: string;
  tickets: Key[];
};

// export type Task = {
//   id: string;
//   name: string;
//   created: string;
//   ticketIds: string[];
//   description?: string;
// };
