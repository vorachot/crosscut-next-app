"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

import UsageBar from "./usagebar";

import { Namespace, Quota } from "@/types/resource";

const defaultColumns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

type ResourcePoolTableProps = {
  rows?: (Namespace | Quota)[];
  onRowClick?: (row: any) => void;
};

const ResourcePoolTable = ({
  rows = [],
  onRowClick,
}: ResourcePoolTableProps) => {
  return (
    <Table removeWrapper aria-label="Resource Usage Table" color="primary">
      <TableHeader>
        {defaultColumns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={index}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200"
            style={{ cursor: "pointer" }}
            onClick={() => onRowClick?.(row)}
          >
            <TableCell>{row.name}</TableCell>
            <TableCell>13 Jan 2022</TableCell>
            <TableCell className="flex flex-row gap-4">
              <UsageBar label="CPU" maxValue={4} value={2} />
              <UsageBar label="GPU" maxValue={4} value={2} />
              <UsageBar label="Memory" maxValue={8} value={4} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResourcePoolTable;
