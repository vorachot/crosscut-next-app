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
import { ConfirmationNumber as TicketIcon } from "@mui/icons-material";

import Loading from "@/app/loading";
import { getTickets } from "@/api/ticket";
import { Ticket } from "@/types/resource";
import { getStatusLabel } from "@/utils/helper";

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
      <div className="text-center py-12">
        <TicketIcon className="!w-12 !h-12 mx-auto mb-4 text-gray-400" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No Available Tickets
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            You need to request a ticket before creating a task. Please request
            a ticket first to allocate resources.
          </p>
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
      // align="start"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {filteredTickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="text-xs">
              {ticket.id.slice(0, 7)}...
            </TableCell>
            <TableCell className="text-xs">
              {new Date(ticket.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="flex flex-wrap gap-2">
              <Chip color="primary" size="sm" variant="flat">
                CPU: {Number(ticket.spec[0].resource[0].quantity)}
              </Chip>
              <Chip color="secondary" size="sm" variant="flat">
                GPU: {Number(ticket.spec[0].resource[1].quantity)}
              </Chip>
              <Chip color="success" size="sm" variant="flat">
                MEM: {Number(ticket.spec[0].resource[2].quantity)}
              </Chip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketTableDrawer;
