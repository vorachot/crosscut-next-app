import AddIcon from "@mui/icons-material/Add";

import ButtonClient from "@/components/button-client";
import ResourceCard from "@/components/resource-card";
import TicketTableClient from "@/components/ticket-table-client";
import { NamespaceProvider } from "@/context/NamespaceContext";

const page = async ({
  params,
}: {
  params: { projectId: string; namespaceId: string; resourcePoolId: string };
}) => {
  const { projectId, namespaceId, resourcePoolId } = await params;

  return (
    <NamespaceProvider
      glidelet_urn={`urn:crosscut:glidelet:${projectId}`}
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
                {namespaceId}
              </span>{" "}
            </p>
          </div>
        </div>

        {/* Resource Usage Overview */}
        <ResourceCard />

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

export default page;
