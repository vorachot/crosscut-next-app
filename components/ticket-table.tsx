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
import useSWR from "swr";
import { useState, useEffect } from "react";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";

import { getStatusLabel, ResourceType } from "@/types/enum";
import { Ticket } from "@/types/resource";
import Loading from "@/app/loading";
import { getTicketsByNamespaceId } from "@/api/ticket";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: true },
  { name: "ACTION", uid: "action", sortable: false },
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
  nsId = "7fd1b94e-f17d-4a07-9802-d635e3b52b3e",
}: TicketTableProps) => {
  const [debouncedNsId, setDebouncedNsId] = useState(nsId);
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);

  // Debounce the nsId to prevent rapid API calls
  useEffect(() => {
    setIsDelayedLoading(true);
    const timer = setTimeout(() => {
      setDebouncedNsId(nsId);
      setIsDelayedLoading(false);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [nsId]);

  const { data, error, isLoading } = useSWR(
    ["tickets", debouncedNsId],
    () => getTicketsByNamespaceId(debouncedNsId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  const showLoading = isLoading || isDelayedLoading;

  if (showLoading) return <Loading />;
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
          <TableRow key={index}>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>
              <StatusChip status={getStatusLabel(ticket.status)} />
            </TableCell>
            <TableCell>
              {new Date(ticket.created_at).toLocaleDateString()}
            </TableCell>
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
              <Button
                variant="outline"
                onClick={() => alert(`Action on ${ticket.id}`)}
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
