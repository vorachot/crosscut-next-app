import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import useSWR from "swr";
import { TollRounded } from "@mui/icons-material";

import UsageBar from "./usagebar";

import { Namespace } from "@/types/resource";
import Loading from "@/app/loading";
import { getNamespaceUsageByNamespaceIdFromCH } from "@/api/namespace";

type NamespaceUsageResponse = {
  namespaceUsage: {
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
  // { name: "DESCRIPTION", uid: "description", sortable: true },
  { name: "CREDIT", uid: "credit", sortable: true },
  // { name: "CREATED", uid: "created", sortable: true },
  { name: "RESOURCE USAGE", uid: "usage", sortable: true },
];

type NamespaceResourceTableProps = {
  rows?: Namespace[];
  onRowClick?: (row: any) => void;
};

const NamespaceResourceTable = ({
  rows = [],
  onRowClick,
}: NamespaceResourceTableProps) => {
  // fetch usage ของทุก namespace พร้อมกัน
  const { data, error, isLoading } = useSWR(
    rows.length > 0 ? ["namespace-usage-list", rows.map((r) => r.id)] : null,
    async ([, namespaceIds]) => {
      // fetch ทีละ namespace
      const results = await Promise.all(
        namespaceIds.map((nsId: string) =>
          getNamespaceUsageByNamespaceIdFromCH(nsId).then((res) => ({
            nsId,
            usage: res.namespaceUsage.usage,
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

  // สร้าง map: { namespaceId -> usage[] }
  const usageMap: Record<
    string,
    NamespaceUsageResponse["namespaceUsage"]["usage"]
  > = {};

  data?.forEach((item: any) => {
    usageMap[item.nsId] = item.usage;
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
              {/* <TableCell>{row.description}</TableCell> */}
              <TableCell>
                <div className="flex items-center">
                  <TollRounded className="inline-block mr-1 mb-0.5 !w-4 !h-4" />
                  {row.credit}
                </div>
              </TableCell>
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
                  label="RAM"
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

export default NamespaceResourceTable;
