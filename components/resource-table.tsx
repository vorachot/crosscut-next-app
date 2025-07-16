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
    projectId: "project-1",
    namespaceId: "namespace-1",
    resourcePoolId: "resource-pool-1",
    name: "Group 1",
    created: "01 Jan 2023",
    usage: { cpu: 2, gpu: 2, memory: 4 },
  },
  {
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
    <Table removeWrapper color="primary">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => onRowClick?.(row)}
          >
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.created}</TableCell>
            <TableCell className="flex flex-row gap-4">
              <UsageBar label="CPU" maxValue={4} value={row.usage.cpu} />
              <UsageBar label="GPU" maxValue={4} value={row.usage.gpu} />
              <UsageBar label="Memory" maxValue={8} value={row.usage.memory} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResourceTable;
