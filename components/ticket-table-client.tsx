"use client";

import { Selection } from "@heroui/table";

import TicketTable from "./ticket-table";
import TicketTableDrawer from "./ticket-table-drawer";

type TicketTableClientProps = {
  columns?: { name: string; uid: string; sortable: boolean }[];
  // rows?: any[];
  nsId?: string;
  resourcePoolId?: string;
  isDrawer?: boolean;
  isResourcePool?: boolean;
  pathTemplate?: "resourcepool-to-ticket" | "ticket-to-resourcepool";
  selectionMode?: "multiple" | "single" | "none";
  selectionBehavior?: "replace" | "toggle";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection | string[]) => void;
  onAllTicketIds?: (ids: string[]) => void;
  statusFilter?: Selection;
  selectedTickets?: string[];
};

const TicketTableClient = ({
  columns,
  // rows,
  selectionMode = "none",
  selectionBehavior = "toggle",
  isDrawer = false,
  selectedKeys,
  onSelectionChange,
  nsId,
  resourcePoolId,
  isResourcePool = false,
  onAllTicketIds,
  statusFilter,
  selectedTickets,
}: TicketTableClientProps) => {
  return isDrawer ? (
    <TicketTableDrawer
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      onAllTicketIds={onAllTicketIds}
      onSelectionChange={onSelectionChange}
      columns={columns}
      // rows={rows}
      selectedKeys={selectedKeys}
    />
  ) : (
    <TicketTable
      columns={columns}
      isResourcePool={isResourcePool}
      nsId={nsId}
      resourcePoolId={resourcePoolId}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      statusFilter={statusFilter}
      selectedTickets={selectedTickets}
      onSelectionChange={onSelectionChange as (tickets: string[]) => void}
    />
  );
};

export default TicketTableClient;
