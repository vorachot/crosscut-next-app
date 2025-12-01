"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Selection } from "@heroui/table";
import useSWR from "swr";
import { ConfirmationNumber as TicketIcon } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import ResourceChip from "./resource-chip";

import Loading from "@/app/loading";
import { getUserTickets } from "@/api/ticket";
import { UserTicketResponse } from "@/types/ticket";
import { ResourceType } from "@/types/enum";
import { getResourceDetailByResourceIdFromCH } from "@/api/resource";
import { ResourceDetail } from "@/types/resource";

const defaultColumns = [
  { name: "TICKET", uid: "name", sortable: true },
  // { name: "STATUS", uid: "status", sortable: true },
  { name: "CREATED", uid: "created", sortable: true },
  { name: "ALLOCATED RESOURCES", uid: "usage", sortable: true },
];

type TicketTableProps = {
  columns?: typeof defaultColumns;
  // rows?: typeof defaultRows;
  selectionMode?: "multiple" | "single" | "none";
  selectionBehavior?: "replace" | "toggle";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  onAllTicketIds?: (ids: string[]) => void;
  // onRowClick?: (row: (typeof defaultRows)[number]) => void;
};

const TicketTableDrawer = ({
  columns = defaultColumns,
  // rows = defaultRows,
  selectionMode = "none",
  selectionBehavior = "replace",
  selectedKeys,
  onSelectionChange,
  onAllTicketIds,
}: TicketTableProps) => {
  const [ticketsWithResourceDetails, setTicketsWithResourceDetails] = useState<
    any[]
  >([]);
  const [resourceDetailsLoading, setResourceDetailsLoading] = useState(false);
  const { data, error, isLoading } = useSWR(
    ["tickets-history"],
    getUserTickets,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  const getResourceValueByType = (
    resourceDetails: any[],
    resourceType: ResourceType
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
                getResourceDetailByResourceIdFromCH(resource.resource_id)
              )
            );

            const resourcesWithDetails = ticket.ticket.spec.resource.map(
              (resource, i) => ({
                ...resource,
                detail: resourceDetails[i],
              })
            );

            return { ...ticket, resourceDetails: resourcesWithDetails };
          })
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
  const filteredTickets = useMemo(() => {
    const tickets =
      ticketsWithResourceDetails.length > 0
        ? ticketsWithResourceDetails
        : (data ?? []);

    return tickets.filter(
      (
        ticket: UserTicketResponse & {
          resourceDetails: ResourceDetail[];
        }
      ) => ticket.status === "ready"
    );
  }, [ticketsWithResourceDetails, data]);

  useEffect(() => {
    if (filteredTickets.length > 0 && onAllTicketIds) {
      const allIds = filteredTickets.map(
        (ticket: UserTicketResponse) => ticket.ticket.id
      );

      onAllTicketIds(allIds);
    }
  }, [filteredTickets, onAllTicketIds]);
  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;
  if (filteredTickets.length === 0) {
    return (
      <div className="text-center py-12">
        <TicketIcon className="!w-12 !h-12 mx-auto mb-4 text-gray-400" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No Available Tickets
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            You need to request a ticket before creating a task. Please request
            a ticket first to allocate resources.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table
      isHeaderSticky
      removeWrapper
      color="primary"
      selectedKeys={selectedKeys}
      selectionBehavior={selectionBehavior}
      selectionMode={selectionMode}
      onSelectionChange={onSelectionChange}
      // align="start"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.uid}>{column.name}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {filteredTickets.map(
          (
            ticket: UserTicketResponse & {
              resourceDetails: ResourceDetail[];
            }
          ) => (
            <TableRow key={ticket.ticket.id} className="hover:cursor-pointer">
              <TableCell className="text-xs">
                {/* {ticket.id.slice(0, 7)}... */}
                {ticket.name}
              </TableCell>
              <TableCell className="text-xs">
                {new Date(ticket.ticket.created_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </TableCell>
              <TableCell className="flex flex-row gap-2 items-center">
                {resourceDetailsLoading ? (
                  <span className="text-sm text-gray-500">Loading...</span>
                ) : (
                  <>
                    {getResourceValueByType(
                      ticket.resourceDetails || [],
                      ResourceType.cpu
                    ) > 0 && (
                      <ResourceChip
                        size="sm"
                        type={ResourceType.cpu}
                        value={getResourceValueByType(
                          ticket.resourceDetails || [],
                          ResourceType.cpu
                        )}
                      />
                    )}
                    {getResourceValueByType(
                      ticket.resourceDetails || [],
                      ResourceType.gpu
                    ) > 0 && (
                      <ResourceChip
                        size="sm"
                        type={ResourceType.gpu}
                        value={getResourceValueByType(
                          ticket.resourceDetails || [],
                          ResourceType.gpu
                        )}
                      />
                    )}
                    {getResourceValueByType(
                      ticket.resourceDetails || [],
                      ResourceType.memory
                    ) > 0 && (
                      <ResourceChip
                        size="sm"
                        type={ResourceType.memory}
                        value={getResourceValueByType(
                          ticket.resourceDetails || [],
                          ResourceType.memory
                        )}
                      />
                    )}
                  </>
                )}
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

export default TicketTableDrawer;
