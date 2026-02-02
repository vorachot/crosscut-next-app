"use client";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { SVGProps, useState } from "react";
import { Selection } from "@heroui/table";

import ResourceCard from "./resource-card";
import ButtonClient from "./button-client";
import TicketTableClient from "./ticket-table-client";

import { useBreadcrumbData } from "@/hooks/useBreadCrumb";
import { useBreadcrumb } from "@/context/BreadCrumbContext";
import { getDisplayName } from "@/utils/helper";
import { NamespaceProvider } from "@/context/NamespaceContext";
import { getQuotaUsageByNamespaceIdFromCH } from "@/api/quota";
import Loading from "@/app/loading";
import { ResourceUsage } from "@/types/resource";
import { Status } from "@/types/enum";

export const statusOptions: { uid: Status; name: string }[] = Object.values(
  Status,
).map((status) => ({
  uid: status,
  name: status.toLowerCase(),
}));
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export const ChevronDownIcon = ({
  strokeWidth = 1.5,
  ...otherProps
}: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

const ResourcePoolDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const namespaceId = params.namespaceId as string;
  const resourcePoolId = params.resourcePoolId as string;
  const quotaId = searchParams.get("quota_id") as string;

  useBreadcrumbData({ projectId, namespaceId, resourcePoolId });

  const { breadcrumbData } = useBreadcrumb();
  const [statusFilter, setStatusFilter] = useState<Selection>("all");

  const { data, error, isLoading } = useSWR(
    ["quota-usage", namespaceId, quotaId],
    () => getQuotaUsageByNamespaceIdFromCH(quotaId, namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  // Helper function to check if a value looks like a UUID
  const isUUID = (str: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    return uuidRegex.test(str);
  };

  // Get display names or show loading state
  const resourcePoolDisplayName = getDisplayName(
    resourcePoolId!,
    breadcrumbData,
  );
  const namespaceDisplayName = getDisplayName(namespaceId, breadcrumbData);
  const projectDisplayName = getDisplayName(projectId, breadcrumbData);

  const isResourcePoolLoading =
    isUUID(resourcePoolId) &&
    resourcePoolDisplayName === resourcePoolId &&
    !breadcrumbData?.[resourcePoolId];
  const isNamespaceLoading =
    isUUID(namespaceId) &&
    namespaceDisplayName === namespaceId &&
    !breadcrumbData?.[namespaceId];
  const isProjectLoading =
    isUUID(projectId) &&
    projectDisplayName === projectId &&
    !breadcrumbData?.[projectId];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading tickets</div>;
  const usageData: ResourceUsage[] = data.quotaUsage.usage || [];

  return (
    <NamespaceProvider
      glidelet_urn={undefined}
      namespace_id={namespaceId}
      quota_id={quotaId}
    >
      <div className="container mx-auto pt-1 p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2 mb-2">
              {isResourcePoolLoading ? (
                <span className="inline-block w-48 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              ) : (
                resourcePoolDisplayName
              )}
            </h1>
            <p className="text-md text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-1">
              in namespace{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {isNamespaceLoading ? (
                  <span className="inline-block w-32 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                ) : (
                  namespaceDisplayName
                )}
              </span>
              , project{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {isProjectLoading ? (
                  <span className="inline-block w-32 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                ) : (
                  projectDisplayName
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Resource Usage Overview */}
        <ResourceCard usageData={usageData} />

        {/* Tickets Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Tickets
              </h2>
            </div>
            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    size="md"
                    variant="flat"
                  >
                    Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Status"
                  closeOnSelect={false}
                  selectedKeys={statusFilter}
                  selectionMode="multiple"
                  onSelectionChange={setStatusFilter}
                >
                  {statusOptions.map((status) => (
                    <DropdownItem key={status.uid} className="capitalize">
                      {status.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <ButtonClient mode="tickets">
                <AddIcon className="" />
                <div>Add Ticket</div>
              </ButtonClient>
            </div>
          </div>
          <TicketTableClient
            isResourcePool={true}
            nsId={namespaceId}
            pathTemplate="resourcepool-to-ticket"
            resourcePoolId={resourcePoolId}
            selectionMode="none"
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </NamespaceProvider>
  );
};

export default ResourcePoolDetailPage;
