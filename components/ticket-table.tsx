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
import { useState } from "react";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";
import CancelTicketDialog from "./cancel-ticket-dialog";

import { ResourceType } from "@/types/enum";
import Loading from "@/app/loading";
import { getTicketByNamespaceId, getUserTickets } from "@/api/ticket";
import { formatDate, getDisplayName, getStatusLabel } from "@/utils/helper";
import { UserTicketResponse } from "@/types/ticket";
import { useBreadcrumb } from "@/context/BreadCrumbContext";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "NAMESPACE", uid: "namespace", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: true },
  { name: "", uid: "actions", sortable: false },
];

type TicketTableProps = {
  nsId?: string;
  resourcePoolId?: string;
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
  resourcePoolId,
}: TicketTableProps) => {
  const shouldFetchByNs = Boolean(nsId);
  const { breadcrumbData } = useBreadcrumb();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<UserTicketResponse | null>(null);

  const handleCancelClick = (ticket: UserTicketResponse) => {
    setSelectedTicket(ticket);
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedTicket(null);
  };

  const { data, error, isLoading } = useSWR(
    shouldFetchByNs ? ["tickets", nsId] : ["tickets-history"],
    () => (shouldFetchByNs ? getTicketByNamespaceId(nsId!) : getUserTickets()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;

  const tickets: UserTicketResponse[] = data ?? [];

  tickets.sort((a, b) => {
    return (
      new Date(b.ticket.created_at).getTime() -
      new Date(a.ticket.created_at).getTime()
    );
  });

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
    <>
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
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.ticket.id}
              className="dark:border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200"
            >
              <TableCell>{ticket.name}</TableCell>
              <TableCell>
                {getDisplayName(ticket.ticket.namespace_urn, breadcrumbData)}
              </TableCell>
              <TableCell>
                <StatusChip status={getStatusLabel(ticket.status)} />
              </TableCell>
              <TableCell>{formatDate(ticket.ticket.created_at)}</TableCell>
              <TableCell className="flex flex-row gap-4 items-center">
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
                      <DropdownItem
                        key="cancel"
                        onPress={() => handleCancelClick(ticket)}
                      >
                        Cancel
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CancelTicketDialog
        nsId={nsId!}
        open={cancelDialogOpen}
        resourcePoolId={resourcePoolId!}
        setOnClose={handleCancelDialogClose}
        ticketId={selectedTicket?.ticket.id!}
      />
    </>
  );
};

export default TicketTable;
