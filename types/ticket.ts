export type UserTicketResponse = {
  id: string;
  name: string;
  ticket: GliderTicket;
  signature: string;
  status: string;
  url?: string;
  password?: string;
  owner_name: string;
};
type GliderTicket = {
  id: string;
  namespace_urn: string;
  namespace_name: string;
  project_urn: string;
  project_name: string;
  glidelet_urn: string;
  glidelet_name: string;
  organization_name: string;
  spec: GliderSpec;
  reference_ticket_id: string;
  redeem_timeout: number;
  lease: number;
  created_at: string;
};
type GliderSpec = {
  type: string;
  pool_id: string;
  resource: SpecResource[];
};
export type SpecResource = {
  resource_id: string;
  name: string;
  quantity: number;
  unit: string;
};
