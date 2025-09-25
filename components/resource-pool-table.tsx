"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import useSWR from "swr";
import { useParams } from "next/navigation";

import UsageBar from "./usagebar";

import { Namespace, Quota } from "@/types/resource";
import { getQuotaUsageByNamespaceIdFromCH } from "@/api/quota";
import Loading from "@/app/loading";

type QuotaUsageResponse = {
  quotaUsage: {
    usage: {
      type_id: string;
      type: string;
      quota: number;
      usage: number;
    }[];
  };
};

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
  const nsId = useParams().namespaceId as string;
  const { data, error, isLoading } = useSWR(
    rows.length > 0 ? ["quota-usage-list", rows.map((r) => r.id)] : null,
    async ([, quotaIds]) => {
      // fetch ทีละ quota
      const results = await Promise.all(
        quotaIds.map((quotaId: string) =>
          getQuotaUsageByNamespaceIdFromCH(quotaId, nsId).then((res) => ({
            quotaId,
            usage: res.quotaUsage.usage,
          })),
        ),
      );

      return results;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading usage</div>;

  // สร้าง map: { quotaId -> usage[] }
  const usageMap: Record<string, QuotaUsageResponse["quotaUsage"]["usage"]> =
    {};

  data?.forEach((item: any) => {
    usageMap[item.quotaId] = item.usage;
  });

  return (
    <Table removeWrapper aria-label="Resource Usage Table" color="primary">
      <TableHeader>
        {defaultColumns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const usage = usageMap[row.id] || [];
          const cpu = usage.find((u) => u.type === "CPU");
          const gpu = usage.find((u) => u.type === "GPU");
          const ram = usage.find((u) => u.type === "RAM");

          return (
            <TableRow
              key={row.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200"
              style={{ cursor: "pointer" }}
              onClick={() => onRowClick?.(row)}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>13 Jan 2022</TableCell>
              <TableCell className="flex flex-row gap-4">
                <UsageBar
                  label="CPU"
                  maxValue={cpu?.quota ?? 0}
                  value={cpu?.usage ?? 0}
                />
                <UsageBar
                  label="GPU"
                  maxValue={gpu?.quota ?? 0}
                  value={gpu?.usage ?? 0}
                />
                <UsageBar
                  label="Memory"
                  maxValue={ram?.quota ?? 0}
                  value={ram?.usage ?? 0}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ResourcePoolTable;
