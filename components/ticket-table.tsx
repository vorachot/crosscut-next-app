"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@chakra-ui/react";
import { PlaylistAdd } from "@mui/icons-material";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";

import { ResourceType, Status } from "@/types/enum";
import { Ticket } from "@/types/resource";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: true },
  { name: "ACTION", uid: "action", sortable: false },
];

const defaultRows: Ticket[] = [
  {
    id: "ticket-1",
    name: "Ticket 2",
    created: "02 Jan 2023",
    resourcePoolId: "resource-pool-2",
    status: Status.succeeded,
    usage: { cpu: 1, gpu: 0, memory: 2 },
  },
  {
    id: "ticket-2",
    name: "Ticket 1",
    created: "01 Jan 2023",
    resourcePoolId: "resource-pool-1",
    status: Status.running,
    usage: { cpu: 2, gpu: 1, memory: 4 },
  },
  {
    id: "ticket-3",
    name: "Ticket 2",
    created: "02 Jan 2023",
    resourcePoolId: "resource-pool-2",
    status: Status.available,
    usage: { cpu: 1, gpu: 0, memory: 2 },
  },
];

type TicketTableProps = {
  columns?: typeof defaultColumns;
  rows?: typeof defaultRows;
  selectionMode?: "multiple" | "single" | "none";
  selectionBehavior?: "replace" | "toggle";
  onRowClick?: (row: (typeof defaultRows)[number]) => void;
};

const TicketTable = ({
  columns = defaultColumns,
  rows = defaultRows,
  selectionMode = "none",
  selectionBehavior = "replace",
}: TicketTableProps) => {
  return (
    <Table
      // align="start"
      removeWrapper
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
    >
      <TableHeader className="bg-gray-100 dark:bg-gray-700">
        {columns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.name}</TableCell>
            <TableCell>
              <StatusChip status={row.status} />
            </TableCell>
            <TableCell>{row.created}</TableCell>
            <TableCell className="flex flex-row gap-4">
              <ResourceChip type={ResourceType.cpu} value={row.usage.cpu} />
              <ResourceChip type={ResourceType.gpu} value={row.usage.gpu} />
              <ResourceChip
                type={ResourceType.memory}
                value={row.usage.memory}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => alert(`Action on ${row.name}`)}
              >
                <PlaylistAdd className="!w-6 !h-6" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketTable;
