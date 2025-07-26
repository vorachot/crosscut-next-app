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

const defaultColumns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

const defaultRows = [
  {
    id: "bc1f5d2b-8e3a-4c0b-9f6e-7d8e9f0a1b2c",
    projectId: "project-1",
    namespaceId: "namespace-1",
    resourcePoolId: "resource-pool-1",
    name: "Group 1",
    created: "01 Jan 2023",
    usage: { cpu: 2, gpu: 2, memory: 4 },
  },
  {
    id: "ac48513-9f92-4c75-8218-9f53193918c7",
    projectId: "project-1",
    namespaceId: "namespace-2",
    resourcePoolId: "resource-pool-2",
    name: "Group 2",
    created: "01 Jan 2023",
    usage: { cpu: 2, gpu: 1, memory: 2 },
  },
];

type ResourceTableProps = {
  columns?: typeof defaultColumns;
  rows?: typeof defaultRows;
  onRowClick?: (row: (typeof defaultRows)[number]) => void;
};

const ResourceTable = ({
  columns = defaultColumns,
  rows = defaultRows,
  onRowClick,
}: ResourceTableProps) => {
  return (
    <Table removeWrapper aria-label="Resource Usage Table" color="primary">
      <TableHeader>
        {columns.map((column) => (
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
            <TableCell>{row.id}</TableCell>
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

export default ResourceTable;
