import { Key } from "react";

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
