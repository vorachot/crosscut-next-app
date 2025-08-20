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
      namespace_urn={`urn:crosscut:namespace:${namespaceId}`}
    >
      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-col items-start gap-2">
          <div className="text-4xl">Project: {projectId}</div>
          <div className="text-4xl">Namespace: {namespaceId}</div>
          <div className="text-4xl">Resource Pool: {resourcePoolId}</div>
          <div className="text-gray-500">Created: 01 Jan 2023</div>
        </div>
        <ResourceCard />
        <div className="flex flex-row justify-between gap-2">
          <div className="text-3xl">Tickets</div>
          <ButtonClient mode="tickets">
            <AddIcon />
            Ticket
          </ButtonClient>
        </div>
        <TicketTableClient
          nsId={namespaceId}
          pathTemplate="resourcepool-to-ticket"
          selectionMode="none"
        />
      </div>
    </NamespaceProvider>
  );
};

export default page;
