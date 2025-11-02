import { Key } from "react";

import { UserTicketResponse } from "./ticket";
import { Status } from "./enum";

export type RequestTaskPayload = {
  title: string;
  tickets: Key[];
};

export type Task = {
  id: string;
  title: string;
  tickets: UserTicketResponse[];
  created_at: string;
  status: Status;
};
