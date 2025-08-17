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
import { Selection } from "@heroui/table";
import useSWR from "swr";

import Loading from "@/app/loading";
import { getTickets } from "@/api/ticket";
import { Ticket } from "@/types/resource";
import { getStatusLabel } from "@/types/enum";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  // { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: true },
];

type TicketTableProps = {
  columns?: typeof defaultColumns;
  // rows?: typeof defaultRows;
  selectionMode?: "multiple" | "single" | "none";
  selectionBehavior?: "replace" | "toggle";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  // onRowClick?: (row: (typeof defaultRows)[number]) => void;
};

const TicketTableDrawer = ({
  columns = defaultColumns,
  // rows = defaultRows,
  selectionMode = "none",
  selectionBehavior = "replace",
  selectedKeys,
  onSelectionChange,
}: TicketTableProps) => {
  const { data, error, isLoading } = useSWR(["tickets-history"], getTickets, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;
  const tickets: Ticket[] = data?.tickets ?? [];
  const filteredTickets = tickets.filter(
    (ticket) => getStatusLabel(ticket.status) === "AVAILABLE",
  );

  if (filteredTickets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No tickets available</div>
        <div className="text-sm text-amber-600 dark:text-amber-400">
          You need to request a ticket before creating a task. Please request a
          ticket first to allocate resources.
        </div>
      </div>
    );
  }

  return (
    <Table
      isHeaderSticky
      removeWrapper
      color="primary"
      selectedKeys={selectedKeys}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
      // // align="start"
    >
      <TableHeader className="bg-gray-100 dark:bg-gray-700">
        {columns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {filteredTickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>20 Jan 2023</TableCell>
            <TableCell className="flex flex-row gap-4">
              <Chip>CPU: {Number(ticket.spec[0].resource[0].quantity)}</Chip>
              <Chip>GPU: {Number(ticket.spec[0].resource[1].quantity)}</Chip>
              <Chip>MEM: {Number(ticket.spec[0].resource[2].quantity)}</Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketTableDrawer;
