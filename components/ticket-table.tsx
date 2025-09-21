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
import { ConfirmationNumber as TicketIcon } from "@mui/icons-material";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";

import { ResourceType } from "@/types/enum";
import { Ticket } from "@/types/resource";
import Loading from "@/app/loading";
import { getTicketFromCH, getTickets } from "@/api/ticket";
import { formatDate, getStatusLabel } from "@/utils/helper";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "STARTED", uid: "started", sortable: true },
  { name: "ENDED", uid: "ended", sortable: true },
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
  nsId = "b8c138af-1c2a-47ca-ab5b-e3a78141446c",
}: TicketTableProps) => {
  const shouldFetchByNs = Boolean(nsId);

  const { data, error, isLoading } = useSWR(
    shouldFetchByNs ? ["tickets", nsId] : ["tickets-history"],
    () => (shouldFetchByNs ? getTicketFromCH(nsId!) : getTickets()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;

  const tickets: Ticket[] = data ?? [];

  if (tickets.length === 0) {
    return (
      <div className="h-[300px] flex flex-col justify-center items-center text-center opacity-50">
        <TicketIcon className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No Available Tickets
        </h3>
      </div>
    );
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
            <TableCell>{ticket.name}</TableCell>
            <TableCell>
              <StatusChip status={getStatusLabel(ticket.status)} />
            </TableCell>
            <TableCell>{formatDate(ticket.start_time)}</TableCell>
            <TableCell>{formatDate(ticket.end_time)}</TableCell>
            <TableCell className="flex flex-row gap-4">
              <ResourceChip type={ResourceType.cpu} value={0} />
              <ResourceChip type={ResourceType.gpu} value={0} />
              <ResourceChip type={ResourceType.memory} value={0} />
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
