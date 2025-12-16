// types/resource.ts

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
  node_id: string;
  node_name: string;
  organization_name: string;
  project_id: string;
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

export type ResourceUsage = {
  type_id: string;
  type: string;
  quota: number;
  usage: number;
};
