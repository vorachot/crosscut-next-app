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
  pathTemplate?: "resourcepool-to-ticket" | "ticket-to-resourcepool";
  selectionMode?: "multiple" | "single" | "none";
  selectionBehavior?: "replace" | "toggle";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
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
}: TicketTableClientProps) => {
  return isDrawer ? (
    <TicketTableDrawer
      columns={columns}
      // rows={rows}
      selectedKeys={selectedKeys}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
    />
  ) : (
    <TicketTable
      columns={columns}
      nsId={nsId}
      resourcePoolId={resourcePoolId}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
    />
  );
};

export default TicketTableClient;
