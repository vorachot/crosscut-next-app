export type UserTicketResponse = {
  id: string;
  name: string;
  ticket: GliderTicket;
  signature: string;
  status: string;
};
type GliderTicket = {
  id: string;
  namespace_urn: string;
  glidelet_urn: string;
  spec: GliderSpec;
  reference_ticket_id: string;
  redeem_timeout: number;
  lease: number;
  created_at: string;
};
type GliderSpec = {
  type: string;
  pool_id: string;
  resources: SpecResource[];
};
type SpecResource = {
  resource_id: string;
  name: string;
  quantity: number;
  unit: string;
};
