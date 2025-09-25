"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import useSWR from "swr";
import { Divider } from "@heroui/divider";
import { useParams } from "next/navigation";

import TicketForm from "./ticketForm";

import { requestTicketToCH } from "@/api/ticket";
import Loading from "@/app/loading";
import { Quota, ResourceUsage } from "@/types/resource";
import {
  getQuotasByNamespaceIdFromCH,
  getQuotaUsageByNamespaceIdFromCH,
} from "@/api/quota";

type RequestDialogProps = {
  setOnClose?: () => void;
};

const RequestTicketDialog = ({ setOnClose }: RequestDialogProps) => {
  const params = useParams();
  const namespaceId = params.namespaceId as string;
  const resourcePoolId = params.resourcePoolId as string;
  const {
    data: quotasData,
    error: quotasError,
    isLoading: quotasLoading,
  } = useSWR(
    ["quotas", namespaceId],
    () => getQuotasByNamespaceIdFromCH(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );
  const {
    data: quotaUsageData,
    error: quotaUsageError,
    isLoading: quotaUsageLoading,
  } = useSWR(
    ["quota-usage", resourcePoolId, namespaceId],
    () => getQuotaUsageByNamespaceIdFromCH(resourcePoolId, namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  if (quotasLoading || quotaUsageLoading) return <Loading />;
  if (quotasError || quotaUsageError) return <div>Error loading quotas</div>;
  const quotas: Quota[] = quotasData.quotas || [];
  const quota = quotas.find((q) => q.id === resourcePoolId);

  const usageQuota: ResourceUsage[] = quotaUsageData.quotaUsage.usage || [];

  return (
    <Modal isOpen={true} scrollBehavior="inside" size="sm" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex flex-col w-full">
            <h2 className="text-xl font-semibold text-gray-700 gap-2 dark:text-gray-300">
              New Ticket
            </h2>
          </div>
        </ModalHeader>
        <Divider />
        <ModalBody className="px-1 pt-5">
          <TicketForm
            createTicketToCH={requestTicketToCH}
            namespace_id={namespaceId}
            quota={quota!}
            quota_id={resourcePoolId}
            setOnClose={setOnClose}
            usageQuota={usageQuota}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RequestTicketDialog;
