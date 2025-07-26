"use client";

import { Selection } from "@heroui/table";

import TicketTable from "./ticket-table";
import TicketTableDrawer from "./ticket-table-drawer";

type TicketTableClientProps = {
  columns?: { name: string; uid: string; sortable: boolean }[];
  // rows?: any[];
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
      // rows={rows}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
    />
  );
};

export default TicketTableClient;
