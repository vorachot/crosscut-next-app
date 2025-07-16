"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@chakra-ui/react";

import { TicketStatus } from "@/types/enum";
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
    name: "Ticket 1",
    created: "01 Jan 2023",
    resourcePoolId: "resource-pool-1",
    status: TicketStatus.running,
    usage: { cpu: 2, gpu: 1, memory: 4 },
  },
  {
    id: "ticket-2",
    name: "Ticket 2",
    created: "02 Jan 2023",
    resourcePoolId: "resource-pool-2",
    status: TicketStatus.running,
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
              <Chip
                className={`status-${row.status}`}
                color="primary"
                variant="flat"
              >
                {row.status}
              </Chip>
            </TableCell>
            <TableCell>{row.created}</TableCell>
            <TableCell className="flex flex-row gap-4">
              <Chip>CPU: {row.usage.cpu}</Chip>
              <Chip>GPU: {row.usage.gpu}</Chip>
              <Chip>MEM: {row.usage.memory}</Chip>
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => alert(`Action on ${row.name}`)}
              >
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketTable;
