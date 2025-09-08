export type RequestTicketPayload = {
  name: string;
  namespace_id: string;
  quota_id: string;
  resources: ResourceRequestPayload[];
  duration: number;
};

export type ResourceRequestPayload = {
  quantity: number;
  resource_id: string;
};
