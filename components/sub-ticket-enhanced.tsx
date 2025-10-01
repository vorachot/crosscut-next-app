import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useEffect, useState } from "react";

import ResourceChip from "./resource-chip";

import { SpecResource } from "@/types/ticket";
import { getResourceDetailByResourceIdFromCH } from "@/api/resource";
import { ResourceType } from "@/types/enum";

type SubTicketEnhancedProps = {
  name?: string;
  resources?: SpecResource[];
  status?: string;
};

const SubTicketEnhanced = ({
  name = "default-name",
  resources,
  status,
}: SubTicketEnhancedProps) => {
  const [resourcesWithDetails, setResourcesWithDetails] = useState<any[]>([]);
  const [resourceDetailsLoading, setResourceDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchResourceDetailsForTickets = async () => {
      if (!resources || resources.length === 0) return;

      setResourceDetailsLoading(true);
      try {
        const resourceDetails = await Promise.all(
          resources.map(async (resource: SpecResource) => {
            const resourceDetail = await getResourceDetailByResourceIdFromCH(
              resource.resource_id,
            );

            return { ...resource, resourceDetail };
          }),
        );

        setResourcesWithDetails(resourceDetails);
      } catch (error) {
        console.error("Error fetching resource details:", error);
        setResourcesWithDetails(resources || []);
      } finally {
        setResourceDetailsLoading(false);
      }
    };

    fetchResourceDetailsForTickets();
  }, [resources]);

  return (
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
          {status && (
            <Chip size="sm" variant="dot">
              {status}
            </Chip>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {resourcesWithDetails.map(
            (
              resource: SpecResource & {
                resourceDetail: any;
              },
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
            },
          )}
        </div>
      </div>
    </Card>
  );
};

export default SubTicketEnhanced;
