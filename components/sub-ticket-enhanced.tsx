import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { useEffect, useState, useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { MoreVert, Close } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";

import ResourceChip from "./resource-chip";
import ViewTicketDetail from "./view-ticket-detail-";

import { SpecResource } from "@/types/ticket";
import { getResourceDetailByResourceIdFromCH } from "@/api/resource";
import { ResourceType, Status } from "@/types/enum";
import { getCachedOrFetch } from "@/utils/resourceCache";

type SubTicketEnhancedProps = {
  name?: string;
  resources?: SpecResource[];
  status?: string;
  url?: string;
  password?: string;
  taskStatus?: string;
};

const SubTicketEnhanced = ({
  name = "default-name",
  resources,
  status,
  url,
  password,
  taskStatus,
}: SubTicketEnhancedProps) => {
  const [resourcesWithDetails, setResourcesWithDetails] = useState<any[]>([]);
  const [resourceDetailsLoading, setResourceDetailsLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Memoize resource IDs to prevent unnecessary re-fetches
  const resourceIds = useMemo(
    () => resources?.map((r) => r.resource_id).join(",") || "",
    [resources]
  );

  useEffect(() => {
    const fetchResourceDetailsForTickets = async () => {
      if (!resources || resources.length === 0) return;

      setResourceDetailsLoading(true);
      try {
        const resourceDetails = await Promise.all(
          resources.map(async (resource: SpecResource) => {
            const resourceDetail = await getCachedOrFetch(
              resource.resource_id,
              () => getResourceDetailByResourceIdFromCH(resource.resource_id)
            );

            return { ...resource, resourceDetail };
          })
        );

        setResourcesWithDetails(resourceDetails);
      } catch (error) {
        toast.error("Error fetching resource details:" + error);
        setResourcesWithDetails(resources || []);
      } finally {
        setResourceDetailsLoading(false);
      }
    };

    fetchResourceDetailsForTickets();
  }, [resourceIds]);

  const handleViewClick = () => {
    setCancelDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setCancelDialogOpen(false);
  };

  return (
    <>
      <Toaster />
      <Card
        className="flex py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        radius="md"
        shadow="none"
      >
        <div className="flex gap-4 items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {name}
            </div>
            {/* {status && (
              <Chip size="sm" variant="dot">
                {status}
              </Chip>
            )} */}
          </div>

          <div className="flex flex-wrap gap-2">
            {resourcesWithDetails.map(
              (
                resource: SpecResource & {
                  resourceDetail: any;
                }
              ) => {
                return (
                  <div
                    key={resource.resource_id}
                    className="flex items-center gap-2"
                  >
                    {resourceDetailsLoading ? (
                      <span className="text-sm text-gray-500">Loading...</span>
                    ) : (
                      <>
                        {resource.resourceDetail.resource.resource_type.name ===
                          "CPU" && (
                          <ResourceChip
                            size="sm"
                            type={ResourceType.cpu}
                            value={resource.quantity}
                          />
                        )}
                        {resource.resourceDetail.resource.resource_type.name ===
                          "GPU" && (
                          <ResourceChip
                            size="sm"
                            type={ResourceType.gpu}
                            value={resource.quantity}
                          />
                        )}
                        {resource.resourceDetail.resource.resource_type.name ===
                          "RAM" && (
                          <ResourceChip
                            size="sm"
                            type={ResourceType.memory}
                            value={resource.quantity}
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              }
            )}
            {status === "redeemed" ? (
              <div className="relative flex gap-2">
                <Dropdown className="dark:bg-gray-900">
                  <DropdownTrigger className="!w-9 !h-9">
                    <div className="hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors duration-200 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer">
                      <MoreVert />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="view" onPress={handleViewClick}>
                      View
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <Button
                isIconOnly
                className="w-9 h-9 min-w-9"
                radius="full"
                size="sm"
                variant="light"
                onPress={() => toast(`Status: ${status || "Unknown"}`)}
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                  <Close className="!w-4 !h-4 text-gray-500 dark:text-gray-400" />
                </div>
              </Button>
            )}
          </div>
        </div>
      </Card>
      <ViewTicketDetail
        open={cancelDialogOpen}
        password={password}
        setOnClose={handleViewDialogClose}
        url={url}
      />
    </>
  );
};

export default SubTicketEnhanced;
