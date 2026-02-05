"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Selection,
} from "@heroui/table";
import useSWR, { mutate } from "swr";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { MoreVert } from "@mui/icons-material";
import { ConfirmationNumber as TicketIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import StatusChip from "./status-chip";
import ResourceChip from "./resource-chip";
import CancelTicketDialog from "./cancel-ticket-dialog";

import { ResourceType, Status } from "@/types/enum";
import { deleteTickets } from "@/api/ticket";
import Loading from "@/app/loading";
import { getTicketByNamespaceId, getUserTickets } from "@/api/ticket";
import { formatDate, getStatusLabel } from "@/utils/helper";
import { UserTicketResponse } from "@/types/ticket";
import { getResourceDetailByResourceIdFromCH } from "@/api/resource";
import { ResourceDetail } from "@/types/resource";
import { getCachedOrFetch } from "@/utils/resourceCache";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "PROJECT", uid: "project", sortable: true },
  { name: "NAMESPACE", uid: "namespace", sortable: true },
  { name: "NODE", uid: "node", sortable: true },
  { name: "ORGANIZATION", uid: "organization", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: false },
  { name: "", uid: "actions", sortable: false },
];

const resourcePoolColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  { name: "OWNER", uid: "owner", sortable: true },
  { name: "NODE", uid: "node", sortable: true },
  { name: "ORGANIZATION", uid: "organization", sortable: true },
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
  isResourcePool?: boolean;
  statusFilter?: Selection;
  selectedTickets?: string[];
  onSelectionChange?: (tickets: string[]) => void;
  // onRowClick?: (row: (typeof defaultRows)[number]) => void;
};

const TicketTable = ({
  columns,
  selectionMode = "none",
  selectionBehavior = "replace",
  nsId,
  resourcePoolId,
  isResourcePool = false,
  statusFilter,
  selectedTickets = [],
  onSelectionChange,
}: TicketTableProps) => {
  const shouldFetchByNs = Boolean(nsId);

  // Use appropriate columns based on isResourcePool prop
  const tableColumns =
    columns || (isResourcePool ? resourcePoolColumns : defaultColumns);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<UserTicketResponse | null>(null);
  const [ticketsWithResourceDetails, setTicketsWithResourceDetails] = useState<
    any[]
  >([]);
  const [resourceDetailsLoading, setResourceDetailsLoading] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({ column: "created", direction: "descending" });

  const handleCancelClick = (ticket: UserTicketResponse) => {
    setSelectedTicket(ticket);
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = async () => {
    setCancelDialogOpen(false);
    setSelectedTicket(null);
    // Refresh ticket data after cancel
    await mutate(shouldFetchByNs ? ["tickets", nsId] : ["tickets-history"]);
  };

  const { data, error, isLoading } = useSWR(
    shouldFetchByNs ? ["tickets", nsId] : ["tickets-history"],
    () => (shouldFetchByNs ? getTicketByNamespaceId(nsId!) : getUserTickets()),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  useEffect(() => {
    const fetchResourceDetailsForTickets = async () => {
      if (!data || data.length === 0) return;

      setResourceDetailsLoading(true);
      try {
        const ticketsWithDetails = await Promise.all(
          data.map(async (ticket: UserTicketResponse) => {
            if (
              !ticket.ticket.spec.resource ||
              ticket.ticket.spec.resource.length === 0
            ) {
              return { ...ticket, resourceDetails: [] };
            }

            const resourceDetails = await Promise.all(
              ticket.ticket.spec.resource.map((resource) =>
                getCachedOrFetch(resource.resource_id, () =>
                  getResourceDetailByResourceIdFromCH(resource.resource_id),
                ),
              ),
            );

            const resourcesWithDetails = ticket.ticket.spec.resource.map(
              (resource, i) => ({
                ...resource,
                detail: resourceDetails[i],
              }),
            );

            return { ...ticket, resourceDetails: resourcesWithDetails };
          }),
        );

        setTicketsWithResourceDetails(ticketsWithDetails);
      } catch (error) {
        toast.error("Error fetching resource details:" + error);
        setTicketsWithResourceDetails(data || []);
      } finally {
        setResourceDetailsLoading(false);
      }
    };

    fetchResourceDetailsForTickets();
  }, [data]);

  const getResourceValueByType = (
    resourceDetails: any[],
    resourceType: ResourceType,
  ) => {
    if (!resourceDetails || resourceDetails.length === 0) return 0;

    return resourceDetails.reduce((sum, resource) => {
      const resourceTypeName = resource.detail?.resource?.resource_type?.name;

      if (!resourceTypeName) return sum;

      // More robust type matching
      const normalizedResourceType = resourceTypeName.toLowerCase().trim();
      const normalizedTargetType = resourceType.toLowerCase().trim();

      if (normalizedResourceType === normalizedTargetType) {
        return sum + (resource.quantity || 0);
      }

      return sum;
    }, 0);
  };

  // Add helper to check if any resources exist
  const hasAnyResources = (ticket: any) => {
    if (!ticket.resourceDetails || ticket.resourceDetails.length === 0)
      return false;

    const totalResources = [
      ResourceType.cpu,
      ResourceType.gpu,
      ResourceType.memory,
    ].reduce(
      (sum, type) => sum + getResourceValueByType(ticket.resourceDetails, type),
      0,
    );

    return totalResources > 0;
  };

  const renderResourceUsageCell = (ticket: any) => (
    <TableCell className="min-w-0">
      <div className="flex gap-1 items-center">
        {resourceDetailsLoading ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : !hasAnyResources(ticket) ? (
          <span className="text-sm text-gray-500">No resources</span>
        ) : (
          <>
            {getResourceValueByType(
              ticket.resourceDetails || [],
              ResourceType.cpu,
            ) > 0 && (
              <ResourceChip
                size="sm"
                type={ResourceType.cpu}
                value={getResourceValueByType(
                  ticket.resourceDetails || [],
                  ResourceType.cpu,
                )}
              />
            )}
            {getResourceValueByType(
              ticket.resourceDetails || [],
              ResourceType.gpu,
            ) > 0 && (
              <ResourceChip
                size="sm"
                type={ResourceType.gpu}
                value={getResourceValueByType(
                  ticket.resourceDetails || [],
                  ResourceType.gpu,
                )}
              />
            )}
            {getResourceValueByType(
              ticket.resourceDetails || [],
              ResourceType.memory,
            ) > 0 && (
              <ResourceChip
                size="sm"
                type={ResourceType.memory}
                value={getResourceValueByType(
                  ticket.resourceDetails || [],
                  ResourceType.memory,
                )}
              />
            )}
          </>
        )}
      </div>
    </TableCell>
  );

  const isDeletable = (status: string) => {
    const deletableStatuses = [
      Status.stopped,
      Status.expired,
      Status.failed,
      Status.cancelled,
    ];
    const mappedStatus = getStatusLabel(status);
    return deletableStatuses.includes(mappedStatus);
  };

  const handleDeleteClick = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) {
      return;
    }
    try {
      await deleteTickets([ticketId]);
      toast.success("Ticket deleted successfully");
      // Refresh ticket data
      await mutate(shouldFetchByNs ? ["tickets", nsId] : ["tickets-history"]);
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const renderActionsCell = (ticket: UserTicketResponse) => (
    <TableCell>
      <div className="relative flex gap-2">
        <Dropdown className="dark:bg-gray-900">
          <DropdownTrigger className="!w-9 !h-9">
            <div className="hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer">
              <MoreVert />
            </div>
          </DropdownTrigger>
          <DropdownMenu
            disabledKeys={!isDeletable(ticket.status) ? ["delete"] : []}
          >
            <DropdownItem
              key="cancel"
              onPress={() => handleCancelClick(ticket)}
            >
              Cancel
            </DropdownItem>
            <DropdownItem
              key="delete"
              onPress={() => handleDeleteClick(ticket.id)}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </TableCell>
  );

  const renderTableRow = (
    ticket: UserTicketResponse & { resourceDetails: ResourceDetail[] },
  ) => {
    if (isResourcePool) {
      return (
        <TableRow
          key={ticket.id}
          className="dark:border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200"
        >
          <TableCell
            className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
            title={ticket.name}
          >
            {ticket.name}
          </TableCell>
          <TableCell
            className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
            title={ticket.owner_name}
          >
            {ticket.owner_name || "N/A"}
          </TableCell>
          <TableCell
            className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
            title={ticket.ticket.node_name}
          >
            {ticket.ticket.node_name || "N/A"}
          </TableCell>
          <TableCell
            className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
            title={ticket.ticket.organization_name}
          >
            {ticket.ticket.organization_name || "N/A"}
          </TableCell>
          <TableCell>
            <StatusChip status={getStatusLabel(ticket.status)} />
          </TableCell>
          <TableCell className="whitespace-nowrap text-sm">
            {formatDate(ticket.ticket.created_at)}
          </TableCell>
          {renderResourceUsageCell(ticket)}
          {renderActionsCell(ticket)}
        </TableRow>
      );
    }

    return (
      <TableRow
        key={ticket.id}
        className="dark:border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200"
      >
        <TableCell
          className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
          title={ticket.name}
        >
          {ticket.name}
        </TableCell>
        <TableCell
          className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
          title={ticket.ticket.project_name}
        >
          {ticket.ticket.project_name}
        </TableCell>
        <TableCell
          className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
          title={ticket.ticket.namespace_name}
        >
          {ticket.ticket.namespace_name}
        </TableCell>
        <TableCell
          className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
          title={ticket.ticket.node_name}
        >
          {ticket.ticket.node_name || "N/A"}
        </TableCell>
        <TableCell
          className="pr-2 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis"
          title={ticket.ticket.organization_name}
        >
          {ticket.ticket.organization_name || "N/A"}
        </TableCell>
        <TableCell>
          <StatusChip status={getStatusLabel(ticket.status)} />
        </TableCell>
        <TableCell className="whitespace-nowrap text-sm">
          {formatDate(ticket.ticket.created_at)}
        </TableCell>
        {renderResourceUsageCell(ticket)}
        {renderActionsCell(ticket)}
      </TableRow>
    );
  };

  if (isLoading || resourceDetailsLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;

  const tickets =
    ticketsWithResourceDetails.length > 0
      ? ticketsWithResourceDetails
      : (data ?? []);

  // Apply status filter
  const filteredTickets = tickets.filter(
    (ticket: UserTicketResponse & { resourceDetails: ResourceDetail[] }) => {
      // If statusFilter is "all" or empty, show all tickets
      if (statusFilter === "all" || !statusFilter) {
        return true;
      }

      // If statusFilter is a Set
      if (statusFilter instanceof Set) {
        // If "all" is in the set, show all tickets
        if (statusFilter.has("all")) {
          return true;
        }
        return statusFilter.has(getStatusLabel(ticket.status));
      }

      return true;
    },
  );

  const sortedTickets = [...filteredTickets].sort(
    (
      a: UserTicketResponse & { resourceDetails: ResourceDetail[] },
      b: UserTicketResponse & { resourceDetails: ResourceDetail[] },
    ) => {
      let first = a;
      let second = b;

      if (sortDescriptor.direction === "descending") {
        [first, second] = [second, first];
      }

      switch (sortDescriptor.column) {
        case "name":
          return first.name.localeCompare(second.name);
        case "project":
          return first.ticket.project_name.localeCompare(
            second.ticket.project_name,
          );
        case "namespace":
          return first.ticket.namespace_name.localeCompare(
            second.ticket.namespace_name,
          );
        case "node":
          return (first.ticket.node_name || "").localeCompare(
            second.ticket.node_name || "",
          );
        case "organization":
          return (first.ticket.organization_name || "").localeCompare(
            second.ticket.organization_name || "",
          );
        case "owner":
          return (first.owner_name || "").localeCompare(
            second.owner_name || "",
          );
        case "status":
          return first.status.localeCompare(second.status);
        case "created":
          return (
            new Date(first.ticket.created_at).getTime() -
            new Date(second.ticket.created_at).getTime()
          );
        default:
          return 0;
      }
    },
  );

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
        removeWrapper
        aria-label="Ticket Table"
        className="table-fixed"
        classNames={{
          th: "first:w-8",
          td: "first:w-8",
        }}
        selectionBehavior={selectionBehavior}
        selectionMode={selectionMode}
        sortDescriptor={sortDescriptor}
        selectedKeys={new Set(selectedTickets)}
        onSelectionChange={(keys) => {
          if (onSelectionChange) {
            const selectedArray =
              keys === "all"
                ? sortedTickets.map((t: UserTicketResponse) => t.id)
                : Array.from(keys as Set<string>);
            onSelectionChange(selectedArray);
          }
        }}
        onSortChange={(descriptor: any) => setSortDescriptor(descriptor)}
      >
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
          {tableColumns.map((column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              className={`
                ${
                  column.uid === "name"
                    ? isResourcePool
                      ? "w-32"
                      : "w-32"
                    : ""
                }
                ${column.uid === "owner" ? "w-40" : ""}
                ${column.uid === "project" ? "w-32" : ""}
                ${column.uid === "namespace" ? "w-32" : ""}
                ${column.uid === "node" ? "w-32" : ""}
                ${column.uid === "organization" ? "w-32" : ""}
                ${column.uid === "status" ? "w-28" : ""}
                ${column.uid === "created" ? "w-36" : ""}
                ${column.uid === "usage" ? "w-48" : ""}
                ${column.uid === "actions" ? "w-16" : ""}
              `}
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {sortedTickets.map(
            (
              ticket: UserTicketResponse & {
                resourceDetails: ResourceDetail[];
              },
            ) => renderTableRow(ticket),
          )}
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
