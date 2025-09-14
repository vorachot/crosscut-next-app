"use client";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "next/navigation";

import ResourceCard from "./resource-card";
import ButtonClient from "./button-client";
import TicketTableClient from "./ticket-table-client";

import { useBreadcrumbData } from "@/hooks/useBreadCrumb";
import { useBreadcrumb } from "@/context/BreadCrumbContext";
import { getDisplayName } from "@/utils/helper";
import { NamespaceProvider } from "@/context/NamespaceContext";

const ResourcePoolDetailPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const namespaceId = params.namespaceId as string;
  const resourcePoolId = params.resourcePoolId as string;

  useBreadcrumbData({ projectId, namespaceId });

  const { breadcrumbData } = useBreadcrumb();

  return (
    <NamespaceProvider
      glidelet_urn={undefined}
      namespace_id={namespaceId}
      quota_id={resourcePoolId}
    >
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {resourcePoolId}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Resource pool in namespace{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {getDisplayName(namespaceId, breadcrumbData)}
              </span>{" "}
            </p>
          </div>
        </div>

        {/* Resource Usage Overview */}
        <ResourceCard usageData={[]} />

        {/* Tickets Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Tickets
              </h2>
            </div>
            <ButtonClient mode="tickets">
              <AddIcon className="mr-2" />
              Ticket
            </ButtonClient>
          </div>
          <TicketTableClient
            nsId={namespaceId}
            pathTemplate="resourcepool-to-ticket"
            selectionMode="none"
          />
        </div>
      </div>
    </NamespaceProvider>
  );
};

export default ResourcePoolDetailPage;
