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
import useSWR from "swr";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { MoreVert } from "@mui/icons-material";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";

import { ResourceType } from "@/types/enum";
import { Ticket } from "@/types/resource";
import Loading from "@/app/loading";
import { getTickets, getTicketsByNamespaceId } from "@/api/ticket";
import { formatDate, getStatusLabel } from "@/utils/helper";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: true },
  { name: "ACTIONS", uid: "actions", sortable: false },
];

type TicketTableProps = {
  nsId?: string;
  columns?: typeof defaultColumns;
  selectionMode?: "multiple" | "single" | "none";
  selectionBehavior?: "replace" | "toggle";
  // onRowClick?: (row: (typeof defaultRows)[number]) => void;
};

const TicketTable = ({
  columns = defaultColumns,
  selectionMode = "none",
  selectionBehavior = "replace",
  nsId,
}: TicketTableProps) => {
  const shouldFetchByNs = Boolean(nsId);

  const { data, error, isLoading } = useSWR(
    shouldFetchByNs ? ["tickets", nsId] : ["tickets-history"],
    () => (shouldFetchByNs ? getTicketsByNamespaceId(nsId!) : getTickets()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;

  const tickets: Ticket[] = data?.tickets ?? [];

  if (tickets.length === 0) {
    return <div className="text-gray-500">No tickets available</div>;
  }

  return (
    <Table
      // align="start"
      removeWrapper
      aria-label="Ticket Table"
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
    >
      <TableHeader className="bg-gray-100 dark:bg-gray-700">
        {columns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {tickets.map((ticket, index) => (
          <TableRow
            key={index}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200"
          >
            <TableCell>{ticket.id}</TableCell>
            <TableCell>
              <StatusChip status={getStatusLabel(ticket.status)} />
            </TableCell>
            <TableCell>{formatDate(ticket.created_at)}</TableCell>
            <TableCell className="flex flex-row gap-4">
              <ResourceChip
                type={ResourceType.cpu}
                value={Number(ticket.spec[0].resource[0].quantity)}
              />
              <ResourceChip
                type={ResourceType.gpu}
                value={Number(ticket.spec[0].resource[1].quantity)}
              />
              <ResourceChip
                type={ResourceType.memory}
                value={Number(ticket.spec[0].resource[2].quantity)}
              />
            </TableCell>
            <TableCell>
              <div className="relative flex gap-2">
                <Dropdown className="dark:bg-gray-900">
                  <DropdownTrigger className="!w-9 !h-9">
                    <Button className="hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200 rounded-full">
                      <MoreVert />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="view">View</DropdownItem>
                    <DropdownItem key="edit">Edit</DropdownItem>
                    <DropdownItem key="delete">Delete</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketTable;
